import { createRouter, createWebHistory } from 'vue-router'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import AdminView from '../views/AdminView.vue'
import KasirView from '../views/KasirView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/reception',
      name: 'reception',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/ReceptionView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta :{
        requiresAuth:true,
      }
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminView,
      meta :{
        requiresAuth:true,
      }
    },
    {
      path: '/kasir',
      name: 'kasir',
      component: KasirView,
      meta :{
        requiresAuth:true,
      }
    }
  ]
})

const getCurrentUser=()=>{
  return new Promise((resolve, reject) => {
    const removeListener = onAuthStateChanged(
      getAuth(),
      (user)=> {
        removeListener();
        resolve(user)
      },
      reject
    )
  })
}

router.beforeEach(async(to, from, next) =>{
  if(to.matched.some((record) => record.meta.requiresAuth)){
    if(await getCurrentUser()){
      next()
    } else {
      alert("You Dont Have Access ! Please Log In")
      next("/login")
    }
  }else {
    next()
  }
});

export default router
