<script setup>
</script>

<template>
    <table>
        <tr>
            <td>
                <span>1</span>
            </td>
            <td>
                <div class="indicator green_ind"></div>
            </td>
        </tr>
        <tr>
            <td>
                <span>2</span>
            </td>
            <td>
                <div class="indicator green_ind"></div>
            </td>
        </tr>
        <tr>
            <td>
                <span>3</span>
            </td>
            <td>
                <div class="indicator yellow_ind"></div>
            </td>
        </tr>
        <tr>
            <td>
                <span>4</span>
            </td>
            <td>
                <div class="indicator red_ind"></div>
            </td>
        </tr>
    </table>
</template>

<style scoped>

.green_ind {
    background-color: rgb(29, 216, 29);
}
.yellow_ind {
    background-color: yellow;
}
.red_ind {
    background-color: red;
}
.indicator {
    display: inline-block;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    border: 1px solid black;
    margin-right: 10px;

}
table {
    border: black 2px solid;
    width: 50% !important;
    height: 30%;
    margin-top: 100px;
    margin-left: 70px;
    /* align-items: center;
    text-align: center; */
    font-size: 20px;
    max-width: 120px;
} 
td{
    text-align: right;
}
</style>