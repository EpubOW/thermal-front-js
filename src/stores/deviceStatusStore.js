import { defineStore } from "pinia";

export const useDeviceStatusStore = defineStore('deviceStatus', {
    state: () => ({
        devices: new Map(),
        chartThresholds: new Map()
    }),
    getters: {
        getChartThresholds(state){
            return state.chartThresholds
        },
        dangerDeviceStatus(state) {
            return () => (
                new Map([...state.devices]
                    .filter(([K, v]) => v['data'][0]['y'] > 50)).size
            )
        },
        warningDeviceStatus(state) {
            return () => (
                new Map([...state.devices]
                    .filter(([K, v]) => v['data'][0]['y'] >= 30 && v['data'][0]['y'] <= 50 )).size
            )
        },
        normalDeviceStatus(state) {
            return () => (
                new Map([...state.devices]
                    .filter(([k, v]) => v['data'][0]['y'] < 30)).size
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

        allDevices(state){
            return state.devices
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
        },
        setChartThresholds(data){
            this.chartThresholds = data
        },
        async getChartThresholdsFromDB(){
            console.log('request for get thresholds')
            let jsonData = new Map()
            jsonData.set('idCompany', '1')
            console.log('json', jsonData)
            jsonData = JSON.stringify(Object.fromEntries(jsonData))
            await fetch(`http://10.5.5.10:5000/getThresholds`, { 
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
                } else console.log('Ошибка при получении запроса')
            })
        },
        async setChartThresholdsToDB(threshold_yellow, threshold_red){
            console.log('request for set thresholds')
            let jsonData = new Map()
            jsonData.set('idCompany', '1')
            jsonData.set('threshold_yellow', threshold_yellow)
            jsonData.set('threshold_red', threshold_red)
            jsonData = JSON.stringify(Object.fromEntries(jsonData))
            console.log('json', jsonData)
            await fetch(`http://10.5.5.10:5000/updateThresholds`, {
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
