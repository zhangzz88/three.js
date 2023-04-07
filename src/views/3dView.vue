<template>
  <el-row style="margin-bottom: 10px">
    <el-col :span="24" class="threeDom">
      <el-card v-loading="Dombool" element-loading-background="white">
        <div ref="caDom" class="threeBox">
          <div ref="domTwo">
            <div class="Btn">
              <el-button
                v-for="(item, index) in roomList"
                :key="index"
                @click="handleSwitchButtonClick(item.key)"
              >
                {{ item.name }}
              </el-button>
            </div>

            <div
              v-show="gaoshBool"
              class="gaoshi"
              :style="{
                position: 'absolute',
                transform:
                  'translateX(' +
                  leftData +
                  'px)' +
                  'translateY(' +
                  rightData +
                  'px)',
              }"
            >
              电视

              <div class="gaoshiChil"></div>
            </div>

            <div
              v-show="SofaBool"
              class="gaoshi"
              :style="{
                position: 'absolute',
                transform:
                  'translateX(' +
                  leftshaofaData +
                  'px)' +
                  'translateY(' +
                  rightshaofaData +
                  'px)',
              }"
            >
              沙发
              <div class="gaoshiChil"></div>
            </div>
          </div>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import { computed, nextTick, onMounted, reactive, ref, registerRuntimeCompiler, watch } from "vue"
