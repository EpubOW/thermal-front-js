<script setup>
import Header from './Header.vue';
import { useDeviceStatusStore } from '@/stores/deviceStatusStore';
import { useUserStore } from '@/stores/userStore';
import { onMounted, ref, onBeforeMount } from 'vue';

const deviceStatusStore = useDeviceStatusStore()
const userStore = useUserStore()
let threshold_yellow = ref('')
let threshold_red = ref('')

onBeforeMount(async () => {
    await deviceStatusStore.basicDeviceSetup()
})

deviceStatusStore.getChartThresholdsFromDB().then(() => {
    threshold_yellow.value = deviceStatusStore.getChartThresholds.get('threshold_yellow')
    threshold_red.value = deviceStatusStore.getChartThresholds.get('threshold_red')
})

function saveInfo(){
    if (threshold_yellow.value >= threshold_red.value){
        alert('Пороги температуры заданы неверно')
        return
    }
    if (threshold_red.value === '' || threshold_yellow.value === '') {
        alert('Указано пустое значение')
        return
    }
    deviceStatusStore.setChartThresholdsToDB(threshold_yellow.value, threshold_red.value)
    console.log('save')
}

onMounted(() => {
    
})
</script>

<template>
    <Header></Header>
    <div class="values">
        <h2><span>Изменить данные <br> пользователя</span></h2>
        <form @submit.prevent="saveInfo">
            <label for="login" class="style-text">Логин (сейчас недоступно)</label>
            <input type="text" id="login" name="login" class="style-text" :value="userStore.getUsername"  disabled>
            <label for="password" class="style-text">Пароль (сейчас недоступно)</label>
            <input type="text" id="password" name="password" class="style-text"  disabled>
            <br>
            <h2><span>Изменить температурные<br>пороги</span></h2>
            <div class="change-thresholds">
                <div class="thresholds-labels">
                    <div class="field green-field"></div>
                    <div class="field yellow-field"></div>
                    <div class="field red-field"></div>
                </div>
                <div class="thresholds-values">
                    <input class="t-value left-value style-text" type="number" v-model="threshold_yellow">
                    <input class="t-value right-value style-text" type="number" v-model="threshold_red">
                </div>
            </div>
            <button type="submit" class="btn style-text">Сохранить</button>
        </form>
    </div>
</template>

<style scoped>
/* .change-thresholds{
    display: grid;
    grid-template-rows: repeat(2, auto);
} */
.field{
    width: 100%;
    height: 1em;
}
.green-field{
    background-color: rgba(30, 232, 30, 0.5);
    border: 2px solid rgb(30, 232, 30);
}
.yellow-field{
    background-color: rgba(255,255,0,0.5);
    border: 2px solid yellow;
}
.red-field{
    background-color: rgba(255,0,0,0.5);
    border: 2px solid red;
}
.thresholds-labels{
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    justify-items: center;
}
.thresholds-values{
    margin-top: 5px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    /* gap: 1em; */
    /* max-width: 5%; */
    justify-items: center;
}
.left-value{
    justify-self: end;
    margin-right: 20%;
}
.right-value{
    justify-self: start;
    margin-left: 20%;
}
.t-value{
    max-width: 25%;
}
.style-text{
    color: black;
    font-size: large;
    font-family:'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
}
.values{
    margin-top: 70px;
    /* max-width: 50%; */
}

form{
    display: grid;
}
input{
    border: 2px #cecece solid;
    border-radius: 5px;
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
h2{
    font-family:'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
    color: black;
    text-align: center;
    /* max-width: 200px; */
}
</style>