<template>
  <el-card>
    <div ref="threeBox">
      <!-- <canvas class="webgl"></canvas> -->
    </div>
  </el-card>
</template>


<script setup>
import * as THREE from "three"

import { TransformControls } from "../../node_modules/three/examples/jsm/controls/TransformControls"
import { OrbitControls } from "../../node_modules/three/examples/jsm/controls/OrbitControls"
import { LineMaterial } from '../../node_modules/three/examples/jsm/lines/LineMaterial'
import { LineGeometry } from '../../node_modules/three/examples/jsm/lines/LineGeometry'
import { Line2 } from '../../node_modules/three/examples/jsm/lines/Line2'
import { GUI } from '../../node_modules/three/examples/jsm/libs/lil-gui.module.min'
// import * as dat from 'dat.gui'
import { computed, onMounted, onUnmounted, ref, render, watch } from "vue"
import { Material, PointLight, TextureEncoding } from "three"
import { useStore } from "vuex"


var threeBox = ref(null)
// 渲染尺寸
const sizes = {
  width: 900,
  height: 700
}

// 实例化一个gui对象
// var gui = new GUI()

// 顶点着色器和片元着色器数据
const vertexShader = `
    uniform vec2 uFrequency;
    uniform float uTime;

    varying vec2 vUv;
    varying float vElevation;

    void main() {
      vec4 modelPosition = modelMatrix * vec4(position, 1.0);

      float elevation = sin(modelPosition.x * uFrequency.x - uTime) * 0.1;
      elevation += sin(modelPosition.y * uFrequency.y - uTime) * 0.1;

      modelPosition.z += elevation;

      vec4 viewPosition = viewMatrix * modelPosition;
      vec4 projectedPosition = projectionMatrix * viewPosition;

      gl_Position = projectedPosition;

      vUv = uv;
      vElevation = elevation;
} `
const fragmentShader = `
    uniform vec3 uColor;
    uniform sampler2D uTexture;

    varying vec2 vUv;
    varying float vElevation;

    void main(){
      vec4 textureColor = texture2D(uTexture, vUv);
      textureColor.rgb *= vElevation * 2.0 + 0.65;
      gl_FragColor = textureColor;
    }
    `



