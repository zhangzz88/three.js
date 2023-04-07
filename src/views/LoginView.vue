<template>
  <div class="login_box">
    <div class="content">
      <!-- 左侧效果 -->
      <div class="left hidden-sm-and-down">
        <img src="@/assets/img2.png" :class="name" alt="people" />

        <img v-show="testas" :src="testas" class="sphere s-animtion" />
        <!-- <img src="../assets/img1.png" class="sphere s-animtion" /> -->
      </div>
      <div class="right">
        <div class="form-wrappepr">
          <!-- 表单区域 -->
          <el-form
            ref="ruleFormRef"
            :model="ruleForm"
            status-icon
            :rules="rules"
            class="rule"
          >
            <el-form-item prop="username">
              <el-input
                v-model="ruleForm.username"
                type="username"
                autocomplete="off"
                placeholder="Enter Email Or Number"
              />
            </el-form-item>

            <el-form-item prop="password">
              <el-input
                v-model="ruleForm.password"
                type="password"
                autocomplete="off"
                placeholder="Password"
              />
            </el-form-item>

            <el-form-item>
              <el-button
                :plain="true"
                type="primary"
                @click="submitForm(ruleFormRef)"
                >登录</el-button
              >
            </el-form-item>
          </el-form>

          <!-- 底部分享区域 -->
          <div class="other-login">
            <div class="divider">
              <span class="line"></span>
              <span class="divider-text">or continue with</span>
              <span class="line"></span>
            </div>
            <div class="other-login-wrapper">
              <!-- qq -->
              <div class="other-login-item">
                <img src="@/assets/QQ.png" alt="QQ" />
              </div>
              <!-- 微信 -->
              <div class="other-login-item">
                <img src="@/assets/WeChat.png" alt="WeChat" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="login_content">
     <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        status-icon
        :rules="rules"
        label-width="70px"
        class="demo-ruleForm"
      >
        <el-form-item label="账号" prop="username">
          <el-input
            v-model="ruleForm.username"
            type="username"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="ruleForm.password"
            type="password"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item>
          <el-button :plain="true" type="primary" @click="submitForm(ruleFormRef)"
            >登录</el-button
          >
        </el-form-item>
      </el-form> 
    </div>-->
  </div>
</template>
<script lang="ts">
import { reactive, ref, toRefs, defineComponent } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { InitData, InitFnn } from "../types/login";
import { Base64 } from "js-base64";
export default defineComponent({
  setup() {
    let testas = ref();
    const test = ref(require("../assets/img1.png"));
    let image = new Image();
    image.src = test.value;
    image.onload = () => {
      var canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      var context = canvas.getContext("2d");
      context?.drawImage(image, 0, 0, image.width, image.height);
      var quality = 0.8;
      var dataURL = canvas.toDataURL("image/png", quality);
      testas.value = dataURL;
      console.log(dataURL);
    };

    // 表单数据 （因为下面所注释方式没办法进行类型指定或者说使用不了接口只能用new的方式代替了）
    // const data=reactive({
    //   username:'',
    //   password:''
    // })
    const data = reactive(new InitData()); //我们用new的方式来声明数据

    // 验证规则
    const validatePass = (rule: any, value: any, callback: any) => {
      if (value === "") {
        callback(new Error("请输入账号"));
      } else {
        callback();
      }
    };
    const validatePass2 = (rule: any, value: any, callback: any) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };

    // 设置表单验证
    const rules = reactive<FormRules>({
      username: [{ validator: validatePass, trigger: "blur" }],
      password: [{ validator: validatePass2, trigger: "blur" }],
    });

    // 点击提交按钮 （因为dom元素ruleFormRef最开始没有赋值，需要加一个undefined）
    const submitForm = new InitFnn().submitForm;

    const name = ref("people p-animtion");
    setTimeout(() => {
      name.value = "people top_bottom";
    }, 2000);
    return { ...toRefs(data), rules, submitForm, name, testas };
  },
});
</script>

<style scoped>
.login_box {
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 99999;
  background-image: radial-gradient(
    circle at top right,
    rgb(36, 9, 119) 0%,
    rgb(36, 9, 119) 48%,
    rgb(72, 7, 149) 48%,
    rgb(72, 7, 149) 53%,
    rgb(109, 5, 178) 53%,
    rgb(109, 5, 178) 56%,
    rgb(145, 2, 208) 56%,
    rgb(145, 2, 208) 69%,
    rgb(181, 0, 237) 69%,
    rgb(181, 0, 237) 100%
  );
}
.login_content {
  width: 450px;
  /* border: 1px black solid; */
  margin: 0 auto;
  margin-top: 200px;
  background: white;
  border-radius: 10px;
  padding: 20px;
  /* padding-top: 100px; */
  /* margin-top: 100px; */
}
:root {
  font-size: 15px;
}

