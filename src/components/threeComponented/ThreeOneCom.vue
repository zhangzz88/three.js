<template>
  <el-row style="margin-bottom: 10px">
    <el-col :span="24">
      <div ref="cardDom">
        <el-card>
          <div
            v-loading="Dombool"
            element-loading-background="white"
            ref="dom"
          ></div>
        </el-card>
      </div>
    </el-col>
  </el-row>
</template>
<script>
import { computed, onMounted, ref, watch } from "vue"
import * as THREE from "three"
import { OrbitControls } from "../../../node_modules/three/examples/jsm/controls/OrbitControls"
import nx from '../../assets/nx.png'
import ny from '../../assets/ny.png'
import nz from '../../assets/nz.png'
import px from '../../assets/px.png'
import py from '../../assets/py.png'
import pz from '../../assets/pz.png'
export default {
  props: ['width', 'height'],
  setup (props) {
    var Dombool = ref(true) //加载布尔值
    var dom = ref(null) //获取等待被渲染的dom
    var cardDom = ref()
    // 创建虚拟场景
    var scene = new THREE.Scene() //创建一个三维场景
    // end

    // 创建纹理加载器
    var textureLoader = new THREE.CubeTextureLoader() //创建加载器
    var envMapTexture = textureLoader.load([px, nx, py, ny, pz, nz],) //使用加载器的load数据加载数据
    textureLoader.load([px, nx, py, ny, pz, nz], function () {
      Dombool.value = false
    })
    scene.background = envMapTexture //设置背景纹理贴图
    // end

    // 创建几何体
    const sphereGeometry = new THREE.SphereGeometry(40, 50) //球形
    const material = new THREE.MeshStandardMaterial({
      envMap: envMapTexture,//纹理贴图对象texture对象
      metalness: 1,//金属度
      roughness: 0//粗糙度
    })
    const mesh = new THREE.Mesh(sphereGeometry, material)
    mesh.position.set(0, 0, 0)
    scene.add(mesh)
    // end

    // 设置动画 实现上下移动效果
    mesh.name = "Box"// 给需要设置关键帧动画的模型命名
    const times = [0, 3, 6] //时间轴上，设置三个时刻0、3、6秒
    // times中三个不同时间点，物体分别对应values中的三个xyz坐标
    const values = [0, 0, 0, 0, -30, 0, 0, 0, 0]
    // 0~3秒，物体从(0,0,0)逐渐移动到(100,0,0),3~6秒逐渐从(100,0,0)移动到(0,0,100)
    //将数据整合
    const posKF = new THREE.KeyframeTrack('Box.position', times, values)
    //创建关键帧对象，将数据转换成动画能用的
    const clip = new THREE.AnimationClip("test", 6, [posKF])
    //创建一个动画播放器mixer
    const mixer = new THREE.AnimationMixer(mesh)
    // clipAction()方法返回一个AnimationAction对象AnimationAction对象的功能
    // 就是用来控制如何播放关键帧动画，比如是否播放、几倍速播放、是否循环播放、是否暂停播放..
    //使用播放器的方法clipaction，将关键帧加入动画中，返回对象
    const clipAction = mixer.clipAction(clip)
    clipAction.play()
    // end

    // 开启辅助线
    // const axeshelperTwo = new THREE.AxesHelper(100)
    // scene.add(axeshelperTwo)
    // end开启辅助线

    // 设置相机
    var camera = new THREE.PerspectiveCamera(100, props.width / props.height, 1, 100000)
    camera.position.set(90, 90, 90) //设置相机的位置
    camera.lookAt(0, 0, 0)

    // 开启渲染器
    const renderer = new THREE.WebGLRenderer({
      antialias: true
    })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(props.width, props.height)
    renderer.render(scene, camera)
    renderer.outputEncoding = THREE.sRGBEncoding //将three渲染器的编码方式和gltf文件需要相同，不然会有颜色偏差
    // end


    // 添加轨道  (相机对象，渲染对象)
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.target.set(0, 0, 0) //指向的中心点
    controls.update(0)
    // end

    // 生命周期
    onMounted(() => {
      dom.value.appendChild(renderer.domElement)//将场景3渲染器添加到页面
      renderer.render(scene, camera) //让相机2拍照
    })
    // end生命周期

    // 请求动画帧 
    // 让相机动起来 持续执行一段代码类似计时器但比他更便捷，功能非常简单，理想状态每秒调用60次
    const clock = new THREE.Clock()//获取动画每次render()执行的时间间隔
    function render () {
      const frameT = clock.getDelta()//clock.getDelta()方法获得loop()两次执行时间间隔
      mixer.update(frameT)//更新动画播放器相关的时间
      renderer.render(scene, camera) //让相机拍照
      requestAnimationFrame(render) //requestanimationframe就是动画api
    }
    render()
    // end

    var widthCom = computed(() => {
      return props.width
    })

    // 窗口改变的时候
    watch(widthCom, ((newval) => {
      camera.aspect = newval / props.height
      camera.updateProjectionMatrix() //相机参数改变必须执行这个
      renderer.setSize(newval, props.height)
      renderer.render(scene, camera) //让相机拍照
    }))
    // end

    return { dom, Dombool, cardDom }
  }
}
</script>
<style></style>