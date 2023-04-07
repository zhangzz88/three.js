<template>
  <div
    ref="echartsDom"
    class="ecahrtsDOM"
    :style="{
      width: String($attrs.width) + 'px',
      height: String($attrs.height) + 'px',
    }"
  ></div>
</template>
<script setup lang="ts">
import * as echarts from "echarts";
import { onMounted, ref, useAttrs } from "vue";
var echartsDom = ref(); 

onMounted(() => {
  var myChart = echarts.init(echartsDom.value);
  var attrsData: any = useAttrs();
  myChart.setOption(attrsData.list);
});
</script>
<style>
.ecahrtsDOM {
  margin: 0 auto;
}
</style>