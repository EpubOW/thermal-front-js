<script setup>

import { ref, onMounted, computed, onBeforeMount } from 'vue';
import { useDeviceStatusStore } from '@/stores/deviceStatusStore';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore';

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
let mainOrAccountSource = ref('')
let mainOrAccountName = ref('')

let deviceStatusStore = useDeviceStatusStore()


function moveToPage(event){
    const route = event.target.value
    if (route == '/') userStore.setAuthorizedStatus()
    router.push(event.target.value)
    // console.log('event', )
}

onMounted(() => {
    console.log('path', route.path)
    if (route.path == '/account'){
        console.log('acc')
        mainOrAccountSource.value = '/home'
        mainOrAccountName.value = 'Главная страница'
    } 
    else if (route.path == '/home'){
        console.log('man')
        mainOrAccountSource.value = '/account'
        mainOrAccountName.value = 'Личная страница'
    } 
    console.log(mainOrAccountSource, mainOrAccountName)
})
</script>

<template>
    <div class="header">
        <img class="logo" src="@/assets/TVR_vr1.png" alt="">
        <span class="title style-text">Мониторинг температуры</span>
        <div class="indicators">
            <div id="green_ind" class="ind_box">
                <div>{{ deviceStatusStore.normalDeviceStatus() }}</div>
            </div>
            <div id="yellow_ind" class="ind_box">
                <div>{{ deviceStatusStore.warningDeviceStatus() }}</div>
            </div>
            <div id="red_ind" class="ind_box">
                <div>{{ deviceStatusStore.dangerDeviceStatus() }}</div>
            </div>
        </div>
            <select @change="moveToPage" class="user-info style-text" name="" id="">
                <option value="0" disabled selected>{{ userStore.getUsername }}</option>
                <option :value="mainOrAccountSource">{{ mainOrAccountName }}</option>
                <option value="/">Выйти</option>
            </select>
    </div>
    

</template>

<style scoped>
#green_ind {
    background-color: rgba(30, 232, 30, 0.5);
    border: 4px solid rgb(30, 232, 30);
}
#yellow_ind {
    background-color: rgba(255,255,0,0.5);
    border: 4px solid yellow;
}
#red_ind {
    background-color: rgba(255,0,0,0.5);
    border: 4px solid red;
}
.ind_box{
    display: inline-block;
    margin: 10px;
    width: 50px;
    text-align: center;
    font-size: 20px;
    border-radius: 7px;
    color: black;
    /* border: black 2px solid; */
}
ul{
    list-style-type: none;
}
.user-info{
    /* position: relative;
    right: 0; */
    /* position: absolute; */
    /* bottom: 10px; */
    /* margin-top: 5px; */
    border: none;
    background-color: rgba(200, 200, 200, 0.5);
    border-radius: 5px;
    padding: 5px;
    min-width: 50%;
}
.user-info:hover{
    background-color: rgba(173, 173, 173, 0.5);
    cursor: pointer;
}

.header{
    position: absolute;
    top: 0;
    left: 0;
    display: grid;
    grid-template-columns: 5% 1fr 2fr 1fr;
    justify-content:center;
    justify-items: center;
    align-items: center;
    background-color: rgba(200, 200, 200, 0.5);
    width: 100%; 
    border-bottom: 3px solid rgb(200, 200, 200);
}
.indicators {
    display: flex;
    /* position: absolute; */
    right: 40%;
}

.title{
    display: flex;
    width: 100%;
    margin-left: 15%;
    /* justify-content: start !important; */
    /* position: relative; */
    
    /* left: 0 !important; */
    color: black;
}
.logo{
    position: relative;
    padding: 10px 0;
    max-width: 100%;
    left: 2%;
}
/* .spacer{
    flex: 1;
} */
.style-text{
    color: black;
    font-size: large;
    font-family:'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
}
</style>