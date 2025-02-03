<script setup> 
    import { ref, useTemplateRef } from 'vue';
    import DeviceList from './DevicesList.vue';

    let chart = ref(null);
    // let chart = ref(null);
    let options = {
        animationEnabled: true,
        title:{
            text: "График изменения температуры",
            fontSize: 16,
        },
        axisY:{
            title: "Температура, C°",
        },
        toolTip: {
            shared: true
        },
        legend: {
            cursor: "pointer",
            itemclick: function (e) {
                if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                    e.dataSeries.visible = false;
                } else {
                    e.dataSeries.visible = true;
                }
                e.chart.render();
            }
        },
        data: [{
        type: "line",
        name: '1',
        showInLegend: true,
        dataPoints: [
            { label: "1",  y: 10 },
            { label: "2", y: 11 },
            { label: "3", y: 12 },
            { label: "4",  y: 13 },
            { label: "5",  y: 12 }
        ]
        },
        {
        type: "line",
        name: '2',
        showInLegend: true,
        dataPoints: [
            { label: "1",  y: 9 },
            { label: "2", y: 10 },
            { label: "3", y: 11 },
            { label: "4",  y: 12 },
            { label: "5",  y: 13 }
        ]
        },
        {
        type: "line",
        name: '3',
        showInLegend: true,
        dataPoints: [
            { label: "1",  y: 11 },
            { label: "2", y: 16 },
            { label: "3", y: 26 },
            { label: "4",  y: 20 },
            { label: "5",  y: 28 }
        ]
        },
        {
        type: "line",
        name: '4',
        showInLegend: true,
        dataPoints: [
            { label: "1",  y: 11 },
            { label: "2", y: 16 },
            { label: "3", y: 26 },
            { label: "4",  y: 20 },
            { label: "5",  y: 35 }
        ]
        }]
    }

    function checkChart() {
        console.log(chart.value);
    }

</script>


<template>
    <div class="main_info">
        <DeviceList />
        <div>
            <div class="indicators">
                <div id="green_ind" class="ind_box">
                    <div>2</div>
                </div>
                <div id="yellow_ind" class="ind_box">
                    <div>1</div>
                </div>
                <div id="red_ind" class="ind_box">
                    <div>1</div>
                </div>
            </div>
            <CanvasJSChart :options="options" ref="chart" style="min-width: 500px;"/>
        </div>
        
        
        
    </div>
    
</template>


<style scoped>
/* .indicators {
    display: grid;
    justify-content: center;
} */
.main_info {
    display: grid;
    grid-template-columns: 1fr 2fr;
    /* justify-content: center; */
    /* margin-top: 50px; */
}

#green_ind {
    background-color: rgb(29, 216, 29);
}
#yellow_ind {
    background-color: yellow;
}
#red_ind {
    background-color: red;
}
.ind_box{
    display: inline-block;
    margin: 10px;
    width: 50px;
    text-align: center;
    font-size: 20px;
    border: black 2px solid;
}
.indicators{
    display: flex;
    justify-content: center;
}

</style>