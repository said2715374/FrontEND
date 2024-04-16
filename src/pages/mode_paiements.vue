<template>
    <div class="row">
      <div class="col-12">
        <!-- Collapsible form -->
        <b-card>
          <b-card-header id="formCollapseHeader">
            <h5 class="mb-0">
              <button class="btn btn-link" type="button" @click="toggleCollapse">
                Table des modes de paiement
                <span class="arrow" :class="{ 'rotated': isCollapsed }"></span>
              </button>
            </h5>
          </b-card-header>
  
          <b-collapse id="formCollapse" v-model="isCollapsed">
            <b-card-body>
              <form @submit.prevent="submitForm">
                <div class="form-group">
                  <input v-model="formData.process" type="text" class="form-control" id="process" placeholder="Process Name" required>
                </div>
                <button type="submit" class="btn btn-primary">Ajouter Process</button>
              </form>
            </b-card-body>
          </b-collapse>
        </b-card>
  
        <!-- Bootstrap Modal for Edit -->
        <b-modal ref="editModal" title="Edit Process" @ok="submitEditForm">
          <div>
            <div class="form-group">
              <label for="editProcessName">Nom de Process:</label>
              <input v-model="editFormData.process" type="text" class="form-control" id="editProcessName" required>
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
                    <button class="btn btn-danger" @click="deleteItem(item)">Supprimer</button>
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
          process: ''
        },
        editFormData: {
          process: ''
        },
        table1: {
          title: "Mode Paiement Table",
          subTitle: "Mode Paiement",
          columns: ["Id", "Process"],
          data: []
        }
      };
    },
    mounted() {
      this.fetchData();
    },
    methods: {
      toggleCollapse() {
        this.isCollapsed = !this.isCollapsed;
      },
      async fetchData() {
        try {
          const response = await axios.get('http://localhost:5000/modePaiementRouter');
          this.table1.data = response.data.data.map(item => ({
            Id: item.id,
            Process: item.process,
           
          }));
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      },
      async submitForm() {
        try {
          const response = await axios.post('http://localhost:5000/modePaiementRouter', {
            process: this.formData.process
          });
          if (response.status === 201) {
            this.fetchData();
            this.formData.process = '';
            this.isCollapsed = false;
          }
        } catch (error) {
          console.error('Error adding process:', error);
        }
      },
      deleteItem(item) {
        const confirmation = confirm("Are you sure you want to delete this item?");
        if (confirmation) {
          axios.delete(`http://localhost:5000/modePaiementRouter/${item.Id}`)
            .then(() => {
              this.fetchData();
            })
            .catch(error => {
              console.error('Error deleting item:', error);
            });
        }
      },
      openEditModal(item) {
        this.editFormData = {
          Id: item.Id,
          process: item.Process
        };
        this.$refs.editModal.show();
      },
      submitEditForm() {
        try {
          axios.put(`http://localhost:5000/modePaiementRouter/${this.editFormData.Id}`, {
            process: this.editFormData.process
          })
          .then(() => {
            const index = this.table1.data.findIndex(item => item.Id === this.editFormData.Id);
            if (index !== -1) {
              this.table1.data[index].Process = this.editFormData.process;
            }
            this.$refs.editModal.hide();
          })
          .catch(error => {
            console.error('Error editing process:', error);
          });
        } catch (error) {
          console.error('Error editing process:', error);
        }
      }
    }
  };
  </script>
  
  <style scoped>
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
  
  .rotated {
    transform: rotate(-90deg);
  }
  .card .card-body {
      padding: 15px 15px 20px 15px;
  }
  </style>
  