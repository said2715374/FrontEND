<template>
  <nav class="navbar navbar-expand-lg navbar-light">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">{{ routeName }}</a>
      <button
        class="navbar-toggler navbar-burger"
        type="button"
        @click="toggleSidebar"
        :aria-expanded="$sidebar.showSidebar"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-bar"></span>
        <span class="navbar-toggler-bar"></span>
        <span class="navbar-toggler-bar"></span>
      </button>
      <div class="collapse navbar-collapse">
        <ul class="navbar-nav ml-auto">
          <li class="nav-item">
            <a href="#" class="nav-link">
              
              <p>Hi,{{ user.nom }}</p>
            </a>
          </li>
          
          <li class="nav-item">
            <a href="#" class="nav-link">
              <i class="ti-settings"></i>
              <p>Settings</p>
            </a>
          </li>
          
           <!-- Button to Google -->
           <li class="nav-item">
            <a href="http://localhost:8080/#/homepage" target="_blank" class="nav-link">
              <i class="ti-world"></i>
              <p>Website</p>
            </a>
          </li>
          <li class="nav-item">
            <a href="http://localhost:8080/#/homepage" target="_blank" class="nav-link" @click="logout">
              <i class="ti-world"></i>
              <p>log out</p>
            </a>
          </li>
          <!-- End of Button to Google -->
        </ul>
      </div>
      <!-- Profile picture -->
      <div class="profile-picture">
        <img src="https://png.pngtree.com/png-vector/20190710/ourmid/pngtree-business-user-profile-vector-png-image_1541960.jpg?sscid=41k8_gfroz&" alt="Profile Picture" class="img-fluid rounded-circle" />
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  computed: {
    routeName() {
      const { name } = this.$route;
      return this.capitalizeFirstLetter(name);
    },
  },

  methods: {
    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },

    toggleSidebar() {
      this.$sidebar.displaySidebar(!this.$sidebar.showSidebar);
    },
    hideSidebar() {
      this.$sidebar.displaySidebar(false);
    },
    logout() {
      
      localStorage.clear();
      
      window.location.href = "http://localhost:8080/#/homepage";
    }
  },
  created (){
    const userData = localStorage.getItem('user');
    // Check if user data exists in local storage
    if (userData) {
      // If user data exists, parse it from JSON format and assign it to the user variable
      this.user = JSON.parse(userData);
    }
  }
};
</script>

<style scoped>
/* Style for profile picture */
.profile-picture {
  margin-left: auto; /* Pushes the profile picture to the end */
  margin-right: 15px; /* Add some margin for spacing */
}

/* Style for responsive profile picture */
.profile-picture img {
  max-width: 40px; /* Maximum width for the image */
  height: auto; /* Ensures image aspect ratio is maintained */
}
.profile-picture{
  width: 15px;
}
</style>
