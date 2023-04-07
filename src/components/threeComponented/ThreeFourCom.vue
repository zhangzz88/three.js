<template>
  <el-row style="margin-bottom: 10px; position: relative">
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
import { Mesh } from 'three'

export default {
  props: ['width', 'height'],
  setup (props) {
    var Dombool = ref(true)
    var domThree = ref(null)
    var cardDom = ref()

    // 创建基础场景
    const sceneThree = new THREE.Scene()//初始化场景
    sceneThree.background = new THREE.Color(0x1A1A1A) //设置背景
    sceneThree.fog = new THREE.Fog(0x1A1A1A, 1, 1000) //加个蒙版

    // 创建圆环
    const TorusGeometry = new THREE.TorusGeometry(3.5, 0.5, 2, 120)
    const TorusMaterial = new THREE.MeshLambertMaterial({
      color: 0x40a9ff,
      wireframe: true //开启线形显示
    })
    const ring = new THREE.Mesh(TorusGeometry, TorusMaterial)
    ring.rotateX(Math.PI / 1.9)
    ring.position.set(0, 1, 0)
    sceneThree.add(ring)
    // end

    // 创建卫星模型
    const IcoGeometry = new THREE.IcosahedronGeometry(0.4, 0)
    const IcoMaterial = new THREE.MeshToonMaterial({ color: 0xfffc00 })
    const satellite = new THREE.Mesh(IcoGeometry, IcoMaterial)
    satellite.position.set(5, 2, -4)
    sceneThree.add(satellite)
    // end

    // 创建组 存放所有星星除了按个单个的卫星
    const stars = new THREE.Group()
    for (let i = 0; i < 800; i++) {
      const geometry = new THREE.IcosahedronGeometry(Math.random() * 2, 0) //随机大小的卫星
      const materialdom = new THREE.MeshToonMaterial({ color: 0xfffc00 }) //卫星材质使用卡通
      const mesh = new THREE.Mesh(geometry, materialdom) //创建卫星模型
      // 随机位置
      mesh.position.x = (Math.random() - 0.5) * 700
      mesh.position.y = (Math.random() - 0.5) * 700
      mesh.position.z = (Math.random() - 0.5) * 700
      // 随机角度
      mesh.rotation.x = Math.random() * 2 * Math.PI
      mesh.rotation.y = Math.random() * 2 * Math.PI
      mesh.rotation.z = Math.random() * 2 * Math.PI

      stars.add(mesh)
    }
    sceneThree.add(stars)
    // end


    // 创建相机
    var cameraThree = new THREE.PerspectiveCamera(3, props.width / props.height, 1, 100000)
    cameraThree.position.set(120, 12, 10) //设置相机的位置
    cameraThree.lookAt(0, 0, 0)
    // end

    // 开启辅助线
    // const axeshelperThree = new THREE.AxesHelper(10)
    // sceneThree.add(axeshelperThree)
    // end开启辅助线

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
    controlsThree.enableDamping = true
    controlsThree.update(0)
    // end


    // 获取鸭子
    var mixer = new THREE.AnimationMixer(sceneThree)
    const loader = new GLTFLoader() //创建加载器
    var dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('/draco/')
    loader.setDRACOLoader(dracoLoader)
    loader.load('/Duck.glb', function (fltfMesh) {
      sceneThree.add(fltfMesh.scene) //添加到场景中
      Dombool.value = false //关闭加载
    })
    // end

    // 开启灯光
    const rotateOnAxislight = new THREE.AmbientLight({ color: 0xffffff })
    sceneThree.add(rotateOnAxislight)
    // end


    // 开启辅助线
    // const axeshelperTwo = new THREE.AxesHelper(0)
    // sceneThree.add(axeshelperTwo)
    // end开启辅助线


    // 生命周期
    onMounted(() => {
      domThree.value.appendChild(rendererThree.domElement)//将场景3渲染器添加到页面
      rendererThree.render(sceneThree, cameraThree) //让相机2拍照
    })
    // end生命周期


    // 创建基础动画
    sceneThree.name = 'box'
    var times = [0, 3]
    var values = [0, 0.1]
    var poskF = new THREE.KeyframeTrack('box.rotation', times, values)
    var clip = new THREE.AnimationClip('test', 6, [poskF])
    var mixers = new THREE.AnimationMixer(sceneThree)
    var clipActions = mixers.clipAction(clip)
    // end


    // 请求动画帧 
    // 让相机动起来 持续执行一段代码类似计时器但比他更便捷，功能非常简单，理想状态每秒调用60次
    let rot = 0
    const axis = new THREE.Vector3(0, 0, 1)
    function render () {
      mixers.update(0.01)
      rendererThree.render(sceneThree, cameraThree) //让相机拍照
      rot += Math.random() * 0.8
      const radian = (rot * Math.PI) / 180
      // 星球位置动画
      sceneThree.children[4] && (sceneThree.children[4].rotation.y += .005)
      // 星球轨道环位置动画
      ring && ring.rotateOnAxis(axis, Math.PI / 400) //绕着坐标axis旋转
      // 卫星位置动画
      satellite.position.x = 250 * Math.sin(radian)
      satellite.position.y = 100 * Math.cos(radian)
      satellite.position.z = -100 * Math.cos(radian)
      satellite.rotation.x += 0.005
      satellite.rotation.y += 0.005
      satellite.rotation.z -= 0.005
      // 星星动画
      stars.rotation.y += 0.0009
      stars.rotation.z -= 0.0003
      // 更新控制器
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


    // 点击按钮
    function click () {
      clipActions.play()
      // sceneThree.rotation.set(1, 0, 0)
    }
    return { domThree, Dombool, cardDom, click }
  }
}
</script>
<style></style>