<template>
  <div class="row">
    <div class="col-12">
      <!-- Collapsible form -->
      <b-card>
        <b-card-header id="formCollapseHeader">
          <h5 class="mb-0">
            <button class="btn btn-link" type="button" @click="toggleCollapse">
              Ajouter un produit
              <span class="arrow" :class="{ 'rotated': isCollapsed }"></span>
            </button>
          </h5>
        </b-card-header>

        <b-collapse id="formCollapse" v-model="isCollapsed">
          <b-card-body>
            <form @submit.prevent="submitForm">
              <div class="form-group">
                <label for="productName">Nom du produit:</label>
                <input v-model="formData.name" type="text" class="form-control" id="productName" placeholder="Enter nom de produit" required>
              </div>
              <div class="form-group">
                <label for="entryDate">Entry Date:</label>
                <input v-model="formData.entryDate" type="date" class="form-control" id="entryDate" required>
              </div>
              <div class="form-group">
                <label for="expirationDate">Expiration Date:</label>
                <input v-model="formData.expirationDate" type="date" class="form-control" id="expirationDate" required>
              </div>
              <div class="form-group">
                <label for="quantity">Quantity:</label>
                <input v-model="formData.quantity" type="number" class="form-control" id="quantity" placeholder="Enter Quantity" required>
              </div>
              <div class="form-group">
                <label for="price">Prix:</label>
                <input v-model="formData.price" type="number" class="form-control" id="prix" placeholder="Enter Prix" required>
              </div>
              <div class="form-group">
                <label for="MagasinId">magasin ID:</label>
                <select v-model="formData.MagasinId" class="form-control" id="MagasinId" required>
                  <option v-for="store in stores" :value="store.id" :key="store.id">{{ store.id }}</option>
                </select>
              </div>
              <button type="submit" class="btn btn-primary">Ajouter un produit</button>
            </form>
          </b-card-body>
        </b-collapse>
      </b-card>

      <!-- Bootstrap Modal for Edit -->
      <b-modal ref="editModal" title="Edit Product" @ok="submitEditForm">
        <div>
          <div class="form-group">
            <label for="editProductName">Nom du produit:</label>
            <input v-model="editFormData.name" type="text" class="form-control" id="editProductName" required>
          </div>
          <div class="form-group">
            <label for="editEntryDate">Entry Date:</label>
            <input v-model="editFormData.entryDate" type="date" class="form-control" id="editEntryDate" required>
          </div>
          <div class="form-group">
            <label for="editExpirationDate">Expiration Date:</label>
            <input v-model="editFormData.expirationDate" type="date" class="form-control" id="editExpirationDate" required>
          </div>
          <div class="form-group">
            <label for="editQuantity">Quantity:</label>
            <input v-model="editFormData.quantity" type="number" class="form-control" id="editQuantity" required>
          </div>
          <div class="form-group">
            <label for="editPrice">Price:</label>
            <input v-model="editFormData.price" type="number" class="form-control" id="editPrice" required>
          </div>
          <div class="form-group">
            <label for="editMagasinId">magasin ID:</label>
            <select v-model="editFormData.MagasinId" class="form-control" id="editMagasinId" required>
              <option v-for="store in stores" :value="store.id" :key="store.id">{{ store.id }}</option>
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
                  <button class="btn btn-danger" @click="deleteRole(item)">Delete</button>
                  <button class="btn btn-warning" @click="editRole(item)">Edit</button>
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
        name: '',
        entryDate: '',
        expirationDate: '',
        quantity: '',
        price: '',
        MagasinId: ''
      },
      editFormData: {
        name: '',
        entryDate: '',
        expirationDate: '',
        quantity: '',
        price: '',
        MagasinId: ''
      },
      table1: {
        title: "Table des produits",
        subTitle: "produits",
        columns: ["ID", "Name", "Entry Date", "Expiration Date", "Quantity", "Price", "Store ID"],
        data: [] // Initialize as an empty array
      },
      stores: [] // Initialize stores array
    };
  },
  mounted() {
    this.fetchRoles(); // Fetch roles when the component is mounted
    this.fetchStores(); // Fetch stores when the component is mounted
  },
  methods: {
    toggleCollapse() {
      this.isCollapsed = !this.isCollapsed;
    },
    async fetchRoles() {
      try {
        // Fetch products from your server-side endpoint
        const response = await axios.get('http://localhost:5000/produitRouter/produits');
        // Map fetched data to match the table structure and format dates
        this.table1.data = response.data.data.map(product => ({
          ID: product.id,
          Name: product.nom,
          "Entry Date": this.formatDate(product.dateEntree),
          "Expiration Date": this.formatDate(product.dateExpiration),
          Quantity: product.quantite,
          Price: product.prix,
          "Store ID": product.MagasinId
        }));
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    },
    async fetchStores() {
      try {
        // Fetch stores from your server-side endpoint
        const response = await axios.get('http://localhost:5000/magasinRouter');
        this.stores = response.data.data;
      } catch (error) {
        console.error('Error fetching stores:', error);
      }
    },
    async submitForm() {
      try {
        // Send POST request to add a new product
        const response = await axios.post('http://localhost:5000/produitRouter/produits', {
          nom: this.formData.name,
          dateEntree: this.formData.entryDate,
          dateExpiration: this.formData.expirationDate,
          quantite: this.formData.quantity,
          prix: this.formData.price,
          MagasinId: this.formData.MagasinId // Include MagasinId in the request
        });
        // Update the table data if the request is successful
        if (response.status === 201) {
          this.table1.data.push({
            ID: response.data.id,
            Name: response.data.nom,
            "Entry Date": this.formatDate(response.data.dateEntree),
            "Expiration Date": this.formatDate(response.data.dateExpiration),
            Quantity: response.data.quantite,
            Price: response.data.prix,
            "Store ID": response.data.MagasinId
          });
          // Clear the form after adding the product
          await this.fetchRoles();
          this.formData.name = '';
          this.formData.entryDate = '';
          this.formData.expirationDate = '';
          this.formData.quantity = '';
          this.formData.price = '';
          this.formData.MagasinId = ''; // Reset MagasinId after submission
        }
      } catch (error) {
        console.error('Error adding product:', error);
      }
    },
    formatDate(dateString) {
      // Parse the date string into a Date object
      const date = new Date(dateString);
      // Format the date as desired (e.g., MM/DD/YYYY)
      const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
      return formattedDate;
    },
    deleteRole(role) {
      const confirmation = confirm("Are you sure you want to delete this role?");
      if (confirmation) {
        axios.delete(`http://localhost:5000/produitRouter/produits/${role.ID}`)
          .then(() => {
            this.fetchRoles(); // Refresh the table after deletion
          })
          .catch(error => {
            console.error('Error deleting role:', error);
          });
      }
    },
    editRole(role) {
      // Set editFormData with the role data
      this.editFormData = {
        ID: role.ID,
        name: role.Name,
        entryDate: role["Entry Date"],
        expirationDate: role["Expiration Date"],
        quantity: role.Quantity,
        price: role.Price,
        MagasinId: role["Store ID"]
      };
      // Show the edit modal
      this.$refs.editModal.show();
    },
    submitEditForm() {
  try {
    // Send PUT request to update the product
    axios.put(`http://localhost:5000/produitRouter/produits/${this.editFormData.ID}`, {
      nom: this.editFormData.name,
      dateEntree: this.editFormData.entryDate,
      dateExpiration: this.editFormData.expirationDate,
      quantite: this.editFormData.quantity,
      prix: this.editFormData.price,
      MagasinId: this.editFormData.MagasinId
    })
    .then(() => {
      // Find the index of the edited product in the table data
      const index = this.table1.data.findIndex(item => item.ID === this.editFormData.ID);
      // If the index is found, update the product data
      if (index !== -1) {
        
        this.table1.data[index].Name = this.editFormData.name;
        this.table1.data[index]["Entry Date"] = this.editFormData.entryDate;
        this.table1.data[index]["Expiration Date"] = this.editFormData.expirationDate;
        this.table1.data[index].Quantity = this.editFormData.quantity;
        this.table1.data[index].Price = this.editFormData.price;
        this.table1.data[index]["Store ID"] = this.editFormData.MagasinId;
        
      }
      this.$refs.editModal.hide(); 
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
