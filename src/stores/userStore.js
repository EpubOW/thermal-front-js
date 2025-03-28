import { defineStore } from "pinia";

export const useUserStore = defineStore('userStore', {
    state: () => ({
        token: localStorage.getItem('authToken') || '',
        username: localStorage.getItem('username') || '',
        authorizedStatus: false,
        workMode: 'local', // локальный (local)/полный (production) режим работы
        idCompany: localStorage.getItem('idCompany') || ''
    }),
    getters: {
        ipAddress(state){
            return state.workMode === 'local' ? 'localhost' : '10.5.5.10'
        },
        getToken(state){
            return state.token
        },
        getUsername(state){
            return state.username
        },
        getWorkMode(state){
            return state.workMode
        },
        getAutorizedStatus(state){
            return state.authorizedStatus
        },
        getIdCompany(state){
            return state.idCompany
        }
    }, 
    actions: {
        setToken(newToken){
            this.token = newToken
        },
        setWorkMode(){
            this.ipAddress = this.workMode === 'local' ? 'localhost' : '10.5.5.10'
        },
        setUsername(newUsername){
            this.username = newUsername
        },
        setIdCompany(newIdCompany){
            this.idCompany = newIdCompany
        },
        setAuthorizedStatus(){
            this.authorizedStatus = !this.authorizedStatus
        },
        checkTokenRequired(){
            console.log('required')
        }
    }
})