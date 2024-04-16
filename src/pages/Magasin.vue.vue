<template>
  <div class="row">
    <div class="col-12">
      <!-- Collapsible form -->
      <b-card>
        <b-card-header id="formCollapseHeader">
          <h5 class="mb-0">
            <button class="btn btn-link" type="button" @click="toggleCollapse">
              Ajouter un nouveau magasin
              <span class="arrow" :class="{ 'rotated': isCollapsed }"></span>
            </button>
          </h5>
        </b-card-header>

        <b-collapse id="formCollapse" v-model="isCollapsed">
          <b-card-body>
            <form @submit.prevent="submitForm">
              <div class="form-group">
                <input v-model="formData.address" type="text" class="form-control" id="address" placeholder="Adresse" required>
                <input v-model="formData.superviseur" type="text" class="form-control" id="superviseur" placeholder="Superviseur" required>
              </div>
              <button type="submit" class="btn btn-primary">Ajouter</button>
            </form>
          </b-card-body>
        </b-collapse>
      </b-card>

      <!-- Bootstrap Modal for Edit -->
      <b-modal ref="editModal" title="Edit Magasin" @ok="submitEditForm">
        <div>
          <div class="form-group">
            <label for="editMagasinAddress">Adresse:</label>
            <input v-model="editFormData.address" type="text" class="form-control" id="editMagasinAddress" required>
            <label for="editMagasinSuperviseur">Superviseur:</label>
            <input v-model="editFormData.superviseur" type="text" class="form-control" id="editMagasinSuperviseur" required>
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
                  <button class="btn btn-danger" @click="deleteMagasin(item)">Supprimer</button>
                  <button class="btn btn-warning" @click="openEditModal(item)">Modifier</button>
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
        address: '',
        superviseur: '',
      },
      editFormData: {
        address: '',
        superviseur: '',
      },
      table1: {
        title: "Tableau des magasins",
        subTitle: "magasins",
        columns: ["Id", "Adresse", "Superviseur"],
        data: [] // Initialize as empty array
      }
    };
  },
  mounted() {
    this.fetchMagasins(); // Fetch magasins when the component is mounted
  },
  methods: {
    toggleCollapse() {
      this.isCollapsed = !this.isCollapsed;
    },
    async fetchMagasins() {
      try {
        // Fetch magasins from your server-side endpoint
        const response = await axios.get('http://localhost:5000/magasinRouter');
        // Map fetched data to match the table structure
        this.table1.data = response.data.data.map(magasin => ({
          Id: magasin.id,
          Adresse: magasin.address || '', // Use empty string if address is not provided
          Superviseur: magasin.superviseur || '', // Use empty string if superviseur is not provided
        }));
      } catch (error) {
        console.error('Error fetching magasins:', error);
      }
    },
    async submitForm() {
      try {
        // Send POST request to add a new magasin
        const response = await axios.post('http://localhost:5000/magasinRouter', {
          address: this.formData.address,
          superviseur: this.formData.superviseur
        });
        // Update the table data if the request is successful
        if (response.status === 201) {
          this.table1.data.push({
            Id: response.data.id,
            Adresse: response.data.address,
            Superviseur: response.data.superviseur,
          });
          // Clear the form after adding the magasin
          this.formData.address = '';
          this.formData.superviseur = '';
          this.fetchMagasins();
        }
      } catch (error) {
        console.error('Error adding magasin:', error);
      }
    },
    deleteMagasin(magasin) {
      const confirmation = confirm("Are you sure you want to delete this magasin?");
      if (confirmation) {
        axios.delete(`http://localhost:5000/magasinRouter/${magasin.Id}`)
          .then(() => {
            this.fetchMagasins(); // Refresh the table after deletion
          })
          .catch(error => {
            console.error('Error deleting magasin:', error);
          });
      }
    },
    openEditModal(magasin) {
      // Assign the magasin data to editFormData
      this.editFormData = {
        Id: magasin.Id,
        address: magasin.Adresse,
        superviseur: magasin.Superviseur
      };
      this.$refs.editModal.show();
    },
    submitEditForm() {
      try {
        // Send PUT request to update the magasin
        axios.put(`http://localhost:5000/magasinRouter/${this.editFormData.Id}`, {
          address: this.editFormData.address,
          superviseur: this.editFormData.superviseur
        })
        .then(() => {
          // Find the index of the edited magasin in the table data
          const index = this.table1.data.findIndex(item => item.Id === this.editFormData.Id);
          // If the index is found, update the magasin data
          if (index !== -1) {
            this.table1.data[index].Adresse = this.editFormData.address;
            this.table1.data[index].Superviseur = this.editFormData.superviseur;
          }
          this.$refs.editModal.hide(); // Hide the edit modal
        })
        .catch(error => {
          console.error('Error editing magasin:', error);
        });
      } catch (error) {
        console.error('Error editing magasin:', error);
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
