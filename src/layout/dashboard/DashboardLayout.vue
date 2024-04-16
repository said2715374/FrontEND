<template>
  <div class="wrapper">
    <side-bar>
      <template slot="links">
        <template v-if="user.RoleId === 1">
    <sidebar-link to="/dashboard" name="Tableau de bord" icon="ti-panel" />
    <sidebar-link to="/Users" name="Utilisateurs" icon="ti-user" />
    <sidebar-link to="/Magasin" name="Magasin" icon="ti-pencil-alt2" />
    <sidebar-link to="/Roles" name="Rôles" icon="ti-pencil-alt2" />
    <sidebar-link to="/regions" name="Region" icon="ti-pencil-alt2" />
    <sidebar-link to="/products" name="Produits" icon="ti-pencil-alt2" />
    <sidebar-link to="/transaction" name="transaction" icon="ti-pencil-alt2" />
    <sidebar-link to="/revnuejournaliers" name="revnuejournaliers" icon="ti-pencil-alt2" />
    <sidebar-link to="/mode_paiements" name="mode de paiements" icon="ti-pencil-alt2" />
  </template>

  <template v-else-if="user.RoleId === 2">
    <sidebar-link to="/dashboard" name="dashbored" icon="ti-panel" />
    <sidebar-link to="/products" name="products" icon="ti-pencil-alt2" />
    <sidebar-link to="/transaction" name="transaction" icon="ti-pencil-alt2" />
    <sidebar-link to="/revnuejournaliers" name="revnuejournaliers" icon="ti-pencil-alt2" />
    <sidebar-link to="/mode_paiements" name="mode_paiements" icon="ti-pencil-alt2" />



  </template>
      </template>
      <mobile-menu>
       
       
        <li class="divider"></li>
      </mobile-menu>
    </side-bar>
    <div class="main-panel">
      <top-navbar></top-navbar>

      <dashboard-content @click.native="toggleSidebar"> </dashboard-content>

      <content-footer></content-footer>
    </div>
  </div>
</template>
<style lang="scss"></style>
<script>
import TopNavbar from "./TopNavbar.vue";
import ContentFooter from "./ContentFooter.vue";
import DashboardContent from "./Content.vue";
import MobileMenu from "./MobileMenu";
export default {
  components: {
    TopNavbar,
    ContentFooter,
    DashboardContent,
    MobileMenu,
  },
  methods: {
    toggleSidebar() {
      if (this.$sidebar.showSidebar) {
        this.$sidebar.displaySidebar(false);
      }
    },
  },
  created() {
    // Retrieve user data from local storage
    const userData = localStorage.getItem('user');

    // Check if user data exists in local storage
    if (userData) {
      // If user data exists, parse it from JSON format and assign it to the user variable
      this.user = JSON.parse(userData);
    }
  },

};
// localStorage.clear();
</script>
