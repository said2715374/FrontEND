<template>
  <div class="row">
    <div class="col-12">
      <!-- Collapsible form -->
      <b-card>
        <b-card-header id="formCollapseHeader">
          <h5 class="mb-0">
            <button class="btn btn-link" type="button" @click="toggleCollapse">
              Ajouter une nouvelle transaction
              <span class="arrow" :class="{ 'rotated': isCollapsed }"></span>
            </button>
          </h5>
        </b-card-header>
        <b-collapse id="formCollapse" v-model="isCollapsed">
          <b-card-body>
            <form @submit.prevent="submitForm" class="needs-validation" novalidate>
              <div class="form-group">
                <label for="date">Date:</label>
                <input v-model="formData.date" type="date" class="form-control" id="date" required>
                <div class="invalid-feedback">Please enter a valid date.</div>
              </div>
              <div class="form-group">
                <label for="employeeNumber">Employee Number:</label>
                <input v-model="formData.employeeNumber" type="number" class="form-control" id="employeeNumber" placeholder="Enter Employee Number" required>
                <div class="invalid-feedback">Please enter a valid employee number.</div>
              </div>
              <div class="form-group">
                <label for="amount">Montant</label>
                <input v-model="formData.amount" type="number" class="form-control" id="amount" placeholder="Enter Amount" required>
                <div class="invalid-feedback">Please enter a valid amount.</div>
              </div>
              <div class="form-group">
                <label for="cashierId">Cashier ID:</label>
                <select v-model="formData.cashierId" class="form-control" id="cashierId" required>
                  <option v-for="caisse in caisses" :value="caisse.id" :key="caisse.id">{{ caisse.id }}</option>
                </select>
                <div class="invalid-feedback">Please select a cashier ID.</div>
              </div>
              <div class="form-group">
                <label for="paymentModeId">Payment Mode:</label>
                <select v-model="formData.paymentModeId" class="form-control" id="paymentModeId" required>
                  <option value="" disabled selected>Select Payment Mode</option>
                  <option v-for="mode in paymentModes" :key="mode.id" :value="mode.id">{{ mode.process }}</option>
                </select>
                <div class="invalid-feedback">Please select a payment mode.</div>
              </div>
              <button type="submit" class="btn btn-primary">Add Product</button>
            </form>
          </b-card-body>
        </b-collapse>
      </b-card>

      <!-- Bootstrap Modal for Edit -->
      <b-modal ref="editModal" title="Edit Transaction" @ok="submitEditForm">
        <div>
          <div class="form-group">
            <label for="editDate">Date:</label>
            <input v-model="editFormData.date" type="date" class="form-control" id="editDate" required>
          </div>
          <div class="form-group">
            <label for="editEmployeeNumber">Employee Number:</label>
            <input v-model="editFormData.employeeNumber" type="number" class="form-control" id="editEmployeeNumber" required>
          </div>
          <div class="form-group">
            <label for="editAmount">Amount:</label>
            <input v-model="editFormData.amount" type="number" class="form-control" id="editAmount" required>
          </div>
          <div class="form-group">
            <label for="editCashierId">Cashier ID:</label>
            <select v-model="editFormData.cashierId" class="form-control" id="editCashierId" required>
              <option v-for="caisse in caisses" :value="caisse.id" :key="caisse.id">{{ caisse.id }}</option>
            </select>
          </div>
          <div class="form-group">
            <label for="editPaymentModeId">Payment Mode:</label>
            <select v-model="editFormData.paymentModeId" class="form-control" id="editPaymentModeId" required>
              <option value="" disabled selected>Select Payment Mode</option>
              <option v-for="mode in paymentModes" :key="mode.id" :value="mode.id">{{ mode.process }}</option>
            </select>
          </div>
        </div>
      </b-modal>

      <!-- Your existing card -->
      <card :title="table1.title" :subTitle="table1.subTitle">
        <div slot="raw-content" class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th v-for="column in table1.columns" :key="column">{{ column }}</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in table1.data" :key="index">
                <td v-for="(value, key) in item" :key="key">{{ value }}</td>
                <td>
                  <button class="btn btn-danger" @click="deleteProduct(item)">Delete</button>
                  <button class="btn btn-warning" @click="editProduct(item)">Edit</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </card>
    </div>
  </div>
</template>

<script>
import { BCard, BCardHeader, BCardBody, BCollapse, BModal } from 'bootstrap-vue';
import axios from 'axios';