//着色器练习 
function createShader () {

  // 获取canvas的dom元素
  const canvas = document.querySelector('.webgl')
  //渲染器
  const renderer = new THREE.WebGLRenderer({ canvas })
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)) //分辨率

  // 场景
  const scene = new THREE.Scene()

  // 相机
  const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, .1, 100)
  camera.position.set(1, 0, 1)
  scene.add(camera)

  // 相机轨道控制器
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true //重力效果

  // 创建形状1
  const geometry = new THREE.PlaneBufferGeometry(1, 1, 32, 32)
  const count = geometry.attributes.position.count
  const randoms = new Float32Array(count)//存放随机位置的顶点


  // 创建形状2
  const geometry_two = new THREE.PlaneBufferGeometry(1, 1, 32, 32)
  const count_two = geometry_two.attributes.position.count //获取所有顶点坐标
  var randoms_two = new Float32Array(count_two)


  // 使用随机数填充数组
  for (let i = 0; i < count_two; i++) {
    randoms[i] = Math.random()  //让几何体随机动的关键
    randoms_two[i] = Math.random()
  }

  // 给着色器发送数据
  // geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1))
  geometry_two.setAttribute('aRandom_two', new THREE.BufferAttribute(randoms_two, 1))


  const textureLoader = new THREE.TextureLoader()
  // 在 Three.js 中可以渲染着色器的材质有两种：RawShaderMaterial 和 ShaderMaterial
  // ShaderMaterial:内置 attributes 和 uniforms
  // RawShaderMaterial 则什么都不会添加

  // 形状1的材质
  const material = new THREE.RawShaderMaterial({
    side: THREE.DoubleSide,//背部可见
    //有的数据会因为顶点变化而变化，这类数据叫attributes
    //有的数据不会因为顶点变化而变化，这类数据叫uniform
    vertexShader: `
    uniform mat4 projectionMatrix;
    uniform mat4 viewMatrix;
    uniform mat4 modelMatrix;
    attribute vec3 position;
    attribute float aRandom;
    uniform vec2  uFrequency;
    uniform float uTime;
    attribute vec2 uv;
    varying vec2 vUv;
    varying float vElevation;

    void main() {
      vUv = uv;
      vec4 modelPosition = modelMatrix * vec4(position, 1.0);
      modelPosition.z += sin(modelPosition.x * uFrequency.x-uTime) * 0.1;
      modelPosition.z += sin(modelPosition.y * uFrequency.y-uTime) * 0.1;      
      vec4 viewPosition = viewMatrix * modelPosition;
      vec4 projectedPosition = projectionMatrix * viewPosition;
      gl_Position = projectedPosition;
      float elevation = sin(modelPosition.x * uFrequency.x - uTime) * 0.1;
      elevation += sin(modelPosition.y * uFrequency.y - uTime) * 0.1;
      modelPosition.z += elevation;
      vElevation = elevation;
    }
  `,
    fragmentShader: `
    precision mediump float;
    uniform vec3 uColor;
    uniform sampler2D uTexture;
    varying vec2 vUv;
    varying float vElevation;
    void main(){
      vec4 textureColor = texture2D(uTexture, vUv);
      textureColor.rgb *= vElevation * 2.0 + 0.5;
      gl_FragColor = textureColor;
    }
  `,
    uniforms: {
      uFrequency: { value: new THREE.Vector2(10, 5) },
      uTime: { value: 0 },
      uTexture: { value: textureLoader.load('/assets/flag.png') }
    },
    // wireframe: true  //模型变成网格材质,每个三角形都显示出来
  })

  // 形状2的材质
  const material_two = new THREE.ShaderMaterial({
    side: THREE.DoubleSide,//背部可见
    vertexShader: `
    uniform vec2 uFrequency;
    uniform float uTime;
    void main() {
      vec4 modelPosition = modelMatrix * vec4(position, 1);
      modelPosition.x+=1.0;
      modelPosition.z += sin(modelPosition.x * uFrequency.x+uTime) * 0.1;
      modelPosition.z += sin(modelPosition.y * uFrequency.y+uTime) * 0.1;
      modelPosition.y += sin(modelPosition.x * uFrequency.x+uTime) * 0.1;
      modelPosition.y += sin(modelPosition.y * uFrequency.y+uTime) * 0.1;
      vec4 viewPosition = viewMatrix * modelPosition;
      vec4 projectedPosition = projectionMatrix * viewPosition;
      gl_Position =projectedPosition;
    }
    `,
    fragmentShader: `
    void main() {
      gl_FragColor = vec4(1.1,0.1,0.1,1);
    }
    `,
    uniforms: {
      uFrequency: { value: new THREE.Vector2(10, 5) },
      uTime: { value: 0 }
    },
    wireframe: true,
  })




  // 着色器材质 ShaderMaterial
  // const material = new THREE.ShaderMaterial({
  // side: THREE.DoubleSide,//背部可见
  // 顶点着色数据
  //有的数据会因为顶点变化而变化，这类数据叫attributes
  //有的数据不会因为顶点变化而变化，这类数据叫uniform
  // vertexShader: vertexShader,
  // 片面着色数据
  // varying: 从顶点着色器发送到片元着色器中的插值计算数据
  // fragmentShader: fragmentShader,
  // 片面着色器在定点着色器之后执行，先给gpu位置，然后才能渲染颜色贴图等
  // uniforms: {
  //   uFrequency: { value: new THREE.Vector2(10, 5) },
  //   uTime: { value: 0 },
  //   uColor: { value: new THREE.Color('orange') },
  //   uTexture: { value: textureLoader.load('/assets/flag.png') }
  // }
  // })
  // 创建网格


  // 创建模型
  const mesh = new THREE.Mesh(geometry, material)
  mesh.scale.y = 2 / 3
  scene.add(mesh)
  const mesh_two = new THREE.Mesh(geometry_two, material_two)
  scene.add(mesh_two)
  // end


  // 动画帧
  const clock = new THREE.Clock()
  const tick = () => {
    // console.log(material.uniforms.uTime.value)
    const elapsedTime = clock.getElapsedTime()
    // 更新材质
    material.uniforms.uTime.value = elapsedTime
    // 更新材质
    material_two.uniforms.uTime.value = elapsedTime
    // 更新控制器
    controls.update()
    // 更新渲染器
    renderer.render(scene, camera)
    // 重绘动画调用
    window.requestAnimationFrame(tick)
  }
  tick()


  // 调试工具
  // gui.add(material.uniforms.uFrequency.value, 'x').min(0).max(20).step(0.01).name('frequencyX')
  // gui.add(material.uniforms.uFrequency.value, 'y').min(0).max(20).step(0.01).name('frequencyY')


}

