import DashboardLayout from "@/layout/dashboard/DashboardLayout.vue";
// GeneralViews

// Admin pages
import Dashboard from "@/pages/Dashboard.vue";
import Magasin from "@/pages/Magasin.vue";
import Roles from "@/pages/Roles.vue";
import Typography from "@/pages/Typography.vue";
import Users from "@/pages/Users.vue";
//store
import magasinview from "../pages/magasin/magasinview.vue"
import homepageview from "../pages/store/homepage.vue"
import signupview from "../pages/store/signupview.vue"
import loginview from "../pages/store/loginview.vue"
import regions from "../pages/regionvue.vue"
import products from "../pages/productsview.vue"
import transaction from "../pages/transactionview.vue"
import revnuejournaliers from "../pages/revnuejournaliers.vue"
import mode_paiements from "../pages/mode_paiements.vue"


















const routes = [
  {
    path: "/",
    component: DashboardLayout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        name: "dashboard",
        component: Dashboard,
      },
     
      
      {
        path: "Magasin",
        name: "Magasin",
        component: Magasin,
      },
      {
        path: "Roles",
        name: "Roles",
        component: Roles,
      },
      {
        path: "typography",
        name: "typography",
        component: Typography,
      },
      {
        path: "Users",
        name: "Users",
        component: Users,
      },
      {
        path: "regions",
        name: "regions",
        component: regions,
      },
      {
        path: "products",
        name: "products",
        component: products,
      },
      {
        path: "transaction",
        name: "transaction",
        component: transaction,
      },{
        path: "revnuejournaliers",
        name: "revnuejournaliers",
        component: revnuejournaliers,
      },
      {
        path: "/mode_paiements",
        name: "mode_paiements",
        component: mode_paiements,
    
      },
      //magasin_dashbored
    ],
  },
  {
    path: "/riad",
    name: "magasin",
    component: magasinview,

  },
  {
    path: "/homepage",
    name: "homepage",
    component: homepageview,

  },
  {
    path: "/signup",
    name: "Sign up",
    component: signupview,

  },{
    path: "/login",
    name: "login",
    component: loginview,

  },


  
];

/**
 * Asynchronously load view (Webpack Lazy loading compatible)
 * The specified component must be inside the Views folder
 * @param  {string} name  the filename (basename) of the view to load.
**/

export default routes;
