<template>
  <el-row style="margin-bottom: 10px; position: relative">
    <el-button style="position: absolute" @click="click">开门</el-button>
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
import { OrbitControls } from "../../../node_modules/three/examples/jsm/controls/OrbitControls"
// import { TextureLoader } from '../../../node_modules/three/examples/jsm/controls/TextureLoader'
export default {
  props: ['width', 'height'],
  setup (props) {
    var Dombool = ref(false) //加载布尔值
    var domThree = ref(null) //获取渲染区域dom
    var cardDom = ref() //获取卡片dom
    var speedVal = ref(0.005) //动画速度
    const sceneThree = new THREE.Scene()


    // 贴图准备
    const texLoader = new THREE.TextureLoader()
    const textData = texLoader.load('/assets/qiang.jpg')
    const textMenData = texLoader.load('/assets/men.jpg')
    textData.wrapS = THREE.RepeatWrapping
    textData.wrapT = THREE.RepeatWrapping
    textData.repeat.set(2, 2)
    // end

    // 创建墙
    const geometryBig = new THREE.BoxGeometry(12, 0.5, 6)
    const materialBig = new THREE.MeshBasicMaterial({
      map: textData
    })
    const cubeBig = new THREE.Mesh(geometryBig, materialBig)
    cubeBig.rotateX(Math.PI / 2)
    cubeBig.position.set(5.9, 0, 0)
    sceneThree.add(cubeBig)
    // end


    // 创建两侧的墙
    const geometryBigtwo = new THREE.BoxGeometry(12, 0.5, 6)
    const materialBigtwo = new THREE.MeshBasicMaterial({
      map: textData,
    })
    const cubeBigtwo = new THREE.Mesh(geometryBigtwo, materialBigtwo)
    const cubeBigthree = new THREE.Mesh(geometryBigtwo, materialBigtwo)

    cubeBigthree.rotateY(Math.PI / 2)
    cubeBigthree.rotateX(Math.PI / 2)
    cubeBigthree.position.set(-16, 0, -6)
    cubeBigtwo.rotateY(Math.PI / 2)
    cubeBigtwo.rotateX(Math.PI / 2)
    cubeBigtwo.position.set(12, 0, -6)
    sceneThree.add(cubeBigtwo)
    sceneThree.add(cubeBigthree)

    // 创建墙
    const geometryBigRight = new THREE.BoxGeometry(12, 0.5, 6)
    const materialBigRight = new THREE.MeshBasicMaterial({
      map: textData,
    })
    const cubeBigRight = new THREE.Mesh(geometryBigRight, materialBigRight)
    cubeBigRight.rotateX(Math.PI / 2)
    cubeBigRight.position.set(-10.1, 0, 0)
    // cubeBig.material.depthTest = false
    // cubeBig.rotateY(Math.PI / 2)
    sceneThree.add(cubeBigRight)
    // end


    // 创建尾部的墙
    const geometryBigbuttom = new THREE.BoxGeometry(28, 0.5, 6)
    const materialBigbuttom = new THREE.MeshBasicMaterial({
      map: textData,
    })
    const cubeBigbuttom = new THREE.Mesh(geometryBigbuttom, materialBigbuttom)
    cubeBigbuttom.rotateX(Math.PI / 2)
    cubeBigbuttom.position.set(-2, 0, -12)
    sceneThree.add(cubeBigbuttom)



    // 创建地面
    const geometryBigDOWN = new THREE.BoxGeometry(33, 0.5, 50)
    const materialBigDOWN = new THREE.MeshBasicMaterial({
      map: textMenData,
    })
    const cubeBigDOWN = new THREE.Mesh(geometryBigDOWN, materialBigDOWN)
    // cubeBigDOWN.rotateX(Math.PI / 2)
    cubeBigDOWN.position.set(-2, -3, -2)
    sceneThree.add(cubeBigDOWN)


    // 创建房顶
    // const geometryBiup = new THREE.BoxGeometry(17, 0.5, 20)
    // const materialBigup = new THREE.MeshBasicMaterial({
    //   map: textMenData,
    // })
    // const cubeBigup = new THREE.Mesh(geometryBiup, materialBigup)
    // cubeBigup.rotateZ(10 * Math.PI / 180)
    // cubeBigup.position.set(-10, 4, -7)
    // sceneThree.add(cubeBigup)


    // const geometryjiao = new THREE.PlaneGeometry(10, 10)
    // const materialjiao = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide })
    // const plane = new THREE.Mesh(geometryjiao, materialjiao)
    // sceneThree.add(plane)

    // 创建几何体cube
    const geometry = new THREE.BoxGeometry(4, 0.5, 6)
    const material = new THREE.MeshLambertMaterial({ map: textMenData })
    const cube = new THREE.Mesh(geometry, material)
    cube.rotateX(Math.PI / 2)
    cube.position.set(-2.1, 0, -0)


    // 创建group
    const cudeeGroup = new THREE.Group()
    cudeeGroup.position.set(0, 0, 0)
    cudeeGroup.add(cube)
    sceneThree.add(cudeeGroup)
    // end





    // 创建相机
    var cameraThree = new THREE.PerspectiveCamera(3, props.width / props.height, 1, 100000)
    cameraThree.position.set(2, 10, 280) //设置相机的位置
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




    // 开启灯光
    const light = new THREE.PointLight({ color: 0xffffff })
    light.position.set(10, 10, 10)
    sceneThree.add(light)
    // end


    // 开启辅助线
    // const axeshelperTwo = new THREE.AxesHelper(100)
    // sceneThree.add(axeshelperTwo)

    // const test = new THREE.AxesHelper(5)
    // cube.add(test)
    // end开启辅助线


    // 生命周期
    onMounted(() => {
      domThree.value.appendChild(rendererThree.domElement)//将场景3渲染器添加到页面
      rendererThree.render(sceneThree, cameraThree) //让相机2拍照
    })
    // end生命周期


    let menBool = false //默认门是关的
    var mixer, mixeroff

    // 点击开门
    function click () {
      if (menBool) {
        //  关门
        mixer = null
        cudeeGroup.name = 'box'
        const timesoff = [0, 1]
        const valuesoff = [cudeeGroup.rotation.y, 0]
        const poskoff = new THREE.KeyframeTrack('box.rotation[y]', timesoff, valuesoff)
        const clipoff = new THREE.AnimationClip('test', 1, [poskoff])
        mixeroff = new THREE.AnimationMixer(cudeeGroup)
        const clipActionoff = mixeroff.clipAction(clipoff)
        clipActionoff.loop = THREE.LoopOnce
        clipActionoff.clampWhenFinished = true
        clipActionoff.play()
      } else {
        // 开门
        mixeroff = null
        cudeeGroup.name = 'box'
        const times = [0, 1]
        const values = [0, Math.PI / 2]
        const posk = new THREE.KeyframeTrack('box.rotation[y]', times, values)
        const clip = new THREE.AnimationClip('test', 1, [posk])
        mixer = new THREE.AnimationMixer(cudeeGroup)
        const clipAction = mixer.clipAction(clip)
        clipAction.loop = THREE.LoopOnce
        clipAction.clampWhenFinished = true
        clipAction.play()
      }
      menBool = !menBool
    }

    // 请求动画帧 
    // 让相机动起来 持续执行一段代码类似计时器但比他更便捷，功能非常简单，理想状态每秒调用60次
    const clock = new THREE.Clock()//获取动画每次render()执行的时间间隔
    function render () {

      mixer && mixer.update(clock.getDelta())
      mixeroff && mixeroff.update(clock.getDelta())
      rendererThree.render(sceneThree, cameraThree) //让相机拍照
      cameraThree.updateProjectionMatrix() //相机参数改变必须执行这个
      controlsThree.update(0)
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

    return { domThree, Dombool, cardDom, click }
  }
}
</script>
<style></style>