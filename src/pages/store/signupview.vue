

<template>
    <main>
         <!-- navbar -->

         <nav class="navbar navbar-expand-lg ">
            <router-link to="/" class="navbar-brand">My Store</router-link>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
            </button>
                    <div class="collapse navbar-collapse" id="navbarNav">
              <ul class="navbar-nav ml-auto">
                <li class="nav-item">
                <router-link to="/homepage" class="nav-link">home</router-link>
                </li>
                <li class="nav-item">
                <router-link to="/login" class="nav-link">Accueil</router-link>
                </li>
                <li class="nav-item">
                <router-link to="/signup" class="nav-link">sign up</router-link>
                </li>
               
               
            </ul>
            </div>
  </nav>
        <!-- navbar end -->
      <section class="vh-100" style="background-color: #9A616D;">
  <div class="container py-5 h-100">
    <div class="row d-flex justify-content-center align-items-center h-100">
      <div class="col col-xl-10">
        <div class="card" style="border-radius: 1rem;">
          <div class="row g-0">
            <div class="col-md-6 col-lg-5 d-none d-md-block">
              <img src="https://static.vecteezy.com/system/resources/previews/012/658/289/non_2x/3d-application-form-illustration-side-view-free-png.png"
                alt="login form" class="img-fluid" style="border-radius: 1rem 0 0 1rem;" />
            </div>
            <div class="col-md-6 col-lg-7 d-flex align-items-center">
              <div class="card-body p-4 p-lg-5 text-black">

                <form @submit.prevent="submitForm" class="needs-validation" novalidate>
    <!-- Your form fields -->
    <div class="mb-3">
      <label for="nom" class="form-label">Nom</label>
      <input v-model="formData.nom" type="text" class="form-control" id="nom" placeholder="Nom" required>
      <div class="invalid-feedback">Please enter a valid nom.</div>
    </div>
    <div class="mb-3">
      <label for="prenom" class="form-label">Prenom</label>
      <input v-model="formData.prenom" type="text" class="form-control" id="prenom" placeholder="Prenom" required>
      <div class="invalid-feedback">Please enter a valid prenom.</div>
    </div>
    <div class="mb-3">
      <label for="dateNaissance" class="form-label">Date de Naissance</label>
      <input v-model="formData.DateNaissance" type="date" class="form-control" id="dateNaissance" placeholder="Date de Naissance" required>
      <div class="invalid-feedback">Please enter a valid date de naissance.</div>
    </div>
    <div class="mb-3">
      <label for="telephone" class="form-label">Telephone</label>
      <input v-model="formData.Telephone" type="text" class="form-control" id="telephone" placeholder="Telephone" required>
      <div class="invalid-feedback">Please enter a valid telephone.</div>
    </div>
    <div class="mb-3">
      <label for="motDePasse" class="form-label">Mot de Passe</label>
      <input v-model="formData.MotDePasse" type="password" class="form-control" id="motDePasse" placeholder="Mot de Passe" required>
      <div class="invalid-feedback">Please enter a valid mot de passe.</div>
    </div>

    <!-- Select dropdown for roleId -->
    <div class="mb-3">
  <label for="RoleId" class="form-label">Role</label>
  <select v-model="formData.RoleId" class="form-select" id="RoleId" required>
    <option value="1">Admin</option>
    <option value="2">Caissier</option>
    <option value="3">Gerant</option>
  </select>
  <div class="invalid-feedback">Please select a role.</div>
</div>


    <!-- Select dropdown for magasinId -->
    <div class="mb-3">
      <label for="MagasinId" class="form-label">Magasin</label>
      <select v-model="formData.MagasinId" class="form-select" id="MagasinId" required>
        <option value="1">store one</option>
        <option value="2">store two</option>
        <option value="3">store theree</option>
      </select>
      <div class="invalid-feedback">Please select a role.</div>
    </div>

    <!-- Submit button -->
    <button type="submit" class="btn btn-primary">Sign Up</button>
  </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
    </main>
    
  </template>
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        formData: {
          nom: '',
          prenom: '',
          DateNaissance: '',
          Telephone: '',
          MotDePasse: '',
          RoleId: '',
          MagasinId: ''
        }
      };
    },
    methods: {
      async submitForm() {
        try {
          const response = await axios.post('http://localhost:5000/utilisateurs', this.formData);
          this.$router.push('/dashboard');
          console.log(response.data); // Log server response
        } catch (error) {
          console.error('Error:', error);
        }
      }
    }
  };
  </script>
  <style>
.vh-100 {
    height: 110vh !important;
}
select {
    margin-left: 15px;
    word-wrap: normal;
}
</style>