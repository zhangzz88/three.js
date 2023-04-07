<template>
  <div ref="boxDom">
    <ThreeSix :width="width" :height="height"></ThreeSix>
    <ThreeOne :width="width" :height="height"></ThreeOne>
    <ThreeTwo :width="width" :height="height"> </ThreeTwo>
    <ThreeThree :width="width" :height="height"></ThreeThree>
    <ThreeFive :width="width" :height="height"></ThreeFive>
    <ThreeFour :width="width" :height="height"></ThreeFour>
  </div>
</template>
<script>
import ThreeOne from '../components/threeComponented/ThreeOneCom.vue'
import ThreeTwo from '../components/threeComponented/ThreeTwoCom.vue'
import ThreeThree from '../components/threeComponented/ThreeThreeCom.vue'
import ThreeFour from '../components/threeComponented/ThreeFourCom.vue'
import ThreeFive from '../components/threeComponented/ThreeFiveCom.vue'
import ThreeSix from '../components/threeComponented/ThreeSixCom.vue'
import { onMounted, ref } from 'vue'
export default {
  components: {
    ThreeOne,
    ThreeTwo,
    ThreeThree,
    ThreeFour,
    ThreeFive,
    ThreeSix
  },
  setup () {
    var width = ref(window.innerWidth > 700 ? window.innerWidth - 212 : window.innerWidth - 57)
    var height = 300
    var boxDom = ref(null)


    onMounted(() => {

      let fnn = new ResizeObserver(() => {
        if (boxDom.value) {
          // console.log(boxDom.value.clientWidth)
          width.value = boxDom.value.clientWidth
        }
      })
      fnn.observe(boxDom.value)
    })

    // 窗口改变的时候
    window.onresize = function () {
      // 改变所有相机的长宽比
      // if (boxDom.value) width.value = boxDom.value.clientWidth
    }
    return { width, height, boxDom }
  },
};
</script>
<style >
.el-card__body {
  padding: 0;
}
</style>