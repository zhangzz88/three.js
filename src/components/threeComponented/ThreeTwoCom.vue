<template>
  <el-row style="margin-bottom: 10px">
    <el-col :span="24">
      <el-card>
        <div
          v-loading="Dombool"
          element-loading-background="white"
          ref="domTwo"
          class="threeDom"
        ></div>
      </el-card>
    </el-col>
  </el-row>
</template>
<script>
import { computed, nextTick, onMounted, reactive, ref, watch } from "vue"
import * as THREE from "three"
import { OrbitControls } from "../../../node_modules/three/examples/jsm/controls/OrbitControls"
import { GLTFLoader } from '../../../node_modules/three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from '../../../node_modules/three/examples/jsm/loaders/DRACOLoader.js'
import nx from '../../assets/nx.png'
import ny from '../../assets/ny.png'
import nz from '../../assets/nz.png'
import px from '../../assets/px.png'
import py from '../../assets/py.png'
import pz from '../../assets/pz.png'
export default {
  props: ['width', 'height'],
  setup (props) {
    // var width = window.innerWidth > 700 ? window.innerWidth - 212 : window.innerWidth - 57
    // var height = 300
    // 创建场景2-----------------------------------------------------------
    var domTwo = ref(null) //获取canvasdom
    var Dombool = ref(true)
    var sceneTwo = new THREE.Scene() //创建场景2

    // 创建纹理加载器
    var textureLoaderTwo = new THREE.CubeTextureLoader()
    var envMapTextureTwo = textureLoaderTwo.load([px, nx, py, ny, pz, nz],)
    // end


    // 创建相机
    var cameraTwo = new THREE.PerspectiveCamera(6, props.width / props.height, 1, 100000)
    cameraTwo.position.set(90, 30, 50) //设置相机的位置
    cameraTwo.lookAt(0, 0, 0)
    // end

    // 引入gltf模型
    const loader = new GLTFLoader() //创建加载器
    var dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('/draco/')
    loader.setDRACOLoader(dracoLoader)
    loader.load('/rocket_turret_-_free-processed.glb', function (fltfMesh) {
      Dombool.value = false //判断是否加载完毕
      fltfMesh.scene.traverse(item => {
        if (item.name == 'Object_21') { //找到不生效的那个模型
          item.material.envMap = envMapTextureTwo //给这个模型赋值
          item.material.envMapIntensity = 1.0 ////环境贴图对Mesh表面影响程度
        }
      })
      sceneTwo.add(fltfMesh.scene)
    })
    // end引入gltf模型

    // // 开启辅助线
    // const axeshelperTwo = new THREE.AxesHelper(10)
    // sceneTwo.add(axeshelperTwo)
    // // end开启辅助线

    // 设置灯源
    const light = new THREE.PointLight(0xffffff)
    light.position.set(30, 0, 0)
    sceneTwo.add(light)
    const lightTwo = new THREE.PointLight(0xffffff)
    lightTwo.position.set(0, 0, 30)
    sceneTwo.add(lightTwo)
    // end设置灯源

    // 可视化光源
    const pointLightHelper = new THREE.PointLightHelper(light)
    sceneTwo.add(pointLightHelper)
    // end

    // 创建渲染器
    const rendererTwo = new THREE.WebGLRenderer({
      antialias: true
    })
    rendererTwo.setPixelRatio(window.devicePixelRatio)
    rendererTwo.setSize(props.width, props.height)
    rendererTwo.outputEncoding = THREE.sRGBEncoding
    rendererTwo.render(sceneTwo, cameraTwo)
    rendererTwo.setClearColor(0xffffff)//设置整个的背景色
    // end创建渲染器


    // 添加轨道  (相机对象，渲染对象)
    const controlsTwo = new OrbitControls(cameraTwo, rendererTwo.domElement)
    controlsTwo.target.set(0, 0, 0) //指向的中心点
    controlsTwo.update(0)
    // end添加轨道

    // 生命周期
    onMounted(async () => {
      domTwo.value.appendChild(rendererTwo.domElement)//将场景2渲染器添加到页面
    })


    // 请求动画帧 
    // 让相机动起来 持续执行一段代码类似计时器但比他更便捷，功能非常简单，理想状态每秒调用60次
    const clock = new THREE.Clock()//获取动画每次render()执行的时间间隔
    function render () {
      // 旋转模型2
      sceneTwo.rotateY(0.01)
      rendererTwo.render(sceneTwo, cameraTwo) //让相机2拍照
      requestAnimationFrame(render) //requestanimationframe就是动画api
    }
    render()
    // end

    var widthCom = computed(() => {
      return props.width
    })

    // 窗口改变的时候
    watch(widthCom, ((newval) => {
      cameraTwo.aspect = newval / props.height
      cameraTwo.updateProjectionMatrix() //相机参数改变必须执行这个
      rendererTwo.setSize(newval, props.height)
      rendererTwo.render(sceneTwo, cameraTwo) //让相机拍照
    }))
    // end


    // end 创建场景2------------------------------------------------------------
    return { domTwo, Dombool }
  }
}
</script>
<style></style>