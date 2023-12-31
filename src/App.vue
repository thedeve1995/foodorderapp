<script setup>
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { RouterLink, RouterView } from 'vue-router'
import { onMounted, ref } from "vue";
import router from "./router";

const isLoggedIn = ref(false);
let auth;
let user = ref(null); 

onMounted(() => {
  auth = getAuth();
  onAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser) {
      isLoggedIn.value = true;
      user.value = firebaseUser; 
    } else {
      isLoggedIn.value = false;
      user.value = null; 
    }
  });
});

const handleSignOut = () => {
  signOut(auth).then(() => {
    router.push("/");
  });
};
</script>

<template>
  <header>
    <div class="wrapper">

      <nav>
        
        <router-link to="/">Home</router-link>
        <router-link to="/admin">Admin Dapur</router-link>
        <router-link to="/kasir">Kasir</router-link>
        <span v-if="isLoggedIn" @click="handleSignOut" style="background-color: rgb(80, 65, 5): 5px 20px;border-radius: 5px;">Out</span>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>


header {
  height: 7vh;
  background-color: rgb(247, 198, 1);
  display: flex;
  justify-content: center;
  align-items: center;
  position: sticky;
  top: 0px;
  z-index: 100;
}
nav a.router-link-exact-active {
  background-color: aliceblue;
  padding: 5px 20px;
  border-radius: 5px;
}

nav span:hover {
  cursor: pointer;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
  color: black;
  text-decoration: none;
}

nav a:first-of-type {
  border: 0;
}

nav{
  display: flex;
  align-items: center;
  gap: 20px;
  color: black;
}

</style>
