<template>
  <el-row style="margin-bottom: 10px">
    <el-col :span="24" class="threeDom">
      <el-card>
        <div
          v-loading="Dombool"
          element-loading-background="white"
          ref="domTwo"
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

import { TWEEN } from '../../../node_modules/three/examples/jsm/libs/tween.module.min.js'
export default {
  props: ['width', 'height'],
  setup (props) {

    var domTwo = ref(null) //渲染区域dom
    var Dombool = ref(true) //加载布尔值
    var mouse = new THREE.Vector2() //鼠标二维坐标
    var isUserInteracting = false //标识用户是否开始点击了
    var onPointerDownPointerX = 0
    var onPointerDownPointerY = 0
    var lon = 0
    var lat = 0
    var phi = 0
    var theta = 0
    var onPointerDownLon = 0
    var onPointerDownLat = 0
    var camera_time = 0 //相机移动参数
    var moveBool = 0
    var cameraBool = ref(false) //以此来判断是否是初次进入

    //  1.场景
    const scene = new THREE.Scene()


    //  2.球体
    const geometry = new THREE.SphereGeometry(500, 300, 300)
    geometry.scale(1, 1, -1)



    // 添加室外低画质贴图
    const outside_low = new THREE.MeshBasicMaterial({
      // side: THREE.DoubleSide, //使物体可以查看背部
      map: new THREE.TextureLoader().load('/assets/outside_low.jpg', () => { Dombool.value = false })
    })
    // 添加室内低画质贴图
    const inside_low = new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load('/assets/inside_low.jpg')
    })
    var sphere = new THREE.Mesh(geometry, outside_low) //创建模型


    // 将物体添加到场景
    scene.add(sphere)





    // 3.设置小圆交互点
    var interactPoints = [
      { name: 'point_0_outside_house', scale: 2, x: 0, y: 1.5, z: 24 },
      // { name: 'point_1_outside_car', scale: 3, x: 40, y: 1, z: -20 },
      // { name: 'point_2_outside_people', scale: 3, x: -20, y: 1, z: -30 },
      // { name: 'point_3_inside_eating_room', scale: 2, x: -30, y: 1, z: 20 },
      // { name: 'point_4_inside_bed_room', scale: 3, x: 48, y: 0, z: -20 }
    ]
    var interactMeshes = []
    let pointMaterial = new THREE.SpriteMaterial({
      map: new THREE.TextureLoader().load('/assets/point.png') //精灵对象的材质
    })
    interactPoints.forEach(item => {
      let point = new THREE.Sprite(pointMaterial) //创建精灵对象
      point.name = item.name
      point.scale.set(item.scale * 1.2, item.scale * 1.2, item.scale * 1.2) //缩放大小
      point.position.set(item.x, item.y, item.z)
      scene.add(point) //添加到场景中
      interactMeshes.push(point)
    })
    // end




    // 4.设置大的黄色交互点
    var anchorGroup //gorup组
    var anchor
    const loader = new GLTFLoader()
    anchorGroup = new THREE.Group()
    var dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('/draco/')
    loader.setDRACOLoader(dracoLoader)
    loader.load('/anchor.gltf', val => {

      // 遍历模型，修改颜色
      val.scene.traverse(child => {
        if (child.isMesh) {
          child.material.metalness = 0.4 //调整材质和金属的相似度
          child.name.includes('黄') && (child.material.color = new THREE.Color(0xfffc00))
        }
      })
      val.scene.rotation.y = Math.PI / 2 //旋转90度

      anchorGroup.name = 'anchorGroup'
      interactPoints.forEach(item => {
        anchor = val.scene.clone() //复制
        anchor.position.set(item.x, item.y + 3, item.z) //位置
        anchor.name = item.name //姓名
        anchor.scale.set(item.scale * 3, item.scale * 3, item.scale * 3) //设置大小
        anchorGroup.add(anchor)
        // anchor.children[0].visible = false
      })
      scene.add(anchorGroup)

    })
    // end




    // 5.设置加载文字提示交互点
    function makTextSprite (message, parameters) {
      if (parameters === undefined) parameters = {}
      // 判断传入的parameters对象是否有这些属性
      var fontface = parameters.hasOwnProperty.call("fontface") ? parameters["fontface"] : "Arial"
      var fontsize = parameters.hasOwnProperty.call("fontsize") ? parameters["fontsize"] : 32
      var borderThickness = parameters.hasOwnProperty.call("borderThickness") ? parameters["borderThickness"] : 4
      var borderColor = parameters.hasOwnProperty.call("borderColor") ? parameters["borderColor"] : { r: 0, g: 0, b: 0, a: 1.0 }

      // 创建canvas
      var canvas = document.createElement('canvas')//创建canvas对象
      var context = canvas.getContext('2d') //设置canvas类型
      context.font = fontsize + 'px ' + fontface //设置字号和字体
      var textWidth = context.measureText(message).width //获取字体宽度设置字体宽度
      // 设置字体渐变
      context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + "," + borderColor.b + "," + borderColor.a + ")"
      context.lineWidth = borderThickness //文字行高
      context.fillStyle = "#ffffff" //字体颜色
      context.fillText(message, borderThickness, fontsize + borderThickness)//触发渲染文字
      context.font = 48 + "px" + fontface
      var texture = new THREE.Texture(canvas) //创建纹理
      texture.needsUpdate = true //needsUpdate设为true它会实时的检测贴图是否更新，并更新贴图。
      var spriteMaterial = new THREE.SpriteMaterial({ map: texture }) //创建精灵对象的材质
      var sprite = new THREE.Sprite(spriteMaterial) //创建精灵对象
      sprite.name = 'canvas'
      return sprite //返回一个精灵对象

    }
    const outsideTextTip = makTextSprite('进入室内查找')
    outsideTextTip.scale.set(9.2, 9.2, 9) //设置精灵贴图大小
    // outsideTextTip.position.set(10, 10, 10)
    outsideTextTip.position.set(0, -4, 24) //设置位置
    scene.add(outsideTextTip) //添加文字提示精灵对象
    // end




    // 6.鼠标滑动
    const raycaster = new THREE.Raycaster()
    var pointer = new THREE.Vector2()
    function onDocumentMouseMove (event) {
      pointer.x = (event.offsetX / props.width) * 2 - 1
      pointer.y = -(event.offsetY / props.height) * 2 + 1
    }



    // 场景的切换
    function update () {
      // 如果camera_time大于0说明已经点击开门了
      if (camera_time > 0 && camera_time < 50) {
        let test = new THREE.Vector3(0, 1, 24)
        camera.lookAt(test) //冲向门的位置将相机
        camera.fov -= 1
        camera.updateProjectionMatrix()
        camera_time++

      } else if (camera_time == 50) {
        loadMarker() //消除室外所有交互点
        camera_time = 0
        camera.fov = 75
        sphere.material = inside_low       //切换模型的背景贴图
      }
    }

    // 消除室外所有交互点
    function loadMarker () {
      scene.traverse(item => {
        // 效果室外所有交互点
        let name = item.name
        if (name == '定位_1' || name == 'canvas' || name == '黄底' || name == 'point_0_outside_house' || name == 'point_1_outside_car' || name == 'point_2_outside_people' || name == 'point_3_inside_eating_room' || name == 'point_4_inside_bed_room') {
          item.visible = false
        }
      })
      // 溢出
    }
    // end






    // 3.相机  fov小的话视口就放大，fov大的话物体视觉就缩小
    const camera = new THREE.PerspectiveCamera(75, props.width / props.height, 1, 10000)
    camera.position.set(1000, 0, 1000)
    // camera.lookAt(0, 0, 0)
    // const helper = new THREE.CameraHelper(camera)
    // scene.add(helper)


    // 4.渲染
    const createRender = new THREE.WebGL1Renderer()
    createRender.setSize(props.width, props.height)
    createRender.render(scene, camera)

    // 5.轨道控制器
    const controls = new OrbitControls(camera, createRender.domElement)
    // controls.target.set(10, 0, 0)
    // 6.辅助线
    // const Helper = new THREE.AxesHelper(200)
    // scene.add(Helper)


    // 7.灯光
    // 添加环境光
    const light = new THREE.HemisphereLight(0xffffff)
    light.position.set(0, 40, 0)
    scene.add(light)
    // 添加平行光
    const lightTwo = new THREE.DirectionalLight(0xffffff)
    lightTwo.position.set(0, 40, -10)
    scene.add(lightTwo)
    // const pointLightHepler = new THREE.PointLightHelper(light)
    // scene.add(pointLightHepler)
    // end


    // 点击进入房间事件
    function onDocumentMouseDown (event) {
      raycaster.setFromCamera(pointer, camera) // 通过摄像机和鼠标位置更新射线
      var intersects = raycaster.intersectObjects([...interactMeshes, ...anchorGroup.children])// 计算物体和射线的焦点
      console.log('测试', anchorGroup)


      
      // 如果点10的是门就跳转
      intersects.forEach(item => {
        if (item.object.name == 'point_0_outside_house') {
          camera_time = 1
        }

      })

      isUserInteracting = true // 用户已经开始操作了
      onPointerDownPointerX = event.offsetX //用户点击的位置
      onPointerDownPointerY = event.offsetY //
      // onPointerDownLon = lon
      // onPointerDownLat = lat
    }




    // 生命周期
    onMounted(async () => {
      domTwo.value.addEventListener('mousedown', onDocumentMouseDown, false) //鼠标放到页面后执行

      domTwo.value.addEventListener('mousemove', onDocumentMouseMove, false)
      // domTwo.value.addEventListener('mouseup', function () {
      //   isUserInteracting = false
      // })
      domTwo.value.appendChild(createRender.domElement)//将场景2渲染器添加到页面




      // 先将所有交互点隐藏
      scene.children.forEach(item => {
        anchorGroup.visible = false
        if (item.name == 'canvas' || item.name == 'point_0_outside_house') {
          item.visible = false
        }
      })
      // end


      const tween = new TWEEN.Tween({
        x1: camera.position.x, // 相机x
        y1: camera.position.y, // 相机y
        z1: camera.position.z, // 相机z
      })
      tween.to(
        {
          x1: 1,
          y1: 0,
          z1: 0,
        },
        2000,
      )
      tween.onUpdate(function (object) {
        camera.position.x = object.x1
        camera.position.y = object.y1
        camera.position.z = object.z1
      })
      tween.onComplete(function () {
        console.log('执行完了', camera)
        // 显示所有交互点
        scene.children.forEach(item => {
          anchorGroup.visible = true
          if (item.name == 'canvas' || item.name == 'point_0_outside_house') {
            item.visible = true
          }
        })
        // end
        // camera.lookAt(1, 1.5, 24)
        // controls.update()
        // createRender.render(scene, camera)
        // camera.updateProjectionMatrix()

      })
      tween.easing(TWEEN.Easing.Cubic.InOut)
      setTimeout(() => {
        tween.start()
      }, 1000)

    })


    // 请求动画帧 
    function render () {



      // if (camera.position.x >= 10) {
      TWEEN && TWEEN.update()
      // }

      update()
      camera.updateProjectionMatrix()
      createRender.render(scene, camera) //让相机2拍照
      requestAnimationFrame(render) //requestanimationframe就是动画api


      // 将问号这个模型旋转
      // scene.traverse(item => {
      //   if (item.name == 'anchorGroup') {
      //     item.children.forEach(item => {
      //       item.rotateY(0.01)
      //     })
      //   }
      // })
      // end
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
      createRender.setSize(newval, props.height)
      createRender.render(scene, camera) //让相机拍照
    }))
    // end


    // end 创建场景2------------------------------------------------------------
    return { domTwo, Dombool }
  }
}
</script>
<style>
.threeDom :hover {
  cursor: pointer;
}
</style>