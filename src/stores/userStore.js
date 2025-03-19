import { defineStore } from "pinia";

export const useUserStore = defineStore('userStore', {
    state: () => ({
        token: '',
        username: '',
        authorizedStatus: false
    }),
    getters: {
        getToken(state){
            return state.token
        },
        getUsername(state){
            return state.username
        },
        getAutorizedStatus(state){
            return state.authorizedStatus
        }
    }, 
    actions: {
        setToken(newToken){
            this.token = newToken
        },
        setUsername(newUsername){
            this.username = newUsername
        },
        setAuthorizedStatus(){
            this.authorizedStatus = !this.authorizedStatus
        },
        checkTokenRequired(){
            console.log('required')
        }
    }
})