<template>
  <div class="row">
    <div class="col-12">
      <!-- Collapsible form -->
      <b-card>
        <b-card-header id="formCollapseHeader">
          <h5 class="mb-0">
            <button class="btn btn-link" type="button" @click="toggleCollapse">
              Ajouter une nouvelle province
              <span class="arrow" :class="{ 'rotated': isCollapsed }"></span>
            </button>
          </h5>
        </b-card-header>

        <b-collapse id="formCollapse" v-model="isCollapsed">
          <b-card-body>
            <form @submit.prevent="submitForm">
              <div class="form-group">
                <input v-model="formData.province" type="text" class="form-control" id="province" placeholder="province name" required>
              </div>
              <button type="submit" class="btn btn-primary">Ajouter province</button>
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
                  <button class="btn btn-danger" @click="deleteRole(item)">Supprimer</button>
                  <button class="btn btn-warning" @click="editRole(item)">Modifier</button>
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
        province: ''
      },
      table1: {
        title: "Table des régions",
        subTitle: "régions",
        columns: ["Id", "province"],
        data: [] // Initialize as empty array
      }
    };
  },
  mounted() {
    this.fetchRoles(); // Fetch roles when the component is mounted
  },
  methods: {
    toggleCollapse() {
      this.isCollapsed = !this.isCollapsed;
    },
    async fetchRoles() {
      try {
        // Fetch roles from your server-side endpoint
        const response = await axios.get('http://localhost:5000/RegionRoute/regions');
        // Map fetched data to match the table structure
        this.table1.data = response.data.map(role => ({
          Id: role.id,
          province: role.province
        }));
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    },
    async submitForm() {
      try {
        // Send POST request to add a new role
        const response = await axios.post('http://localhost:5000/RegionRoute/regions', {
          province: this.formData.province
        });
        // Update the table data if the request is successful
        if (response.status === 201) {
          this.table1.data.push({
            Id: response.data.id,
            province: response.data.province
          });
          // Clear the form after adding the role
          this.formData.province = '';
        }
      } catch (error) {
        console.error('Error adding province:', error);
      }
    },
    deleteRole(role) {
      const confirmation = confirm("Are you sure you want to delete this role?");
      if (confirmation) {
        axios.delete(`http://localhost:5000/RegionRoute/regions/${role.Id}`)
          .then(() => {
            this.fetchRoles(); // Refresh the table after deletion
          })
          .catch(error => {
            console.error('Error deleting role:', error);
          });
      }
    },
    editRole(role) {
      const newRoleName = prompt("Enter the new role name:", role.province);
      if (newRoleName !== null) {
        axios.put(`http://localhost:5000/RegionRoute/regions/${role.Id}`, { province: newRoleName })
          .then(() => {
            this.fetchRoles(); // Refresh the table after editing
          })
          .catch(error => {
            console.error('Error editing role:', error);
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
.card .card-body {
    padding: 15px 15px 20px 15px;
}
</style>
