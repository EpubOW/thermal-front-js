<script setup>
import { ref } from 'vue'
import index from '../router/index.js'

const login = ref('')
const password = ref('')

function loginFunc() {
    if (login.value === 'a' && password.value === 'a') { 
        index.push('/home')
    } else {
        alert('Неверный логин или пароль')
    }
}

</script>

<template>
<div class="autorization">
    <h1 style="font-family:'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;">Авторизация</h1>
    <form @submit.prevent="loginFunc">
        <label for="login" class="style-text">Логин</label>
        <input type="text" id="login" name="login" class="style-text" v-model="login" required>
        <label for="password" class="style-text">Пароль</label>
        <input type="text" id="password" name="password" class="style-text" v-model="password" required>
        <button type="submit" class="btn style-text">Войти</button>
    </form>
</div>
</template>

<style scoped>
/* .autorization {
    display: grid; */
    /* flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: #f0f0f0; */
/* } */
form {
    display: grid;
}
.btn {
    margin: 10px 20px;
    background-color: lawngreen;
    /* border: 1px solid black; */
    border: none;
    border-radius: 5px;
    padding: 5px;
}
.btn:hover {
    background-color: rgb(116, 231, 0);
    cursor: pointer;
}

.style-text{
    color: black;
    font-size: medium;
    font-family:'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
}



</style>