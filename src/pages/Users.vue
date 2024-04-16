<template>
  <div class="row">
    <div class="col-12">
      <!-- Collapsible form -->
      <b-card>
        <b-card-header id="formCollapseHeader">
          <h5 class="mb-0">
            <button class="btn btn-link" type="button" @click="toggleCollapse">
              Ajouter un nouvel utilisateur
              <span class="arrow" :class="{ 'rotated': isCollapsed }"></span>
            </button>
          </h5>
        </b-card-header>

        <b-collapse id="formCollapse" v-model="isCollapsed">
          <b-card-body>
            <form @submit.prevent="submitForm">
              <div class="form-group">
                <label for="nom">Nom:</label>
                <input v-model="formData.nom" type="text" class="form-control" id="nom" placeholder="Enter Nom" required>
              </div>
              <div class="form-group">
                <label for="prenom">Prenom:</label>
                <input v-model="formData.prenom" type="text" class="form-control" id="prenom" placeholder="Enter Prenom" required>
              </div>
              <div class="form-group">
                <label for="DateNaissance">Date de Naissance:</label>
                <input v-model="formData.DateNaissance" type="date" class="form-control" id="DateNaissance" required>
              </div>
              <div class="form-group">
                <label for="Telephone">Telephone:</label>
                <input v-model="formData.Telephone" type="text" class="form-control" id="Telephone" placeholder="Enter Telephone" required>
              </div>
              <div class="form-group">
                <label for="email">email:</label>
                <input v-model="formData.email" type="text" class="form-control" id="email" placeholder="Enter email" required>
              </div>
              <div class="form-group">
                <label for="MotDePasse">Mot de Passe:</label>
                <input v-model="formData.MotDePasse" type="text" class="form-control" id="MotDePasse" placeholder="Enter Mot de Passe" required>
              </div>
              <div class="form-group">
                <label for="RoleId">Select Role:</label>
                <select v-model="formData.RoleId" class="form-control" id="RoleId" required>
                  <option value="" disabled selected>Select Role</option> <!-- Placeholder option -->
                  <option v-for="role in roles" :key="role.id" :value="role.id">{{ role.role }}</option>
                </select>
              </div>
              <div class="form-group">
                <label for="MagasinId">Magasin ID:</label>
                <select v-model="formData.MagasinId" class="form-control" id="MagasinId" >
                  <option value="" disabled selected>Select Magasin superviseur</option> <!-- Placeholder option -->
                  <option v-for="magasin in magasins" :key="magasin.id" :value="magasin.id">{{ magasin.superviseur }}</option>
                </select>
              </div>
              <button type="submit" class="btn btn-primary">Add User</button>
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
                <td v-for="(value, key) in item" :key="key">
                  <span v-if="!item.editable">{{ value }}</span>
                  <input v-model="item[key]" v-else class="form-control">
                </td>
                <td>
                  <button class="btn btn-danger" @click="deleteUser(item)">Supprimer</button>
                  <button class="btn btn-warning" @click="toggleEdit(item)">{{ item.editable ? 'Save' : 'Modifier' }}</button>
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
        role: ''
      },
      table1: {
        title: "Tableau des utilisateurs",
        subTitle: "utilisateurs",
        columns: ["Id", "nom", "prenom","DateNaissance", "Telephone","Email","RoleId","MagasinId"],
        data: [] // Initialize as empty array
      },
      roles: [], // Array to store fetched roles
      magasins: [] // Array to store fetched magasins
    };
  },
  mounted() {
    this.fetchUsers(); // Fetch roles when the component is mounted
    this.fetchRoles(); // Fetch roles options
    this.fetchMagasins(); // Fetch magasins options
  },
  methods: {
    deleteUser(user) {
      const confirmation = confirm("Are you sure you want to delete this user?");
      if (confirmation) {
        axios.delete(`http://localhost:5000/utilisateurs/${user.Id}`)
          .then(() => {
            this.fetchUsers(); // Refresh the table after deletion
          })
          .catch(error => {
            console.error('Error deleting user:', error);
          });
      }
    },
    async fetchRoles() {
      try {
        // Fetch roles options from your server-side endpoint
        const response = await axios.get('http://localhost:5000/role');
        // Store fetched roles options
        this.roles = response.data.data;
      } catch (error) {
        console.error('Error fetching Roles:', error);
      }
    },
    async fetchMagasins() {
      try {
        
        const response = await axios.get('http://localhost:5000/magasinRouter');
        // Store fetched magasins options
        this.magasins = response.data.data;
      } catch (error) {
        console.error('Error fetching Magasins:', error);
      }
    },

    toggleCollapse() {
      this.isCollapsed = !this.isCollapsed;
    },
    async fetchUsers() {
      try {
        // Fetch roles from your server-side endpoint
        const response = await axios.get('http://localhost:5000/utilisateurs');
        
        this.table1.data = response.data.data.map(user => ({
          Id: user.id,
          nom: user.nom,
          prenom: user.prenom,
          DateNaissance: this.formatDate(user.DateNaissance),
          Telephone: user.Telephone,
          email: user.email,
          RoleId: user.RoleId,
          MagasinId: user.MagasinId,
          editable: false 
        }));
      } catch (error) {
        console.error('Error fetching Users:', error);
      }
    },
    async submitForm() {
      try {
        // Send POST request to add a new user
        const response = await axios.post('http://localhost:5000/utilisateurs', this.formData);
        // Update the table data if the request is successful
        if (response.status === 201) {
          // Fetch updated user data after successful addition
          this.fetchUsers();
          // Clear the form after adding the user
          this.formData = {
            nom: '',
            prenom: '',
            DateNaissance: '',
            Telephone: '',
            email: '',
            MotDePasse: '',
            RoleId: '',
            MagasinId: ''
          };
        }
      } catch (error) {
        console.error('Error adding user:', error);
      }
    },
    toggleEdit(item) {
      if (item.editable) {
        // Send PUT request to update the user data
        axios.put(`http://localhost:5000/utilisateurs/${item.Id}`, item)
          .then(() => {
            item.editable = false; 
          })
          .catch(error => {
            console.error('Error updating user:', error);
          });
      } else {
        item.editable = true; // Set editable to true to enable inline editing
      }
    },
    formatDate(dateString) {
      // Parse the date string into a Date object
      const date = new Date(dateString);
      // Format the date as desired (e.g., YYYY-MM-DD)
      return date.toISOString().split('T')[0];
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
.card {
    border-radius: 6px;
    box-shadow: 0 2px 2px rgba(204, 197, 185, 0.5);
    background-color: #FFFFFF;
    color: #252422;
    margin-bottom: 20px;
    position: relative;
    width: 74rem;
    z-index: 1;
    border: none;
}
</style>
