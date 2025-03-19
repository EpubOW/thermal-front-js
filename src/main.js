import './assets/main.css'
import CanvasJSChart from '@canvasjs/vue-charts';
import { Chart } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(CanvasJSChart)
Chart.register(annotationPlugin)


app.mount('#app')
