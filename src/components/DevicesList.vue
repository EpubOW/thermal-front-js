<script setup>
    import { onMounted, ref, computed } from 'vue';
    import { useDeviceStatusStore } from '@/stores/deviceStatusStore';

    const deviceStatusStore = useDeviceStatusStore()
    const emit = defineEmits(['inFocus', 'submit'])
    const devices = ref(new Array([1, 'g'], [2, 'g'], [3, 'y'], [4, 'r'], [5, 'g']))
    let isCanRename = ref(false)

    const tempToStatus = computed((value) => {
        if (value > 50) {return 'r'}
        else if (value >= 30 && value <= 50) {return 'y'}
        else if (value < 30) {return 'g'}
    })

    function saveDevices(){
        if (!isCanRename.value){
            console.log('save')
            emit('updateLabels')
        } 
    }
    function changeDeviceValue (key, oldLabel, label){
        deviceStatusStore.changeDeviceStatusLabel(key, label)
        emit('updateChartLabels', key, oldLabel, label) //dont work
    }

</script>

<template>
    <div class="device-list">
        <span class="style-text">Датчики</span>
        <hr class="group-line">
        <div class="scrollabe-elem">
            <table>
                <tbody>
                    <tr v-for="([key, value], index) in deviceStatusStore.getTempStatuses">
                        <td>
                            <!-- ? text or number ? -->
                            <input type="text" 
                                :value="value[0]" 
                                :class="[ isCanRename ? 'can-rename' : 'not-can-rename' ]" 
                                class="style-text dev-name" 
                                :disabled="!isCanRename" 
                                style="width: 70%; margin-right: 20px;"
                                @input="event => changeDeviceValue(key, value[0], event.target.value)">
                        </td>
                        <td>
                            <div class="indicator" :class="value[1]" ></div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <button :class="{ 'btn-confirm': isCanRename }" class="style-text btn"  @click="isCanRename = !isCanRename, saveDevices()">{{isCanRename ? 'Сохранить' : 'Изменить'}}</button>
        <!-- <span>{{ isCanRename }}</span> -->
    </div>
    
</template>

<style scoped>

.g {
    background-color: rgb(29, 216, 29);
}
.y {
    background-color: yellow;
}
.r {
    background-color: red;
}
.indicator {
    display: inline-block;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    border: 1px solid black;
    margin-right: 10px;
}
.scrollabe-elem{
    max-height: 300px;
    overflow-y: auto;
}
.scrollabe-elem::-webkit-scrollbar {
    width: 8px;
}
.scrollabe-elem::-webkit-scrollbar-thumb {
    background-color: gray;
    border-radius: 4px;
}

table{
    border-collapse: collapse;
    /* overflow-y: auto;
    max-height: 10px; */
}
/* table {
    border: black 2px solid;
    margin-top: 50px;
    margin-left: 50px;
    font-size: 20px;
    max-width: 40%;
    max-height: 50%;
}  */
td{
    text-align: right;
    padding: 4px 0;
    border-bottom: 2px solid rgb(200, 200, 200);
}
.device-list{
    display: flex;
    position: relative;
    flex-direction: column;
    align-items: center;
    border: black 2px solid;
    margin-top: 25px;
    font-size: 20px;
    max-width: 85%;
    max-height: 70%;
    border-radius: 10px;
    background-color: #f2f2f2;
    min-width: 120px;
}
.dev-name{
    border: 2px #cecece solid;
}
.can-rename{
    background-color: #ededed;
}
.not-can-rename{
    background-color: #d6d6d6;
}
.style-text{
    color: black;
    font-size: large;
    font-family:'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
}
.group-line{
    border-color: black; 
    min-width: 70%
}
.device-line{
    border-color: rgb(220, 220, 220);
    min-width: 100%;
}
.btn{
    position: absolute;
    bottom: 10px;
    border: none;
    background-color: #D9D9D9;
    border-radius: 5px;
    padding: 5px 10px;
}
.btn:hover{
    background-color: #c3c3c3;
    cursor: pointer;
}
.btn:active{
    background-color: #b3b3b3;
}
.btn-confirm{
    background-color: rgb(0, 200, 0);
    color: white;
}
.btn-confirm:hover{
    background-color: rgb(0, 185, 0);
}
.btn-confirm:active{
    background-color: rgb(0, 170, 0);
}
</style>
