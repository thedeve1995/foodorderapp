<script setup>
import { ref } from 'vue';
import {
    getAuth, signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
} from 'firebase/auth'

import { useRouter } from 'vue-router';
import { RouterLink, RouterView } from "vue-router";

const email = ref("");
const password = ref("");
const router = useRouter();

const login = () => {
    signInWithEmailAndPassword(getAuth(), email.value, password.value)
        .then((data) => {
            router.push("/")
        })
        .catch((error) => {
            console.log(error.code);
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

const daftar = () => {
    router.push("/register")
}

</script>

<template lang="">
    <div class="login">
        <h1>Login</h1>
        <form @submit.prevent="login">
            <div class="labelDiv">   
                <label for="email">Email</label> <br>
                <input v-model="email" type="email" name="" id="email" required>
            </div>
            <div class="labelDiv">   
                <label for="password">Password</label> <br>
                <input v-model="password" type="password" name="" id="password" required>
            </div>
            <!-- <p style="margin-top:10px">Belum Punya Akun ? Silahkan <a style="cursor:pointer;background-color:rgba(255, 204, 0, 0.585);padding:2px 20px; border-radius:5px" @click="daftar">Daftar</a></p> -->
            <button id="loginBtn" type="submit">Login</button>
            <button @click="signInWithGoogle">Login With Gmail</button>
        </form>
    </div>
</template>


<style scoped>
.login {
    width: 100vw;
    height: 93vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-image: url(../assets/back.jpg);
    background-size: cover;
}

.login form {
    background-color: rgba(250, 245, 245, 0.721);
    color: rgb(20, 20, 20);
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
    padding: 10px;
  border-radius: 10px;
  background-color: rgba(255, 204, 0, 0.585);
  color: rgb(6, 6, 6);
  font-weight: 700;
  letter-spacing: 2px;
  cursor: pointer;
  border: none;
  outline: none;
  transition: 0.5s;
}

.login form button:hover{
    transform: scale(1.05);
}
</style>