body {
  margin: 0;
  min-height: 100vh;
  background-color: #abc6f8;
  background-image: radial-gradient(
      closest-side,
      rgb(255, 255, 255),
      rgba(235, 105, 78, 0)
    ),
    radial-gradient(closest-side, rgb(250, 203, 203), rgba(243, 11, 164, 0)),
    radial-gradient(closest-side, rgb(237, 252, 202), rgba(254, 234, 131, 0)),
    radial-gradient(closest-side, rgb(197, 248, 241), rgba(170, 142, 245, 0)),
    radial-gradient(closest-side, rgb(206, 200, 243), rgba(248, 192, 147, 0));
  background-size: 130vmax 130vmax, 80vmax 80vmax, 90vmax 90vmax,
    110vmax 110vmax, 90vmax 90vmax;
  background-position: -80vmax -80vmax, 60vmax -30vmax, 10vmax 10vmax,
    -30vmax -10vmax, 50vmax 50vmax;
  background-repeat: no-repeat;
  animation: 10s movement linear infinite;
}

body::after {
  content: "";
  display: block;
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.content {
  width: 90%;
  height: 90%;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.18);
  display: flex;
}
.content .left {
  flex: 1;
  position: relative;
}
.content .left .sphere {
  position: absolute;
  left: 30%;
  width: 90%;
  z-index: 1;
  animation: sphereAnimation 2s;
  animation-fill-mode: forwards;
  animation-timing-function: ease;
}
.content .left .people {
  position: absolute;
  left: -50%;
  top: 20%;
  width: 70%;
  z-index: 2;
}
.content .left .p-animtion {
  animation: peopleAnimation 2s;
  animation-fill-mode: forwards;
  animation-timing-function: ease;
}
.content .left .p-other-animtion {
  animation-name: pOtherAnimation;
  animation-direction: alternate;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  animation-duration: 3s;
}
.content .left .s-animtion {
  animation: sphereAnimation 2s;
  animation-fill-mode: forwards;
  animation-timing-function: ease;
}
.content .left .s-other-animtion {
  animation-name: sOtherAnimation;
  animation-direction: alternate;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  animation-duration: 3s;
}
.content .right {
  flex: 1;
  position: relative;
  z-index: 12;
}
.content .right .top {
  width: 80%;
  margin-left: 38px;
  color: rgb(51, 52, 124);
  font-size: 20px;
  font-weight: 600;
  font-family: "Century Gothic", Times, serif;
  position: absolute;
  left: 50%;
  top: 5%;
  transform: translate(-50%, 0);
}
.content .right .top .top-item {
  float: left;
  width: 150px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  margin-right: 10px;
  transition: 0.5s;
}
.content .right .top .top-item:hover {
  border: 0;
  background-color: #fff;
  border-radius: 50px;
  cursor: pointer;
  box-shadow: -20px 10px 32px 1px rgba(182, 183, 185, 0.37);
}
.content .right .form-wrappepr {
  width: 60%;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  text-align: right;
  /* border: 1px red solid; */
}
.content .right .form-wrappepr h1 {
  float: left;
  font-family: "Century Gothic", Times, serif;
  margin: 30px 0;
}
.content .right .form-wrappepr .inputs {
  display: block;
  width: 100%;
  height: 70px;
  margin: 30px 0;
  border-radius: 10px;
  border: 0;
  background-color: rgb(210, 223, 237);
  color: rgb(80, 82, 84);
  font-family: "Century Gothic", Times, serif;
  outline: none;
  padding: 20px;
  box-sizing: border-box;
  font-size: 20px;
  background: rgb(210, 223, 237) !important;
}
.content .right .form-wrappepr .tips {
  display: block;
  margin-top: -15px;
  color: rgb(160, 170, 182);
  cursor: pointer;
}
.content .right .form-wrappepr button {
  width: 100%;
  height: 50px;
  background-color: rgb(68, 96, 241);
  border-radius: 10px;
  font-size: 15px;
  color: #fff;
  border: 0;
  font-weight: 600;
  margin: 30px 0;
  cursor: pointer;
  box-shadow: -20px 28px 42px 0 rgba(62, 145, 255, 0.37);
  font-family: "Century Gothic", Times, serif;
}
.content .right .form-wrappepr .other-login .divider {
  width: 100%;
  margin: 20px 0;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.content .right .form-wrappepr .other-login .divider .line {
  display: inline-block;
  max-width: 35%;
  width: 35%;
  flex: 1;
  height: 1px;
  background-color: rgb(162, 172, 185);
}
.content .right .form-wrappepr .other-login .divider .divider-text {
  vertical-align: middle;
  margin: 0px 20px;
  display: inline-block;
  width: 150px;
  color: rgb(162, 172, 185);
  white-space: normal;
}
.content .right .form-wrappepr .other-login .other-login-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.content
  .right
  .form-wrappepr
  .other-login
  .other-login-wrapper
  .other-login-item {
  width: 70px;
  padding: 10px;
  text-align: center;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  color: rgb(51, 49, 116);
  margin: 0 10px;
  transition: 0.4s;
}
.content
  .right
  .form-wrappepr
  .other-login
  .other-login-wrapper
  .other-login-item
  img {
  width: 40px;
  height: 40px;
  vertical-align: middle;
}
.content
  .right
  .form-wrappepr
  .other-login
  .other-login-wrapper
  .other-login-item
  span {
  vertical-align: middle;
}
.content
  .right
  .form-wrappepr
  .other-login
  .other-login-wrapper
  .other-login-item:hover {
  width: 80px;
  height: 50%;
  background-color: #fff;
  border: 0;
  box-shadow: -20px 10px 32px 1px rgba(182, 183, 185, 0.37);
}

@keyframes movement {
  0%,
  100% {
    background-size: 130vmax 130vmax, 80vmax 80vmax, 90vmax 90vmax,
      110vmax 110vmax, 90vmax 90vmax;
    background-position: -80vmax -80vmax, 60vmax -30vmax, 10vmax 10vmax,
      -30vmax -10vmax, 50vmax 50vmax;
  }
  25% {
    background-size: 100vmax 100vmax, 90vmax 90vmax, 100vmax 100vmax,
      90vmax 90vmax, 60vmax 60vmax;
    background-position: -60vmax -90vmax, 50vmax -40vmax, 0vmax -20vmax,
      -40vmax -20vmax, 40vmax 60vmax;
  }
  50% {
    background-size: 80vmax 80vmax, 110vmax 110vmax, 80vmax 80vmax,
      60vmax 60vmax, 80vmax 80vmax;
    background-position: -50vmax -70vmax, 40vmax -30vmax, 10vmax 0vmax,
      20vmax 10vmax, 30vmax 70vmax;
  }
  75% {
    background-size: 90vmax 90vmax, 90vmax 90vmax, 100vmax 100vmax,
      90vmax 90vmax, 70vmax 70vmax;
    background-position: -50vmax -40vmax, 50vmax -30vmax, 20vmax 0vmax,
      -10vmax 10vmax, 40vmax 60vmax;
  }
}
@keyframes sphereAnimation {
  0% {
    /* width: 10%; */
  }
  100% {
    /* width: 90%; */
    transform: translate(-30%, 5%);
  }
}
@keyframes test {
  0% {
    transform: translateY(-30%);
  }
  100% {
    transform: translateY(30%);
  }
}
/* 小飞人 */
@keyframes peopleAnimation {
  0% {
    /* width: 40%; */
  }
  100% {
    /* width: 70%; */
    transform: translate(90%, -10%);
    animation: test 2s;
  }
}

@keyframes pOtherAnimation {
  0% {
    transform: translate(90%, -10%);
  }
  100% {
    transform: translate(90%, -15%);
  }
}
@keyframes sOtherAnimation {
  0% {
    transform: translate(-30%, 5%);
  }
  100% {
    transform: translate(-30%, 10%);
  }
} /*# sourceMappingURL=style.css.map */
.rule {
  /* border: 2px solid black; */
}
.top_bottom {
  animation: test 2s infinite alternate;
}
@keyframes test {
  0% {
    transform: translate(90%, -10%);
  }
  100% {
    transform: translate(90%, 10%);
  }
}
:deep .el-input__wrapper {
  background: rgb(210, 223, 237);
  border-radius: 10px;
}
:deep .el-input__inner {
  height: 70px;
  font-family: "Century Gothic", Times, serif;
  font-size: 20px;
  color: rgb(80, 82, 84);
  /* border-radius: 60px; */
}
.el-form {
  padding-top: 100px;
}
:deep input::-webkit-input-placeholder {
}
:deep input {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
</style>