// 地球练习
function the_earth () {
  // 获取canvas的dom元素
  const canvas = document.querySelector('.webgl')

  // 场景
  const scene = new THREE.Scene()


  // 设置形状和纹理
  const texLoader = new THREE.TextureLoader()
  const geometry = new THREE.CylinderGeometry(5, 5, 45, 32)


  const texture = new THREE.TextureLoader()
  const textimg = texture.load('/assets/point.png')
  // 设置阵列

  // geometry.attributes.uv = new THREE.BufferAttribute(uvs, 3)
  textimg.wrapS = THREE.RepeatWrapping
  textimg.wrapT = THREE.RepeatWrapping
  // uv两个方向纹理重复数量
  textimg.repeat.set(4, 4)
  const material = new THREE.MeshBasicMaterial({ map: textimg })
  const sphere = new THREE.Mesh(geometry, material)
  scene.add(sphere)




  // end

  // 相机
  const camera = new THREE.PerspectiveCamera(23, sizes.width / sizes.height, 1, 10000)
  camera.position.set(100, 0, 1)
  scene.add(camera)


  // 渲染器
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true
  })
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1)) //分辨率
  renderer.render(scene, camera)




  // 相机轨道控制器
  const controls = new OrbitControls(camera, renderer.domElement)
  // controls.enableDamping = true //重力效果
  // controls.enablePan = false

  // 辅助线
  const axesHelper = new THREE.AxesHelper(5)
  scene.add(axesHelper)

  // 灯光
  const light = new THREE.PointLight()
  light.position.set(10, 10, 0)
  scene.add(light)
  const pointLightHelper = new THREE.PointLightHelper(light)
  scene.add(pointLightHelper)








  // 动画帧
  const clock = new THREE.Clock()
  const tick = () => {

    // console.log(material.uniforms.uTime.value)
    const elapsedTime = clock.getElapsedTime()
    textimg.offset.y += 0.001
    // 更新控制器
    controls.update()
    // 更新渲染器
    renderer.render(scene, camera)
    // 重绘动画调用
    window.requestAnimationFrame(tick)
  }
  tick()



}

