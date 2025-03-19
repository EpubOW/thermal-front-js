<script setup> 
    import { ref, useTemplateRef, onMounted, nextTick } from 'vue';
    import { useDeviceStatusStore } from '@/stores/deviceStatusStore';
    import DeviceList from './DevicesList.vue';
    import Chart from './Chart.vue';
    import Header from './Header.vue';
    import imagePlaceholder from '@/assets/push-to-point-img.jpg'

    const deviceStatusStore = useDeviceStatusStore()
    const updateTime = 60000; //milliseconds
    let tempChart = useTemplateRef('tempChart');
    let imageSrc = ref(imagePlaceholder)

    onMounted(async () => {
        await nextTick() // ждём отрисовки графика
        // addToStore() // добавляем фейковые данные
        await deviceStatusStore.getChartThresholdsFromDB() // ждём границы температурных боксов для графика
        tempChart.value.updateThresholds( // обновляем границы температурных боксов для графика
            deviceStatusStore.getChartThresholds.get('threshold_yellow'), 
            deviceStatusStore.getChartThresholds.get('threshold_red')
        )

        getDataForChart() // взятие данных из БД
        devicesSurvey() // таймер на обновление графика
    })

    function rerender(dataset){
        console.log('chart datasets', tempChart.value.chartRef.chart.data.datasets)

        let groupedMap = new Map()
        for (const [id, idSensor, temp, datetime, label] of dataset) {
            let data = {
                    x: new Date(datetime.slice(0, -4)),
                    y: temp,
                    id: id
            }
            if (idSensor !== null){
                if(!groupedMap.has(idSensor)){
                    groupedMap.set(idSensor, {label: label, data: []})
                }
                if (!deviceStatusStore.allDevices.has(idSensor)) {
                    deviceStatusStore.addDevice(idSensor);
                }                
                groupedMap.get(idSensor)['data'].push(data)
                // deviceStatusStore.updateDeviceTemp(id, data)
                
                // groupedMap.get(id).push({x: new Date(datetime.slice(0, -4)), y: temp})
            }
        }
        groupedMap.forEach((value, key) => {
            deviceStatusStore.updateDeviceTemp(key, value)
            // deviceStatusStore.updateDeviceStatusTemp(key, value[0]['y'])
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

    async function getDataForChart(){
        console.log('request for update chart')
        let jsonData = new Map()
        jsonData.set("idCompany", '0')
        jsonData = JSON.stringify(Object.fromEntries(jsonData))
        await fetch(`http://10.5.5.10:5000/getData`, {
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
                console.log('response', response)
                rerender(response) 
            } else console.log('Ошибка при получении запроса')
        })
    }

    function addToStore(){
        let data = [
            [0, 0, 28.2, '2025-02-13 09:50:26.923254', 'label'],
            [1, 0, 30.2, '2025-02-13 09:50:27.923254', 'label'],
            [2, 0, 32.2, '2025-02-13 09:50:28.923254', 'label'],
            [3, 0, 34.2, '2025-02-13 09:50:29.923254', 'label'],
            [4, 0, 36.2, '2025-02-13 09:50:30.923254', 'label'],
            [5, 0, 38.2, '2025-02-13 09:50:31.923254', 'label'],
            [6, 0, 40.2, '2025-02-13 09:50:32.923254', 'label'],
            [7, 0, 42.2, '2025-02-13 09:50:33.923254', 'label'],
            [8, 1, 44.2, '2025-02-13 09:50:26.923254', 'label1'],
            [9, 1, 46.2, '2025-02-13 09:50:27.923254', 'label1'],
            [10, 1, 48.2, '2025-02-13 09:50:28.923254', 'label1'],
            [11, 1, 50.2, '2025-02-13 09:50:29.923254', 'label1'],
            [12, 1, 52.2, '2025-02-13 09:50:30.923254', 'label1'],
            [13, 1, 54.2, '2025-02-13 09:50:31.923254', 'label1'],
            [14, 1, 56.2, '2025-02-13 09:50:32.923254', 'label1'],
            [15, 1, 58.2, '2025-02-13 09:50:33.923254', 'label1'],
            [16, 1, 60.2, '2025-02-13 09:50:34.923254', 'label1'],
        ]
        rerender(data)
    }

    function updateChartLabels(key, oldLabel, label){
        console.log('kl', key, oldLabel, label)   
        let dataset = getChartDatasetByLabel(oldLabel)
        dataset.label = label
        updateChart()
    }

    async function updateLabels(){
        console.log('request for update label')
        let jsonData = new Map()
        jsonData.set('idCompany', '1')
        let idSensors = {}
        deviceStatusStore.devices.forEach((value, key) => {
            idSensors[key] = value.label
        })
        jsonData.set('idSensors', idSensors)
        jsonData = JSON.stringify(Object.fromEntries(jsonData))
        console.log('json', jsonData)
        await fetch(`http://10.5.5.10:5000/updateLabels`, { 
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

    async function getImage(datasetIndex, dataIndex) {
        console.log('request for get image')
        let jsonData = new Map()
        jsonData.set('idCompany', '1')
        jsonData.set('idSensor', datasetIndex) 
        jsonData.set('idRecord', dataIndex)
        console.log('data', datasetIndex, dataIndex)
        jsonData = JSON.stringify(Object.fromEntries(jsonData))
        console.log('json', jsonData)
        await fetch(`http://10.5.5.10:5000/getImage`, { 
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
                if (response['status'] == true){
                    imageSrc.value = `data:image/jpeg;base64,${response['image']}`
                    console.log(imageSrc)
                }
            } else console.log('Ошибка при получении запроса')
        })
    }

    async function devicesSurvey(){
        console.log('start interval for updating chart')
        let timer = setInterval(getDataForChart, updateTime)
    }


</script>


<template>
    <Header></Header>
    <div class="main-info">
        <DeviceList @update-labels="updateLabels" @update-chart-labels="updateChartLabels" />
        <div class="chart-container">
            <div>
                <Chart @data-from-point="getImage" ref="tempChart"></Chart>  
            </div>
            <div class="img-holder">
                <img :src="imageSrc" alt="">
                <!-- <button @click="getImage()">Получить картинку</button> -->
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
    /* position: absolute;
    top: 10px;
    right: -320px; */
}
.chart-container {
    display: grid;
    grid-template-columns: auto auto;
}



</style>