export default {
  components: {
    BCard,
    BCardHeader,
    BCardBody,
    BCollapse,
    BModal,
  },
  data() {
    return {
      isCollapsed: false,
      formData: {
        date: '',
        employeeNumber: '',
        amount: '',
        cashierId: '',
        paymentModeId: ''
      },
      editFormData: {
        id: '',
        date: '',
        employeeNumber: '',
        amount: '',
        cashierId: '',
        paymentModeId: ''
      },
      table1: {
        title: "Table des transactions",
        subTitle: "transactions",
        columns: ["ID", "Date", "Employee Number", "Amount", "Cashier ID", "Payment Mode"],
        data: [] // Initialize as empty array
      },
      caisses: [], // Initialize caisses array
      paymentModes: [] // Initialize paymentModes array
    };
  },
  mounted() {
    this.fetchProducts();
    this.fetchCaisses();
    this.fetchPaymentModes();
  },
  methods: {
    toggleCollapse() {
      this.isCollapsed = !this.isCollapsed;
    },
    async fetchProducts() {
      try {
        // Fetch products from your server-side endpoint
        const response = await axios.get('http://localhost:5000/transactionRouter');
        // Fetch payment modes from your server-side endpoint
        const paymentModesResponse = await axios.get('http://localhost:5000/modePaiementRouter');
        const paymentModes = paymentModesResponse.data.data;

        // Map fetched data to match the table structure
        this.table1.data = response.data.data.map(product => {
          // Find the corresponding payment mode for the current product's ModePaiementId
          const paymentMode = paymentModes.find(mode => mode.id === product.ModePaiementId);
          // If a payment mode is found, use its process value; otherwise, use an empty string
          const paymentProcess = paymentMode ? paymentMode.process : '';

          return {
            ID: product.id,
            Date: product.date,
            "Employee Number": product.numero_employer,
            Amount: product.montant,
            "Cashier ID": product.CaisseId,
            "Payment Mode": paymentProcess
          };
        });
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    },
    async fetchCaisses() {
      try {
        // Fetch caisses from your server-side endpoint
        const response = await axios.get('http://localhost:5000/caisse');
        this.caisses = response.data.data;
      } catch (error) {
        console.error('Error fetching caisses:', error);
      }
    },
    async fetchPaymentModes() {
      try {
        // Fetch payment modes from your server-side endpoint
        const response = await axios.get('http://localhost:5000/modePaiementRouter');
        this.paymentModes = response.data.data;
      } catch (error) {
        console.error('Error fetching payment modes:', error);
      }
    },
    async submitForm() {
      try {
        // Send POST request to add a new product
        const response = await axios.post('http://localhost:5000/transactionRouter', {
          date: this.formData.date,
          numero_employer: this.formData.employeeNumber,
          montant: this.formData.amount,
          CaisseId: this.formData.cashierId,
          ModePaiementId: this.formData.paymentModeId
        });
        // Update the table data if the request is successful
        if (response.status === 201) {
          this.table1.data.push({
            ID: response.data.id,
            Date: response.data.date,
            "Employee Number": response.data.numero_employer,
            Amount: response.data.montant,
            "Cashier ID": response.data.CaisseId,
            "Payment Mode": response.data.process // Use process instead of ModePaiementId
          });
          // Clear the form after adding the product
          this.formData.date = '';
          this.formData.employeeNumber = '';
          this.formData.amount = '';
          this.formData.cashierId = '';
          this.formData.paymentModeId = '';
        }
      } catch (error) {
        console.error('Error adding product:', error);
      }
    },
    async deleteProduct(product) {
      const confirmation = confirm("Are you sure you want to delete this product?");
      if (confirmation) {
        try {
          // Send DELETE request to delete the product
          await axios.delete(`http://localhost:5000/transactionRouter/${product.ID}`);
          // Refresh the table after deletion
          this.fetchProducts();
        } catch (error) {
          console.error('Error deleting product:', error);
        }
      }
    },
    editProduct(product) {
      // Set editFormData with the product data
      this.editFormData = {
        id: product.ID,
        date: product.Date,
        employeeNumber: product["Employee Number"],
        amount: product.Amount,
        cashierId: product["Cashier ID"],
        paymentModeId: product["Payment Mode"]
      };
      // Show the edit modal
      this.$refs.editModal.show();
    },
    submitEditForm() {
      try {
        // Send PUT request to edit the product
        axios.put(`http://localhost:5000/transactionRouter/${this.editFormData.id}`, {
          date: this.editFormData.date,
          numero_employer: this.editFormData.employeeNumber,
          montant: this.editFormData.amount,
          CaisseId: this.editFormData.cashierId,
          ModePaiementId: this.editFormData.paymentModeId
        })
        .then(() => {
          this.fetchProducts(); // Refresh the table after editing
          this.$refs.editModal.hide(); // Hide the edit modal
        })
        .catch(error => {
          console.error('Error editing product:', error);
        });
      } catch (error) {
        console.error('Error editing product:', error);
      }
    }
  }
};
</script>

<style scoped>
/* Styling for the arrow */
.arrow {
  display: inline-block;
  width: 0;
  height: 0;
  vertical-align: middle;
  border: solid;
  border-width: 0.2em 0.2em 0 0.2em;
  border-color: #000000;
  transition: transform 0.3s;
}

/* Styling for the arrow when the form is collapsed */
.rotated {
  transform: rotate(-90deg);
}
.card .card-body {
  padding: 15px 15px 20px 15px;
}
</style>
