<script setup>
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend, 
    registerables,
    scales,
    TimeScale,
    plugins
  } from 'chart.js'

  import { Line } from 'vue-chartjs'
  import 'chartjs-adapter-moment'
  import 'chartjs-plugin-annotation'
  import { ref, useTemplateRef, onMounted, nextTick, defineExpose } from 'vue';
  
  
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    scales,
    TimeScale,
    ...registerables
  )

  const data = {
    datasets: []
}

const emit = defineEmits(['inFocus', 'submit'])

function printVal(context){
    console.log(context)
}

function updateThresholds(thresholdYellow, thresholdRed){
  let annotations = chartRef.value.chart.options.plugins.annotation.annotations
  annotations.greenBox.yMax = thresholdYellow
  annotations.yellowBox.yMin = thresholdYellow
  annotations.yellowBox.yMax = thresholdRed
  annotations.redBox.yMin = thresholdRed
  chartRef.value.chart.update()
}

// let threshold_yellow = deviceStatusStore.getChartThresholds.get('threshold_yellow')
// let threshold_red = deviceStatusStore.getChartThresholds.get('threshold_red')

function toNormalDate(date){
    return new Intl.DateTimeFormat('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).format(date);
}

const options = {
  responsive: true,  
  maintainAspectRatio: false,
  scales:{
    x: {
      type: 'time',
      time: {
        unit: 'minute', // Разбивка по минутам
        displayFormats: {
          minute: 'DD.MMM HH:mm'
        }
      }
    },
    y: {
      title:{
        text: "Температура, C°",
        display: true,
        font:{
            size: 20,
            family: "'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif"
        }
      }
    }
  },
  onClick: (event, elements) => {
    let datasetIndex = elements[0].datasetIndex
    let dataIndex = elements[0].element.$context.raw.id
    console.log('chart point click', datasetIndex, dataIndex)
    emit('dataFromPoint', datasetIndex, dataIndex)
  },
  plugins:{
    legend:{
      position: 'bottom'
    },
    tooltip:{
      callbacks:{
          title: function (context) {
              // printVal(new Date(context[0].label))
              let date = context.length ? toNormalDate(new Date(context[0].label)) : ''
              return date
          },
          label: function(context) {
              // printVal(context.dataset)
              return `${context.dataset.label}: ${context.raw.y} C° `;
          }
      }
    },
    annotation: {
        annotations:{
            greenBox: {
                type: 'box',
                yMax: 0,
                backgroundColor: 'rgba(0, 255, 0, 0.25)'
            },
            yellowBox: {
                type: 'box',
                yMin: 0,
                yMax: 0,
                backgroundColor: 'rgba(255, 255, 0, 0.15)'
            },
            redBox: {
                type: 'box',
                yMin: 0,
                backgroundColor: 'rgba(255, 0, 0, 0.25)'
            }
        }
    }
  },
  animation: {
        duration: 0,
        easing: 'linear',
  }      
}

let chartRef = useTemplateRef('chartRef');
defineExpose({ chartRef, updateThresholds })
// let chartRef = ref(null)

// onMounted(async () => {
//     // console.log('chartRef', chartRef.value.chart)
//     await nextTick() // Ждём, пока график отрендерится
//     if (chartRef.value?.chart) {
//         console.log('Chart instance:', chartRef.value.chart) // Теперь точно есть доступ!
//     } else {
//         console.error('Chart instance is still null!')
//     }
// })
</script>

<template>
    <Line ref="chartRef" :options="options" :data="data" style="max-height: 550px; min-width: 750px; display:inline-block;" ></Line>
</template>

<style scoped>
/* header{
    background-color: aqua;
} */
</style>