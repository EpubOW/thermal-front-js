<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/userStore.js'
import { useRouter } from 'vue-router'

const router = useRouter()
const login = ref('')
const password = ref('')
const userStore = useUserStore()

// function loginFunc() {
//     if (login.value === 'a' && password.value === 'a') { 
//         router.push('/home')
//     } else {
//         alert('Неверный логин или пароль')
//     }
// }

async function loginFunc() {
    console.log('request for autorization')
    let jsonData = new Map()
    jsonData.set('username', login.value)
    jsonData.set('password', password.value) 
    jsonData = JSON.stringify(Object.fromEntries(jsonData))
    console.log('json', jsonData)
    await fetch(`http://10.5.5.10:5000/login`, { 
        method: "POST", 
        cors: "no-cors",
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
        },
        body: jsonData
    })
    .then(response =>  response.json())
    .then((response) => {
        if (response){
            console.log('response login', response)
            if (response['status'] == true){
                userStore.setToken(response['token'])
                console.log('token', userStore.getToken)
                userStore.setAuthorizedStatus()
                userStore.setUsername(response['username'])
                router.push('/home')
            }
            else {
                alert('Неверный логин или пароль')
            }
        } else console.log('Ошибка при получении запроса')
    })
}

</script>

<template>
    <div class="margin-box">
        <div class="autorization">
            <h1>Авторизация</h1>
            <form @submit.prevent="loginFunc">
                <label for="login" class="style-text">Логин</label>
                <input type="text" id="login" name="login" class="style-text" v-model="login" required>
                <label for="password" class="style-text">Пароль</label>
                <input type="password" id="password" name="password" class="style-text" v-model="password" required>
                <button type="submit" class="btn style-text">Войти</button>
            </form>
        </div>
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
h1{
    font-family:'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
    color: black;
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