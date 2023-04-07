<template>
  <el-row style="margin-bottom: 10px; position: relative">
    <el-button style="position: absolute" @click="quickFnn">前进</el-button>
    <el-button style="position: absolute; right: 0" @click="retardFnn"
      >后退</el-button
    >
    <el-button
      style="position: absolute; left: 0; top: 50px; margin: 0"
      @click="leftFnn"
      >左转</el-button
    >
    <el-button
      style="position: absolute; right: 0; top: 50px; margin: 0"
      @click="rightFnn"
      >右转</el-button
    >
    <el-col :span="24">
      <!-- <h1>你好</h1> -->
      <div ref="cardDom">
        <el-card v-loading="Dombool">
          <div ref="domThree"></div>
        </el-card>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import { computed, onMounted, ref, watch } from "vue"
import * as THREE from "three"
import { GLTFLoader } from '../../../node_modules/three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from "../../../node_modules/three/examples/jsm/controls/OrbitControls"
import { DRACOLoader } from '../../../node_modules/three/examples/jsm/loaders/DRACOLoader.js'

export default {
  props: ['width', 'height'],
  setup (props) {
    var Dombool = ref(true) //加载布尔值
    var domThree = ref(null) //获取渲染区域dom
    var cardDom = ref() //获取卡片dom
    var speedVal = ref(0.005) //动画速度
    const sceneThree = new THREE.Scene()
    const geomtry = new THREE.BoxGeometry(10, 10, 10)
    const materila = new THREE.MeshBasicMaterial({ color: 0x00ffff })
    const meshThree = new THREE.Mesh(geomtry, materila)
    // sceneThree.add(meshThree)

    // 创建相机
    var cameraThree = new THREE.PerspectiveCamera(1, props.width / props.height, 1, 100000)
    cameraThree.position.set(120, 10, 10) //设置相机的位置
    cameraThree.lookAt(0, 0, 0)
    // end

    // 创建渲染器
    const rendererThree = new THREE.WebGLRenderer({
      antialias: true
    })
    rendererThree.setPixelRatio(window.devicePixelRatio)
    rendererThree.setSize(props.width, props.height)
    rendererThree.outputEncoding = THREE.sRGBEncoding
    rendererThree.render(sceneThree, cameraThree)
    rendererThree.setClearColor(0xffffff)//设置整个的背景色
    // end创建渲染器

    // 添加轨道  (相机对象，渲染对象)
    const controlsThree = new OrbitControls(cameraThree, rendererThree.domElement)
    controlsThree.target.set(0, 1, 0) //指向的中心点
    controlsThree.update(0)


    // 获取女人
    var mixer = new THREE.AnimationMixer(sceneThree)
    const loader = new GLTFLoader() //创建加载器
    var dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('/draco/')
    loader.setDRACOLoader(dracoLoader)
    loader.load('/woman-processed.glb', function (fltfMesh) {
      sceneThree.add(fltfMesh.scene)
      Dombool.value = false //关闭加载
      const clipAction = mixer.clipAction(fltfMesh.animations[0])
      clipAction.play()
    })
    // end

    // 开启灯光
    const light = new THREE.AmbientLight({ color: 0xffffff })
    sceneThree.add(light)
    // end


    // 开启辅助线
    const axeshelperTwo = new THREE.AxesHelper(0)
    sceneThree.add(axeshelperTwo)
    // end开启辅助线


    // 生命周期
    onMounted(() => {
      domThree.value.appendChild(rendererThree.domElement)//将场景3渲染器添加到页面
      rendererThree.render(sceneThree, cameraThree) //让相机2拍照
    })
    // end生命周期






    // 请求动画帧 
    // 让相机动起来 持续执行一段代码类似计时器但比他更便捷，功能非常简单，理想状态每秒调用60次
    const clock = new THREE.Clock()//获取动画每次render()执行的时间间隔
    function render () {
      const frameT = clock.getDelta()
      mixer.update(speedVal.value)//更新动画播放器相关的时间

      rendererThree.render(sceneThree, cameraThree) //让相机拍照
      controlsThree.update()
      requestAnimationFrame(render) //requestanimationframe就是动画api
    }
    render()
    // end

    var widthCom = computed(() => {
      return props.width
    })

    // 窗口改变的时候
    watch(widthCom, ((newval) => {
      cameraThree.aspect = newval / props.height
      cameraThree.updateProjectionMatrix() //相机参数改变必须执行这个
      rendererThree.setSize(newval, props.height)
      rendererThree.render(sceneThree, cameraThree) //让相机拍照
    }))
    // end


    // 点击后加载走路速度
    function quickFnn () {
      speedVal.value = (speedVal.value * 1000 + (0.001 * 1000)) / 1000
    }

    function retardFnn () {
      speedVal.value = (speedVal.value * 1000 - (0.001 * 1000)) / 1000
    }

    function leftFnn () {
      let num = 0
      var time = setInterval(() => {
        num += 0.01
        if (num < 1.5) {
          sceneThree.rotateY(0.01)
          rendererThree.render(sceneThree, cameraThree) //让相机拍照
          controlsThree.update()
        } else if (num >= 1.5) {
          clearInterval(time)
          num = 0
        }
      }, 1)
    }
    function rightFnn () {
      let num = 0

      var time = setInterval(() => {
        num += 0.01
        if (num < 1.5) {
          sceneThree.rotateY(-0.01)
          rendererThree.render(sceneThree, cameraThree) //让相机拍照
          controlsThree.update()
        } else if (num >= 1.5) {
          clearInterval(time)
          num = 0
        }
      }, 1)
    }
    return { domThree, Dombool, cardDom, quickFnn, retardFnn, leftFnn, rightFnn }
  }
}
</script>
<style></style>