// 练习bufferGeometry1
function create_Buff () {
  // 场景
  const scene = new THREE.Scene()

  // 设定声明多少个三维坐标，顶点坐标
  const MAX_POINTS = 500
  // 创建geometry
  const geometry = new THREE.BufferGeometry()

  // 创建顶点信息attributes
  // 500*3，一个坐标是3个数字，1500个就是500个坐标，这里定义positions可以储存500个坐标
  var positions = new Float32Array(MAX_POINTS * 3)
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

  //绘图范围
  var drawCount = 2 //只绘制前2个点
  geometry.setDrawRange(0, drawCount)

  // material材质
  const material = new THREE.LineBasicMaterial({ color: 0xff0000 })

  // 创建线模型
  const line = new THREE.Line(geometry, material)
  scene.add(line)


  var positions_two = line.geometry.attributes.position.array //获取体积为500个坐标的数组
  let x, y, z, index
  x = y = z = index = 0
  for (let i = 0; i < MAX_POINTS; i++) {

    positions_two[index++] = x  //index每次加一
    positions_two[index++] = y
    positions_two[index++] = z


    x += (Math.random() - 0.5) * 70  //创建500个随机坐标
    y += (Math.random() - 0.5) * 70
    z += (Math.random() - 0.5) * 70
  }
  // 创建完毕end




  // 灯光
  const light = new THREE.PointLight()
  light.position.set(10, 10, 0)
  scene.add(light)
  const pointLightHelper = new THREE.PointLightHelper(light)
  scene.add(pointLightHelper)


  // 辅助线
  const axesHelper = new THREE.AxesHelper(100)
  scene.add(axesHelper)

  // 相机
  const camera = new THREE.PerspectiveCamera(44, sizes.width / sizes.height, 1, 10000)
  camera.position.set(22, 20, 22)
  scene.add(camera)




  // 渲染器
  const renderer = new THREE.WebGLRenderer()
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1)) //分辨率
  renderer.render(scene, camera)


  // 相机轨道控制器
  const controls = new OrbitControls(camera, renderer.domElement)
  // 轨道




  // 动画帧
  const clock = new THREE.Clock()
  const tick = () => {

    drawCount = drawCount + 1
    line.geometry.setDrawRange(0, drawCount)
    line.geometry.attributes.position.needsUpdate = true
    // console.log(material.uniforms.uTime.value)
    const elapsedTime = clock.getElapsedTime()
    // 更新控制器
    controls.update()
    // 更新渲染器
    renderer.render(scene, camera)
    // 重绘动画调用
    window.requestAnimationFrame(tick)
  }
  tick()



  // 辅助线
  threeBox.value.appendChild(renderer.domElement)

}





