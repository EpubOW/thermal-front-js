<script setup> 
    import { ref, useTemplateRef, onMounted, nextTick, onBeforeMount } from 'vue';
    import { useDeviceStatusStore } from '@/stores/deviceStatusStore';
    import { useCounterStore } from '@/stores/counter';
    import { useUserStore } from '@/stores/userStore';
    import DeviceList from './DevicesList.vue';
    import Chart from './Chart.vue';
    import Header from './Header.vue';
    import imagePlaceholder from '@/assets/push-to-point-img.jpg'
    import thermoTestImage from '@/assets/thermo-image.jpg'

    const deviceStatusStore = useDeviceStatusStore()
    const userStore = useUserStore()
    const updateTime = 60000; //milliseconds
    let tempChart = useTemplateRef('tempChart');
    let imageSrc = ref(imagePlaceholder)
    const workMode = userStore.getWorkMode 
    let imageDataInfo = []

    onBeforeMount(async () => {
        await deviceStatusStore.basicDeviceSetup()
    })

    onMounted(async () => {
        nextTick().then(() => {
            rerender()
            // console.log()
            // tempChart.value.updateThresholds( // обновляем границы температурных боксов для графика
            //     deviceStatusStore.getChartThresholds.get('threshold_yellow'), 
            //     deviceStatusStore.getChartThresholds.get('threshold_red')
            // )
        })
    })

    function rerender(){
        deviceStatusStore.allDevices.forEach((value, key) => {
            try{
                let dataset = getChartDatasetByLabel(value['label'])
                console.log('label', value)
                if (!dataset){
                    tempChart.value.chartRef.chart.data.datasets.push(
                    {
                        label: value['label'],
                        data: value['data']
                    })
                }
                else {
                    dataset.data = value['data']
                }
            } catch (error) { console.log('error', error) }
        })
        updateChart()
    }

    function updateChart(){
        // console.log('deviceStatuses', deviceStatusStore.dangerDeviceStatus(), deviceStatusStore.warningDeviceStatus(),
        // deviceStatusStore.normalDeviceStatus())
        console.log('allData', [...deviceStatusStore.devices][0][1])

        tempChart.value.chartRef.chart.update()
        console.log('update')
    }

    function getChartDatasetByLabel(label){
        let dataset = null
        tempChart.value.chartRef.chart.data.datasets.forEach((value, key) => {
            if (value.label === label) {
                dataset = tempChart.value.chartRef.chart.data.datasets[key]
            }
        })
        return dataset
    }

    function updateChartLabels(key, oldLabel, label){
        console.log('kl', key, oldLabel, label)   
        let dataset = getChartDatasetByLabel(oldLabel)
        dataset.label = label
        deviceStatusStore.setTempStatuses()
        updateChart()
    }

    async function updateLabels(){
        console.log('request for update label')
        let jsonData = new Map()
        jsonData.set("idCompany", userStore.getIdCompany)
        let idSensors = {}
        deviceStatusStore.devices.forEach((value, key) => {
            idSensors[key] = value.label
        })
        jsonData.set('idSensors', idSensors)
        jsonData = JSON.stringify(Object.fromEntries(jsonData))
        console.log('json', jsonData)
        await fetch(`http://${userStore.ipAddress}:5000/updateLabels`, { 
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
                console.log('render chart')
                console.log('response update labels', response)
            } else console.log('Ошибка при получении запроса')
        })
    }

    async function getImage(idSensor, id, datasetIndex, index) {
        console.log('request for get image')
        let jsonData = new Map()
        jsonData.set("idCompany", userStore.getIdCompany)
        jsonData.set('idSensor', idSensor) 
        jsonData.set('idRecord', id)
        console.log('data', idSensor, id)
        jsonData = JSON.stringify(Object.fromEntries(jsonData))
        console.log('json', jsonData)
        await fetch(`http://${userStore.ipAddress}:5000/getImage`, { 
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
                console.log('response getImage', response)
                imageSrc.value = thermoTestImage // временно
                imageDataInfo = [datasetIndex, index] // убрать в проверку
                if (response['status'] == true){
                    imageSrc.value = `data:image/jpeg;base64,${response['image']}`
                }
            } else console.log('Ошибка при получении запроса')
        })
    }

    async function nextPrevImage(movementDirection){
        const nextPoint = tempChart.value.chartRef.chart.data.datasets[imageDataInfo[0]].data[imageDataInfo[1] + movementDirection]
        if (nextPoint){
            await getImage(nextPoint.idSensor, nextPoint.id, imageDataInfo[0], imageDataInfo[1] + movementDirection)
        }
        console.log('next/prev', movementDirection, imageDataInfo)
    }

    


</script>


<template>
    <Header></Header>
    <div class="main-info">
        <DeviceList @update-labels="updateLabels" @update-chart-labels="updateChartLabels" />
        <div class="chart-container">
            <div>
                <Chart @get-image="getImage" ref="tempChart"></Chart>  
            </div>
            <div class="img-holder">
                <img :src="imageSrc" alt="">
                <button 
                    id="close-image"
                    class="image-button"
                    :class="[imageSrc == imagePlaceholder ? 'hidden' : '']"
                    @click="imageSrc = imagePlaceholder; imageDataInfo = []">
                    <span>X</span>
                </button>
                <button
                    id="next-image"
                    class="image-button"
                    :class="[imageSrc == imagePlaceholder ? 'hidden' : '']"
                    @click="nextPrevImage(1)"
                    >
                    <span>></span>
                </button>
                <button
                    id="prev-image"
                    class="image-button"
                    :class="[imageSrc == imagePlaceholder ? 'hidden' : '']"
                    @click="nextPrevImage(-1)"
                    >
                    <span><</span>
                </button>
            </div>          
        </div>
    </div>
    
</template>


<style scoped>
/* .indicators {
    display: grid;
    justify-content: center;
} */
.main-info {
    margin-top: 50px;
    display: inline-grid;
    grid-template-columns: auto auto;
    /* justify-content: center; */
    /* margin-top: 50px; */
}
.main_elem {
    display: flex;
    justify-content: center;
}
.img-holder {
    margin-top: 10px;
    width: 323px; 
    height: 242px; 
    border: 2px solid black;
    position: relative;
    /* position: absolute;
    top: 10px;
    right: -320px; */
}
.hidden{
    display: none;
}
.image-button{
    position: absolute;
    margin: 5px;
    border-radius: 3px;
    border: none;
    color: white;
    background-color: rgba(0, 0, 0, 0.6);
    cursor: pointer;
}
.image-button:hover{
    background-color: rgba(0, 0, 0, 0.8);
}
#close-image{
    top: 0;
    right: 0;
    padding: 7px;
}
#next-image{
    top: 45%;
    right: 0;
    padding: 10px 7px;
}
#prev-image{
    top: 45%;
    left: 0;
    padding: 10px 7px;
}


.chart-container {
    display: grid;
    grid-template-columns: auto auto;
}



</style>
