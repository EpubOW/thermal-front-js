import { defineStore } from "pinia";
import { useUserStore } from "./userStore";



export const useDeviceStatusStore = defineStore('deviceStatus', {
    state: () => ({
        devices: new Map(),
        chartThresholds: new Map(),
        tempStatuses: new Map()
    }),
    getters: {
        getIpAddressFromUserStore() {
            const userStore = useUserStore()
            return userStore.ipAddress
        },
        getIdCompany(){
            const userStore = useUserStore()
            return userStore.getIdCompany
        },
        allDevices(state){
            return state.devices
        },
        getChartThresholds(state){
            return state.chartThresholds
        },
        getTempStatuses(state){
            return state.tempStatuses
        },
        dangerDeviceStatus(state) {
            return () => (
                new Map([...state.devices]
                    .filter(([K, v]) => v['data'][0]['y'] > this.chartThresholds.get('threshold_red'))).size
            )
        },
        warningDeviceStatus(state) {
            return () => (
                new Map([...state.devices]
                    .filter(([K, v]) => v['data'][0]['y'] >= this.chartThresholds.get('threshold_yellow') && v['data'][0]['y'] <= this.chartThresholds.get('threshold_red') )).size
            )
        },
        normalDeviceStatus(state) {
            return () => (
                new Map([...state.devices]
                    .filter(([k, v]) => v['data'][0]['y'] < this.chartThresholds.get('threshold_yellow'))).size
            )
        },
        statusesMapDevice(state) {
            return () => (
                new Map([...state.devices]
                    .map((dev) => {
                        let temp = dev[1]['data'][0]['y']
                        let label = dev[1]['label']
                        console.log('t/l', temp, dev[1]['label'])
                        if (temp > 50) return [dev[0], [label, 'r']]
                        else if (temp >= 30 && temp <= 50) return [dev[0], [label, 'y']]
                        else if (temp < 30) return [dev[0], [label, 'g']]
                    })
                )
            )
        },
        getDeviceByID(state){
            return (id) => (
                new Map([...state.devices]
                    .filter(([k, v]) => k == id)
                )
            )
        }
    }, 
    actions: {
        addDevice(id){
            this.devices.set(id, []);
        },
        updateDeviceTemp(id, data){
            this.devices.set(id, data)
        },
        changeDeviceStatusLabel(key, label){
            console.log('label', label)
            this.devices.get(key)['label'] = label
            console.log('devs', this.devices)
            console.log('tempStatuses', this.getTempStatuses)
        },
        setChartThresholds(data){
            this.chartThresholds = data
        },
        setTempStatuses(){
            let tr = this.chartThresholds.get('threshold_red')
            let ty = this.chartThresholds.get('threshold_yellow')
            console.log('setTempStatuses', [...this.devices])
            this.tempStatuses = new Map([...this.devices]
                .map((dev) => {
                    let temp = dev[1]['data'][0]['y']
                    let label = dev[1]['label']
                    console.log('t/l', temp, dev[1]['label'])
                    if (temp > tr) return [dev[0], [label, 'r']]
                    else if (temp >= ty && temp <= tr) return [dev[0], [label, 'y']]
                    else if (temp < ty) return [dev[0], [label, 'g']]
                })
            )
        },
        async basicDeviceSetup(){
            console.log('basicDeviceSetup')
            const userStore = useUserStore()
            const workMode = userStore.getWorkMode
            if (workMode == 'local'){
                // добавляем фейковые данные
                console.log('local')
                await this.addToStore()
            }
            else if (workMode == 'production'){
                // взятие данных из БД
                await this.getDataForChart()
                devicesSurvey() // таймер на обновление графика        
            }
            await this.getChartThresholdsFromDB()
            // if (tempChart){
            //     tempChart.value.updateThresholds( // обновляем границы температурных боксов для графика
            //         this.getChartThresholds.get('threshold_yellow'), 
            //         this.getChartThresholds.get('threshold_red')
            //     )
            // }
            this.setTempStatuses()// ждём границы температурных боксов для графика
            return 'ok'
        },
        async devicesSurvey(){
            console.log('start interval for updating chart')
            let timer = setInterval(getDataForChart, updateTime)
        },
        async addToStore(){
            console.log('addToStore')
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
            return await this.setDevicesToStore(data)
        },
        async getDataForChart(){
            console.log('request for update chart')
            let jsonData = new Map()
            jsonData.set("idCompany", this.getIdCompany)
            jsonData = JSON.stringify(Object.fromEntries(jsonData))
            return await fetch(`http://${userStore.ipAddress}:5000/getData`, {
                method: "POST", 
                cors: "no-cors",
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                },
                body: jsonData
            })
            .then(response =>  response.json())
            .then(async (response) => {
                if (response){
                    console.log('render from getDataForChart')
                    console.log('response', response)
                    return await setDevicesToStore(response)
                } else console.log('Ошибка при получении запроса')
            })
        },
        async setDevicesToStore(dataset){
            let groupedMap = new Map()
            for (const [id, idSensor, temp, datetime, label] of dataset) {
                let data = {
                        x: new Date(datetime.slice(0, -4)),
                        y: temp,
                        id: id,
                        idSensor: idSensor
                }
                if (idSensor !== null){
                    if(!groupedMap.has(idSensor)){
                        groupedMap.set(idSensor, {label: label, data: []})
                    }
                    if (!this.allDevices.has(idSensor)) {
                        this.addDevice(idSensor);
                    }                
                    groupedMap.get(idSensor)['data'].push(data)
                }
            }
            console.log('deviceStatusStore', this.allDevices)
            groupedMap.forEach((value, key) => {
                this.updateDeviceTemp(key, value)
            })
            return groupedMap
        },



        async getChartThresholdsFromDB(){
            console.log('request for get thresholds')
            let jsonData = new Map()
            jsonData.set("idCompany", this.getIdCompany)
            console.log('json', jsonData)
            jsonData = JSON.stringify(Object.fromEntries(jsonData))
            let response = await fetch(`http://${this.getIpAddressFromUserStore}:5000/getThresholds`, { 
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
                    console.log('response getChartThresholds', response)
                    let thresholds = new Map()
                    thresholds.set(response[0][1], response[0][2])
                    thresholds.set(response[1][1], response[1][2])
                    this.chartThresholds = thresholds
                    return 'ok'
                } else{
                    console.log('Ошибка при получении запроса')
                    return 'error'
                } 
            })
            return response
        },
        async setChartThresholdsToDB(threshold_yellow, threshold_red){
            console.log('request for set thresholds')
            let jsonData = new Map()
            jsonData.set("idCompany", this.getIdCompany)
            jsonData.set('threshold_yellow', threshold_yellow)
            jsonData.set('threshold_red', threshold_red)
            jsonData = JSON.stringify(Object.fromEntries(jsonData))
            console.log('json', jsonData)
            await fetch(`http://${this.getIpAddressFromUserStore}:5000/updateThresholds`, {
                method: "POST", 
                cors: "no-cors",
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                },
                body: jsonData
            })
            .then(response => response.json())
            .then((response) => {
                if (response) {
                    console.log('response from setChartThresholdsToDB', response)
                    if (response['status'] == true){
                        this.getChartThresholdsFromDB()
                    }
                } else console.log('Ошибка при получении запроса')
            })
        }
    }
})