// 手动绘制线
function create_Buffshou () {




  let camera,
    renderer,
    scene,
    geometry,
    grid,
    planeXY,
    planeYZ,
    planeXZ,
    activePlane,
    line,
    raycaster,
    lastPoint = new THREE.Vector3(0, 0, 0),
    mode,
    count = 1,
    mouse = new THREE.Vector3(0, 0),
    drawEnabled = true,
    transformControls


  var width = threeJsWidth
  var height = threeJsHeight
  const MaxCount = 10
  const positions = new Float32Array(MaxCount * 3)
  const points = []
  const container = threeBox.value //渲染区域dom元素


  // threeBox.value.appendChild(renderer.domElement)

  function init () {
    const dpr = window.devicePixelRatio
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(dpr)
    renderer.setSize(width * dpr, height * dpr)
    if (dpr !== 1) {
      renderer.domElement.style.width = `${width}px`
      renderer.domElement.style.height = `${height}px`
    }
    threeBox.value.appendChild(renderer.domElement)

    scene = new THREE.Scene()
    scene.background = new THREE.Color(0x000000)

    camera = new THREE.PerspectiveCamera(45, width / height, 1, 500)
    camera.position.set(10, 10, 20)
    camera.lookAt(0, 0, 0)

    const orbit = new OrbitControls(camera, renderer.domElement)



    // 红色代表 X 轴. 绿色代表 Y 轴. 蓝色代表 Z 轴.
    scene.add(new THREE.AxesHelper(10))
    raycaster = new THREE.Raycaster()


    // 创建正方形
    const planeMaterial = new THREE.MeshBasicMaterial()
    const planeGeometry = new THREE.PlaneGeometry(100, 100)
    planeXZ = new THREE.Mesh(planeGeometry, planeMaterial)
    planeXZ.visible = false
    planeXZ.name = "planeXZ"
    planeXZ.rotation.set(-Math.PI / 2, 0, 0)
    scene.add(planeXZ)




    // 设置网格
    grid = new THREE.GridHelper(30, 30)
    scene.add(grid)
    // end


    mode = "XZ"
    grid.rotation.set(0, 0, 0)
    activePlane = planeXZ //x轴正方形


    const material = new LineMaterial({
      linewidth: 2,
      color: 0xffffff,
      resolution: new THREE.Vector2(800, 600) //必须写的属性Line2 没有提供文档说明
    })
    // 创建线
    geometry = new LineGeometry()
    // 添加线模型的数据但不渲染
    geometry.setPositions(positions)
    geometry.instanceCount = 0
    line = new Line2(geometry, material)
    line.computeLineDistances()
    scene.add(line)

    container.addEventListener("click", handleMouseClick)
    container.addEventListener("mousemove", handleMouseMove)
    // window.addEventListener("keydown", handleKeydown)



    // 灯光
    let obj = {
      deng: 1.0
    }
    const light = new THREE.PointLight(0xffffff, obj.deng)
    const pointLightHelper = new THREE.PointLightHelper(light, 10)
    light.position.set(10, 40, 10)
    scene.add(light)
    scene.add(pointLightHelper)



    const gui = new GUI()
    gui.add(obj, 'deng', 0, 2)
  }





  // 点击的时候触发
  function handleMouseClick () {
    if (drawEnabled) {
      const { x, y, z } = mouse //储存当前电机的位置，mouse在鼠标移动中是实时赋值更新的
      positions[count * 3 + 0] = x
      positions[count * 3 + 1] = y
      positions[count * 3 + 2] = z
      count += 1  //依次设置10个坐标数据
      // grid.position.set(x, y, z)  //移动到中心为止
      // activePlane.position.set(x, y, z)
      lastPoint = mouse.clone() //每次点击记录到lastPoint
    }
  }




  // 滑动的时候触发
  function handleMouseMove (event) {

    if (drawEnabled) {

      // 将二维坐标转换成三维坐标
      const { clientX, clientY } = event //鼠标二维坐标
      const rect = container.getBoundingClientRect() //获取dom的长宽高等信息
      mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -(((clientY - rect.top) / rect.height) * 2) + 1
      raycaster.setFromCamera(mouse, camera)
      // intersects就是最后算出来，activeplane模型是否在鼠标附近
      const intersects = raycaster.intersectObjects([activePlane], true)


      // console.log(intersects)//可以获取鼠标的坐标
      if (intersects.length > 0) {
        // 如果有值
        const intersect = intersects[0]

        const { x: x0, y: y0, z: z0 } = lastPoint //最后点击的坐标
        const x = Math.round(intersect.point.x) //四舍五入
        const y = Math.round(intersect.point.y)
        const z = Math.round(intersect.point.z)
        const newPoint = new THREE.Vector3()

        newPoint.set(x, y0, z) //y轴不变，x和z是鼠标当前准确的位置

        mouse.copy(newPoint)  //newpoint的x和y轴保持了最新位置
        // console.log('test', mouse)
        updateLine()
      }
    }
  }


  function updateLine () {
    positions[count * 3 - 3] = mouse.x
    positions[count * 3 - 2] = mouse.y
    positions[count * 3 - 1] = mouse.z
    geometry.setPositions(positions)  //每次设置一个顶点！一条一条创建线
    geometry.instanceCount = count - 1
  }

  function renderLoop () {
    renderer.render(scene, camera)
    requestAnimationFrame(renderLoop)
  }

  init()
  renderLoop()


  function sizelisten () {
    // 监听局部dom更新，注意记笔记
    let fnn = new ResizeObserver(() => {
      if (threeBox.value) {
        threeJsWidth = threeBox.value.clientWidth
        camera.aspect = width / height //窗口改变的时候需要改动相机，注意！需要记笔记
        camera.updateProjectionMatrix()
        renderer.setSize(width, height)
        renderer.render(scene, camera)//重新渲染
      }
    })
    fnn.observe(threeBox.value)
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
      // console.log('test', newval)
      height = newval[1]
      width = newval[0]
      // 相机刷新
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
      renderer.render(scene, camera)//重新渲染
      // renderer.render(scene, camera)
    },
    { immediate: true }, { deep: true }
  )

}





onMounted(() => {
  // createShader()
  // the_earth()
  create_Buffshou()

})

onUnmounted(() => {
  document.querySelectorAll('.autoPlace').forEach((item) => {
    item.style.display = 'none'
  })
})



</script>

<style>
.el-card__body {
  padding: 0;
}
</style>