<template>
  <div class="row">
    <div class="col-12">
      <!-- Collapsible form -->
      <b-card>
        <b-card-header id="formCollapseHeader">
          <h5 class="mb-0">
            <button class="btn btn-link" type="button" @click="toggleCollapse">
              Ajouter un nouveau revenu
              <span class="arrow" :class="{ 'rotated': isCollapsed }"></span>
            </button>
          </h5>
        </b-card-header>
        <b-collapse id="formCollapse" v-model="isCollapsed">
          <b-card-body>
            <form @submit.prevent="submitForm" class="needs-validation" novalidate>
              <div class="form-group">
                <label for="revenue">Revenue</label>
                <input v-model="formData.revenue" type="number" class="form-control" id="revenue" placeholder="Revenue" required>
                <div class="invalid-feedback">Please enter a valid revenue.</div>
              </div>
              <div class="form-group">
                <label for="caisseId">Caisse ID</label>
                <select v-model="formData.caisseId" class="form-control" id="caisseId" required>
                  <option v-for="caisse in caisses" :value="caisse.id" :key="caisse.id">{{ caisse.id }}</option>
                </select>
                <div class="invalid-feedback">Please select a Caisse ID.</div>
              </div>
              <button type="submit" class="btn btn-primary">Add Revenue</button>
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
                  <button class="btn btn-danger" @click="deleteRevenue(item)">Supprimer</button>
                  <button class="btn btn-warning" @click="openEditModal(item)">Modifier</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </card>

      <!-- Edit Revenue Modal -->
      <b-modal ref="editModal" title="Edit Revenue">
        <form @submit.prevent="submitEditForm">
          <div class="form-group">
            <label for="editRevenue">Revenue</label>
            <input v-model="editFormData.revenue" type="number" class="form-control" id="editRevenue" required>
          </div>
          <div class="form-group">
            <label for="editCaisseId">Caisse ID</label>
            <select v-model="editFormData.caisseId" class="form-control" id="editCaisseId" required>
              <option v-for="caisse in caisses" :value="caisse.id" :key="caisse.id">{{ caisse.id }}</option>
            </select>
          </div>
          <button type="submit" class="btn btn-primary">Save Changes</button>
        </form>
      </b-modal>
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
        revenue: '',
        caisseId: null, // Initialize to null
      },
      editFormData: {
        id: null,
        revenue: '',
        caisseId: null,
      },
      table1: {
        title: "Revenue Table",
        subTitle: "Here is a subtitle for this table",
        columns: ["ID", "Revenue", "Caisse ID"],
        data: [] // Initialize as empty array
      },
      caisses: [], // To store the caisses fetched from the server
    };
  },
  mounted() {
    this.fetchRevenue(); // Fetch revenue when the component is mounted
    this.fetchCaisses(); // Fetch caisses when the component is mounted
  },
  methods: {
    toggleCollapse() {
      this.isCollapsed = !this.isCollapsed;
    },
    async fetchRevenue() {
      try {
        // Fetch revenue from your server-side endpoint
        const response = await axios.get('http://localhost:5000/revnue');
        // Map fetched data to match the table structure
        this.table1.data = response.data.data.map(revenue => ({
          ID: revenue.id,
          Revenue: revenue.Revnue,
          "Caisse ID": revenue.CaisseId
        }));
      } catch (error) {
        console.error('Error fetching revenue:', error);
      }
    },
    async fetchCaisses() {
      try {
        // Fetch caisses from your server-side endpoint
        const response = await axios.get('http://localhost:5000/caisse');
        // Store fetched caisses
        this.caisses = response.data.data;
      } catch (error) {
        console.error('Error fetching caisses:', error);
      }
    },
    async submitForm() {
      try {
        // Send POST request to add a new revenue
        const response = await axios.post('http://localhost:5000/revnue', {
          Revnue: this.formData.revenue,
          CaisseId: this.formData.caisseId // Include the Caisse ID in the request
        });
        // Update the table data if the request is successful
        if (response.status === 201) {
          this.table1.data.push({
            ID: response.data.id,
            Revenue: response.data.Revnue,
            "Caisse ID": response.data.CaisseId
          });
          await this.fetchRevenue();
          // Clear the form after adding the revenue
          this.formData.revenue = '';
          this.formData.caisseId = null; // Clear the Caisse ID field as well
        }
      } catch (error) {
        console.error('Error adding revenue:', error);
      }
    },
    async deleteRevenue(revenue) {
      const confirmation = confirm("Are you sure you want to delete this revenue?");
      if (confirmation) {
        try {
          // Send DELETE request to delete the revenue
          await axios.delete(`http://localhost:5000/revnue/${revenue.ID}`);
          // Refresh the table after deletion
          this.fetchRevenue();
        } catch (error) {
          console.error('Error deleting revenue:', error);
        }
      }
    },
    openEditModal(revenue) {
      this.editFormData.id = revenue.ID;
      this.editFormData.revenue = revenue.Revenue;
      this.editFormData.caisseId = revenue["Caisse ID"];
      this.$refs.editModal.show();
    },
    async submitEditForm() {
      try {
        // Send PUT request to update the revenue
        await axios.put(`http://localhost:5000/revnue/${this.editFormData.id}`, {
          Revnue: this.editFormData.revenue,
          CaisseId: this.editFormData.caisseId // Include the updated Caisse ID in the request
        });
        // Hide the modal after editing
        this.$refs.editModal.hide();
        // Refresh the table after editing
        this.fetchRevenue();
      } catch (error) {
        console.error('Error editing revenue:', error);
      }
    },
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
