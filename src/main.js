import './assets/main.css'
import CanvasJSChart from '@canvasjs/vue-charts';

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(CanvasJSChart)

app.mount('#app')
