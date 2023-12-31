<script setup>
import { ref } from 'vue';
import {
    getAuth, createUserWithEmailAndPassword, GoogleAuthProvider,
    signInWithPopup,
} from 'firebase/auth'

import { useRouter } from 'vue-router';
import { RouterLink, RouterView } from "vue-router";

const email = ref("");
const password = ref("");
const router = useRouter();

const register = () => {
    createUserWithEmailAndPassword(getAuth(), email.value, password.value)
        .then((data) => {
            router.push("/")
        })
        .catch((error) => {
            alert(error.code);
        });
}

const signInWithGoogle = () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(getAuth(), provider)
    .then((result) => {
      console.log(result.user);
      router.push("/data");
    })
    .catch((error) => {
      //handle error
    });
};
</script>

<template lang="">
    <div class="login">
        <h1>Register Your Account</h1>
        <form @submit.prevent="register">
            <div class="labelDiv">   
                <label for="email">Email</label> <br>
                <input v-model="email" type="email" name="" id="email" required>
            </div>
            <div class="labelDiv">   
                <label for="password">Password</label> <br>
                <input v-model="password" type="password" name="" id="password" required>
            </div>
            <button id="loginBtn" type="submit">Submit</button>
            <button @click="signInWithGoogle">Login With Gmail</button>
        </form>
    </div>
</template>


<style scoped>
.login {
    width: 100vw;
    height: 90vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.login form {
    background-color: rgb(72, 70, 70);
    color: white;
    padding: 20px 30px;
    backdrop-filter: blur(2px);
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.login form #loginBtn {
    margin-top: 20px;
}

.login form .labelDiv input {
    width: 300px;
    height: 10px;
    padding: 10px;
    border-radius: 5px;
    outline: none;
    border: none;
    margin-top: 5px;
}

.login form button {
    height: 30px;
}
</style>