import * as THREE from "three"
import { OrbitControls } from "../../node_modules/three/examples/jsm/controls/OrbitControls"
import { TWEEN } from '../../node_modules/three/examples/jsm/libs/tween.module.min.js'
import Animations from '../utils/animations'
import { rooms } from '../utils/data'
import { Texture } from 'three'
import { useStore } from 'vuex'
import { update } from 'js-md5'
import WebGL from '../utils/webglTest'
export default {
  setup () {

    // 解决ios贴图问题
    //修复部分纹理随机黑色问题
    window.createImageBitmap = undefined

    var domTwo = ref(null)
    var Dombool = ref(true)//加载布尔值
    var caDom = ref(null) //carddom元素
    // 渲染区域的长度高度
    var width = ref(0)
    var height = ref(0)
    // 电视卡片的位置
    var leftData = ref(0)
    var rightData = ref(0)
    // 沙发卡片的位置
    var leftshaofaData = ref(0)
    let rightshaofaData = ref(0)
    // 电视卡片的显示
    var gaoshBool = ref(true)
    // 沙发卡片的显示
    var SofaBool = ref(true)
    // 1.是客厅  2.  3.
    var environment = ref(2)
    const data = reactive({
      renderer: null,
      camera: null,
      scene: null,
      controls: null,
      cameraZAxis: 2, //相机的z轴
      currentRoom: 'living-room',
    })


    // 实时获取三个场景的数据
    var roomList = computed(() => {
      return rooms
    })

    // 进入页面如果是客厅的话就显示两个卡片
    if (environment.value != 2) {
      gaoshBool.value = false
      SofaBool.value = false
    }

    // 1.场景
    const scene = new THREE.Scene()



    // 2.圆形物体
    // 纹理加载器
    const textLoader = new THREE.TextureLoader()
    // 遍历球体
    const createRoom = (name, position, map) => {
      // 创建球体
      const geometry = new THREE.SphereGeometry(16, 155, 155)
      // 翻转球体
      geometry.scale(1, 1, -1)
      // 加载纹理
      const material = new THREE.MeshBasicMaterial({
        map: textLoader.load(map, function () { Dombool.value = false }),
        side: THREE.DoubleSide,
      })
      //创建模型
      const sphere = new THREE.Mesh(geometry, material)
      sphere.name = name
      sphere.position.set(position.x, position.y, position.z)
      sphere.rotation.y = Math.PI / 2
      scene.add(sphere)
      return sphere //返回每个模型
    }

    //循环创建三个全景球形球形 （数量少的话可以一个一个去创建，多的话可以循环创建）
    // 设置恰当的距离，实现并排的效果
    roomList.value.map(item => {
      const room = createRoom(item.key, item.position, item.map)
      return room
    })







    // 3.灯光
    const light = new THREE.PointLight(0xff0000)
    light.position.set(10, 35, 10)
    scene.add(light)
    const pointLightHelper = new THREE.PointLightHelper(light)
    scene.add(pointLightHelper)

    // 4.相机
    var camera = new THREE.PerspectiveCamera(75, width.value / height.value, 1, 10000)
    camera.position.set(0, 1, 0)
    camera.lookAt(0, 0, 0)




    // 5.渲染器
    const renderer = new THREE.WebGL1Renderer()
    renderer.setSize(width.value, height.value)
    renderer.render(scene, camera)


    // 6.辅助线
    // const helper = new THREE.AxesHelper(10)
    // scene.add(helper)










    // 7.轨道控制
    var controls = new OrbitControls(camera, renderer.domElement)
    // 转动惯性
    controls.enableDamping = true
    // 禁止平移
    controls.enablePan = false
    // 缩放限制
    // controls.maxDistance = 12
    // 自动旋转
    // controls.autoRotate = true
    // 旋转的速度
    // controls.autoRotateSpeed = 1
    // 垂直旋转限制
    controls.minPolarAngle = Math.PI / 2
    controls.maxPolarAngle = Math.PI / 2



    // 8.动画帧
    function render () {
      // console.log(width.value)
      // camera = new THREE.PerspectiveCamera(75, width.value / height.value, 1, 10000)
      //轨道控制器刷新
      controls.update()
      // tween刷新
      TWEEN && TWEEN.update()
      // 相机刷新
      camera.updateProjectionMatrix()
      // 渲染器刷新
      renderer.render(scene, camera)//重新渲染
      requestAnimationFrame(render)



      // 漂浮的小卡片位置的跟踪设定




      // 电视卡片
      const centerX = width.value / 2
      const centerY = height.value / 2
      var tv = new THREE.Vector3(-9, 0, -9) //电视的三维坐标
      const standardVec = tv.project(camera) //prject将电视三维坐标转换成屏幕坐标系
      const screenX = Math.round(centerX * standardVec.x + centerX)
      const screenY = Math.round(-centerY * standardVec.y + centerY)
      leftData.value = screenX
      rightData.value = screenY

      // 沙发卡片
      var sofacenterX = new THREE.Vector3(3, -2, -8)//沙发的三维坐标
      const standardVecqwe = sofacenterX.project(camera) //prject将沙发三维坐标转换成屏幕坐标系
      const screenXqwe = Math.round(centerX * standardVecqwe.x + centerX)
      const screenYqwe = Math.round(-centerY * standardVecqwe.y + centerY)
      leftshaofaData.value = screenXqwe //实时改动dom元素位置
      rightshaofaData.value = screenYqwe
      // console.log('沙发坐标', screenXqwe, screenYqwe)
      // console.log('电视坐标', screenX, screenY)


    }
    render()



    function viewFnn () {
      // 判断电视文字是否视口内
      let vector = new THREE.Vector3(-9, 0, -9)
      let tempV = vector.applyMatrix4(camera.matrixWorldInverse).applyMatrix4(camera.projectionMatrix)
      if ((Math.abs(tempV.x) > 1) || (Math.abs(tempV.y) > 1) || (Math.abs(tempV.z) > 1)) {
        // 在视野外了
        gaoshBool.value = false
      } else {

        if (environment.value == 2) {
          gaoshBool.value = true
        }
      }

      // 判断电视文字是否视口内
      let SofaDisplay = new THREE.Vector3(3, -2, -8)
      let SofatempV = SofaDisplay.applyMatrix4(camera.matrixWorldInverse).applyMatrix4(camera.projectionMatrix)


      // 判断是否在视线内的核心算法
      if ((Math.abs(SofatempV.x) > 1) || (Math.abs(SofatempV.y) > 1) || (Math.abs(SofatempV.z) > 1)) {
        // 在视野外了
        SofaBool.value = false
      } else {
        if (environment.value == 2) {
          SofaBool.value = true
        }

      }
    }
    // 9.生命周期
    onMounted(() => {

      // 检测是否支持webgl
      if (WebGL.isWebGLAvailable()) {
        // Initiate function or other initializations here
        domTwo.value.appendChild(renderer.domElement)
      } else {
        const warning = WebGL.getWebGLErrorMessage()
        domTwo.value.appendChild(warning)
      }
      // end




      // 监听局部dom更新，注意记笔记
      let fnn = new ResizeObserver(() => {
        if (domTwo.value) {
          width.value = domTwo.value.clientWidth
          camera.aspect = width.value / height.value //窗口改变的时候需要改动相机，注意！需要记笔记
          camera.updateProjectionMatrix()
          renderer.setSize(width.value, height.value)
          renderer.render(scene, camera)//重新渲染
        }
      })
      fnn.observe(domTwo.value)


      // 监听滑动屏幕，判断是否已经出视线了
      var bool = false//判断是否点击了

      // 移动端
      domTwo.value.addEventListener('touchstart', () => { bool = true }, false)
      domTwo.value.addEventListener('Touchend', () => { bool = false }, false)
      domTwo.value.addEventListener('touchmove', onDocumentMouseMove, false)
      // end

      // pc端
      domTwo.value.addEventListener('mousedown', () => { bool = true }, false)
      domTwo.value.addEventListener('mouseup', () => { bool = false }, false)
      domTwo.value.addEventListener('mousemove', onDocumentMouseMove, false)
      // end

      // 控制卡片的额显示隐藏
      function onDocumentMouseMove () {
        // 如果bool是true那就是点击过了
        if (bool) {
          viewFnn()
        }
      }
    })


    // 10.点击切换场景
    //实现方式就是移动相机  修改轨道控制器的中心点实现
    const handleSwitchButtonClick = async (key) => {
      if (key == 'study-room') { environment.value = 1 }
      if (key == 'bed-room') { environment.value = 3 }
      if (key == 'living-room') { environment.value = 2 }
      const room = rooms.filter(item => item.key === key)[0]
      if (camera) {
        const x = room.position.x //新场景的中心位置
        const y = room.position.y
        const z = room.position.z
        // 开启动画 传入相机 轨道控制器  新的相机坐标对象  新的轨道坐标对象 时间 回调函数
        Animations.animateCamera(camera, controls, { x, y, z: data.cameraZAxis }, { x, y, z }, 1600, () => { viewFnn() })
      }
    }



    // 使用vuex中监听的窗口变化
    var store = useStore()
    var threeJsHeight = computed(() => {
      return store.state.threeJsHeight
    })
    var threeJsWidth = computed(() => {
      return store.state.threeJsWidth
    })

    watch(
      [threeJsWidth, threeJsHeight], (newval) => {
        console.log('test', newval)
        // width.value = 100
        height.value = newval[1]
        width.value = newval[0]
        // 相机刷新
        camera.aspect = width.value / height.value
        camera.updateProjectionMatrix()
        renderer.setSize(width.value, height.value)
        renderer.render(scene, camera)//重新渲染
        // renderer.render(scene, camera)
      },
      { immediate: true }, { deep: true }
    )
    return { domTwo, Dombool, caDom, roomList, handleSwitchButtonClick, leftData, rightData, gaoshBool, leftshaofaData, rightshaofaData, SofaBool }
  }
}
</script>
<style scoped>
.threeBox {
  position: relative;
  /* border: 1px red solid; */
  overflow: hidden;
  /* box-shadow: 10px 10px 20px 10px black; */
}
.Btn {
  padding: 0 !important;
  margin: 0;
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  /* border: 1px red solid; */
  display: flex;
  flex-direction: column;
  align-items: center;
  /* border: 1px red solid; */
}
.Btn .el-button {
  margin: 0;
  margin-top: 10px;
  background-color: rgba(255, 255, 255, 0.2);
}
.gaoshi {
  width: 6vw;
  /* height: 4vh; */
  border-radius: 10px;
  background: rgba(250, 250, 250, 0.8);
  text-align: center;
  position: relative;
  font-size: 1vw;
}
.gaoshiChil {
  content: "";
  display: block;
  width: 30px;
  height: 30px;
  /* border: 1px red solid; */
  position: absolute;
  top: 50%;
  transform: translateX(-100%) translateY(-50%);
  display: flex;
  justify-content: center;
  align-items: center;
}
.gaoshiChil::before {
  content: "";
  display: block;
  width: 10px;
  height: 10px;
  background: white;
  border-radius: 50%;
  animation: radius 2s infinite;
  position: absolute;
  z-index: 9;
}
.gaoshiChil::after {
  content: "";
  display: block;
  width: 10px;
  height: 10px;
  background: white;
  border-radius: 50%;
  position: absolute;
  animation: radiuswo 2s infinite -1s;
  z-index: 8;
}

@keyframes radius {
  0% {
    width: 5px;
    height: 5px;
    opacity: 1;
  }
  100% {
    width: 20px;
    height: 20px;
    opacity: 0;
  }
}
@keyframes radiuswo {
  0% {
    width: 5px;
    height: 5px;
    opacity: 1;
  }
  100% {
    width: 20px;
    height: 20px;
    opacity: 0;
  }
}
:deep .el-card__body {
  padding: 0 !important;
}
</style>