<template>
  <div class="row">
    <div class="col-12">
      <!-- Collapsible form -->
      <b-card>
        <b-card-header id="formCollapseHeader">
          <h5 class="mb-0">
            <button class="btn btn-link" type="button" @click="toggleCollapse">
             Add New Supplier
              <span class="arrow" :class="{ 'rotated': isCollapsed }"></span>
            </button>
          </h5>
        </b-card-header>
        <b-collapse id="formCollapse" v-model="isCollapsed">
          <b-card-body>
            <form @submit.prevent="submitForm">
              <div class="form-group">
                <input v-model="formData.fund" type="number" class="form-control" id="fund" placeholder="Fund" required>
              </div>
              <button type="submit" class="btn btn-primary">Add Supplier</button>
            </form>
          </b-card-body>
        </b-collapse>
      </b-card>
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
                  <button class="btn btn-danger" @click="deleteSupplier(item)">Delete</button>
                  <button class="btn btn-warning" @click="editSupplier(item)">Edit</button>
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
import { BCard, BCardHeader, BCardBody, BCollapse } from 'bootstrap-vue';
import axios from 'axios';

export default {
  components: {
    BCard,
    BCardHeader,
    BCardBody,
    BCollapse,
  },
  data() {
    return {
      isCollapsed: false,
      formData: {
        fund: ''
      },
      table1: {
        title: "Supplier Table",
        subTitle: "Here is a subtitle for this table",
        columns: ["ID", "Fund"],
        data: [] // Initialize as empty array
      }
    };
  },
  mounted() {
    this.fetchSuppliers(); // Fetch suppliers when the component is mounted
  },
  methods: {
    toggleCollapse() {
      this.isCollapsed = !this.isCollapsed;
    },
    async fetchSuppliers() {
      try {
        // Fetch suppliers from your server-side endpoint
        const response = await axios.get('http://localhost:5000/fournisseurRoute');
        // Map fetched data to match the table structure
        this.table1.data = response.data.data.map(supplier => ({
          ID: supplier.id,
          Fund: supplier.FondCaisse,
         
        }));
      } catch (error) {
        console.error('Error fetching suppliers:', error);
      }
    },
    async submitForm() {
      try {
        // Send POST request to add a new supplier
        const response = await axios.post('http://localhost:5000/fournisseurRoute', {
          FondCaisse: this.formData.fund
        });
        // Update the table data if the request is successful
        if (response.status === 201) {
          this.table1.data.push({
            ID: response.data.id,
            Fund: response.data.FondCaisse,
           
          });
          // Clear the form after adding the supplier
          this.formData.fund = '';
        }
      } catch (error) {
        console.error('Error adding supplier:', error);
      }
    },
    async deleteSupplier(supplier) {
      const confirmation = confirm("Are you sure you want to delete this supplier?");
      if (confirmation) {
        try {
          // Send DELETE request to delete the supplier
          await axios.delete(`http://localhost:5000/fournisseurRoute/${supplier.ID}`);
          // Refresh the table after deletion
          this.fetchSuppliers();
        } catch (error) {
          console.error('Error deleting supplier:', error);
        }
      }
    },
    editSupplier(supplier) {
      const newFund = prompt("Enter the new fund:", supplier.Fund);
      if (newFund !== null) {
        axios.put(`http://localhost:5000/fournisseurRoute/${supplier.ID}`, {
          FondCaisse: newFund
        })
        .then(() => {
          this.fetchSuppliers(); // Refresh the table after editing
        })
        .catch(error => {
          console.error('Error editing supplier:', error);
        });
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
</style>
