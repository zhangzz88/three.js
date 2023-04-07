<template>
  <div class="threeHs_box" ref="threeJsbox"></div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import * as THREE from "three";
// import { OrbitControls } from "@three-ts/orbit-controls";
import { DRACOLoader } from "../../node_modules/three/examples/jsm/loaders/DRACOLoader";
import { GLTFLoader } from "../../node_modules/three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "../../node_modules/three/examples/jsm/controls/OrbitControls";
import { TransformControls } from "../../node_modules/three/examples/jsm/controls/TransformControls";

const threeJsbox = ref(); //获取盒子dom
var pageWidth: number = window.innerWidth;
var pageHeight: number = window.innerHeight;
var scene: THREE.Scene;
var camera: THREE.PerspectiveCamera;
var mesh: THREE.Mesh;
var renderer: THREE.WebGL1Renderer;

// 初始化场景
function init() {
  // 场景
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0xffffff, 0.17);
  scene.background = new THREE.Color(0xdddddd);
  // create模型
  const geomtry = new THREE.BoxGeometry(10, 10, 10);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ffff });
  mesh = new THREE.Mesh(geomtry, material);
  // scene.add(mesh);

  // 加载外部模型
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/");
  const loader = new GLTFLoader();
  loader.setDRACOLoader(dracoLoader);
  loader.load("/kira.glb", function (e: any) {
    let scne = e.scene;
    // scne.scale.set(4, 4, 4);
    // scne.position.set(0, -10, 0);
    // scne.scale(2, 2, 2);
    scene.add(scne);
    // console.log(e);
  });

  // 相机
  camera = new THREE.PerspectiveCamera(55, pageWidth / pageHeight, 1, 1000);
  camera.position.set(
    0.9728517749133652,
    1.1044765132727201,
    0.7316689528482836
  );
  camera.lookAt(scene.position);

  // 渲染
  renderer = new THREE.WebGL1Renderer({
    antialias: true,
    logarithmicDepthBuffer: true,
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(pageWidth, pageHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.useLegacyLights = false;
  renderer.render(scene, camera);

  // 辅助线
  const axesHelper = new THREE.AxesHelper(200);
  scene.add(axesHelper);

  // 灯光
  const light = new THREE.AmbientLight(0xffffff, 8);
  // light.position.set(40, 40, 40);
  scene.add(light);

  // 相机轨道
  var orbitControls = new OrbitControls(camera, renderer.domElement);
  // orbitControls.minDistance = 0.2;
  // orbitControls.maxDistance = 1.5;
  // orbitControls.enableDamping = true;

  var transformControls = new TransformControls(camera, renderer.domElement);
  transformControls.size = 0.75;
  transformControls.showX = false;
  transformControls.space = "world";
  // transformControls.attach(OOI.target_hand_l);
  scene.add(transformControls);
}
init();

// 动画帧
function render() {
  camera.aspect = pageWidth / pageHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(pageWidth, pageHeight);
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}
render();

onMounted(() => {
  threeJsbox.value.appendChild(renderer.domElement);

  onresizeFnn(); //自适应页面大小
  // 监听页面滑动
  // threeJsbox.value.addEventListener("scroll", scrollFnn);
  // 监听滑动事件
  // threeJsbox.value.addEventListener("mousewheel", function (e: any) {
  //   e.preventDefault();
  //   console.log(e);
  // });
});

// 以下是关于canvas和页面大小的自适应代码--------------------------------------------------
// 监听页面滑动
function scrollFnn() {
  console.log("滑动了");
}

// 监听页面大小改变
function onresizeFnn() {
  pageWidth = window.innerWidth;
  pageHeight = window.innerHeight;
  threeJsbox.value && (threeJsbox.value.style.width = pageWidth + "px");
  threeJsbox.value && (threeJsbox.value.style.height = pageHeight + "px");
}
onresizeFnn();
// 自适应页面
window.onresize = function (e) {
  onresizeFnn();
};
</script>
<style lang="scss">
.threeHs_box {
  // height: 2000px;
  // border: 1px red solid;
  overflow: hidden;

  .threeJs_item {
    height: 1000px;
  }
}
</style>