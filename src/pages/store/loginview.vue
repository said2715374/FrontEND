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
            <router-link to="/homepage" class="nav-link">Accueil</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/login" class="nav-link">Connexion</router-link>
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
                      <div class="mb-3">
                        <label for="email" class="form-label">Email</label>
                        <input v-model="formData.Email" type="email" class="form-control" id="email" placeholder="Email" required>
                        <div class="invalid-feedback">Please enter a valid email.</div>
                      </div>
                      <div class="mb-3">
                        <label for="motDePasse" class="form-label">Mot de Passe</label>
                        <input v-model="formData.MotDePasse" type="password" class="form-control" id="motDePasse" placeholder="Mot de Passe" required>
                        <div class="invalid-feedback">Please enter a valid mot de passe.</div>
                      </div>
                      <!-- Submit button -->
                      <button type="submit" class="btn btn-primary">Login</button>
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
        Email: '',
        MotDePasse: ''
      }
    };
  },
  methods: {
    async submitForm() {
      try {
        const response = await axios.post('http://localhost:5000/login/', {
          Email: this.formData.Email,
          Mot_de_passe: this.formData.MotDePasse
        });
        
        console.log(response); // Log the response to see what the backend is returning
        if (response.status === 200) {
          const { utilisateur } = response.data;

          // Store user information in local storage
          localStorage.setItem('user', JSON.stringify(utilisateur));
          
          // Redirect to dashboard route
          this.$router.push('/dashboard');
        } else {
          // Handle non-200 status
          console.error('Error:', response.status);
        }
      } catch (error) {
        console.error(error);
        // Handle login error
      }
    }
  }
};
</script>
