<template>
  <el-container>
    <el-header height="100px" class="headernav">
      <nav class="navbar navbar-dark navbar-expand-md">
        <!-- logo -->
        <a class="navbar-brand" style="color: blue" href="#/order">
          <img src="../assets/logo.png" alt="" width="50" />
        </a>

        <!-- 菜单按钮 -->
        <button
          class="navbar-toggler"
          data-bs-toggle="collapse"
          data-bs-target="#collapsibleNavbar"
        >
          <el-icon size="30"><Operation /></el-icon>
        </button>
        <!-- end -->

        <el-icon
          @click="menushow()"
          size="30"
          class="hidden-xs-only"
          style="margin-left: 65px"
          ><Operation
        /></el-icon>
        <div class="collapse navbar-collapse" id="collapsibleNavbar">
          <ul class="navbar-nav" style="position: relative; z-index: 99">
            <template v-for="(item, index) in everyList" :key="index">
              <router-link v-if="item.path != '/three.js'" :to="item.path">
                <li class="nav-item d-md-none">
                  <!-- <a class="nav-link" href="#" v-if="item.meta?.isShow == true"> -->
                  {{ item.meta.title }}
                  <!-- </a> -->
                </li>
              </router-link>
            </template>
          </ul>
        </div>

        <el-dropdown class="navright hidden-xs-only dropDom">
          <span class="el-dropdown-link" style="z-ind">
            你好,name
            <el-icon class="el-icon--right">
              <arrow-down />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="outBtnFnn">退出</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </nav>
    </el-header>
    <!-- <el-header height="50px" class="hidden-xs-only">
      <el-row :gutter="20">
        <el-col :span="4"
          ><div class="grid-content ep-bg-purple logo_image">
            <img src="@/assets/logo.png" alt="logo" title="logo" />
            <el-icon @click="menushow()" size="30"><Operation /></el-icon>
          </div>
        </el-col>

        <el-col :span="16"
          ><div class="grid-content ep-bg-purple">
            <strong>后台管理</strong>
          </div>
        </el-col>
        <el-col :span="4"
          ><div class="grid-content ep-bg-purple">张三</div></el-col
        >
      </el-row>
    </el-header> -->
    <el-container>
      <el-menu
        router
        active-text-color="black"
        background-color="white"
        class="el-menu-vertical-demo hidden-xs-only"
        text-color="black"
        default-active="/order"
        :collapse="isCollapse"
      >
        <MeunCom v-for="item in aa" :key="item.path" :item="item"></MeunCom>
      </el-menu>

      <el-main>
        <router-view> </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import { ArrowDown } from "@element-plus/icons-vue";
import { Search } from "@element-plus/icons-vue";
import { defineComponent, onMounted, ref } from "vue";
import router from "../router";
import type { RouteRecordNormalized } from "vue-router";
import { DynamicRouting } from "../router/addrouters";
import orderview from "../views/OrderView.vue";
import MeunCom from "../components/MenuVie.vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
export default defineComponent({
  name: "HomeView",
  components: { MeunCom },
  setup() {
    const meunList = router.getRoutes();
    var aa: any = [];
    var everyList: any = ref([]);

    meunList.forEach((item: RouteRecordNormalized) => {
      if (item.meta.isShow && !item.meta.father) {
        aa.push(item);
      }
      if (item.meta.isShow) {
        everyList.value.push(item);
      }
    });

    function fnn(item: any) {
      router.push(item);
    }

    let sadf = [...router.getRoutes()];
    if (sadf.find((item) => item.path == "/order")) {
      // router.push("/order");
    }
    const isCollapse = ref(false);
    const menushow = function () {
      isCollapse.value = !isCollapse.value;
    };

    function outBtnFnn() {
      localStorage.removeItem("token");
      router.push("/login");
    }
    const store = useStore();

    onMounted(() => {
      let maindom = document.querySelector(".el-main");
      store.commit("editThee", {
        threeJsWidth: maindom?.scrollWidth,
        threeJsHeight: maindom?.scrollHeight,
      });

      // 监听页面改变大小，设置main内的dom自适应
      window.addEventListener("resize", () => {
        // let maindom = document.querySelector(".el-main");

        store.commit("editThee", {
          threeJsWidth: document.querySelector(".el-main")?.clientWidth,
          threeJsHeight: document.querySelector(".el-main")?.clientHeight,
        });
        // console.log(store.getters.getFnn1);
      });
    });
    return {
      aa,
      fnn,
      everyList,
      isCollapse,
      menushow,
      DynamicRouting,
      Search,
      outBtnFnn,
    };
  },
});
</script>
<style lang="scss">
.el-container {
  height: 100%;
}
.logo_image {
  width: 100px;
  height: 50px;
}
.logo_image img {
  height: 100%;
}
.el-header {
  color: white;
  line-height: 50px;
  background: rgb(145, 2, 208);
}
.el-main {
  text-align: left;
  // width: 100vw;
  // height: 100%;
  padding-bottom: 10px !important;
  box-sizing: border-box;
  overflow-y: scroll;
  // border: 1px black solid;
}
.logo_image {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 50px;
  box-sizing: border-box;
}
.headernav {
  padding: 0;
  margin-top: 10px;
  /* z-index: 9999; */
  /* border: 1px black solid; */
  background: white;
  padding: 0 20px;
}
.navbar {
  background: white;
  /* background: white; */
  color: black;
}

.navbar-toggler {
  outline: none !important;
  color: black;
  border: none !important;
  box-shadow: none !important;
}
.navbar-toggler:focus {
  outline: none !important;
  border: none !important;
  box-shadow: none !important;
}
.navbar-toggler:hover {
  outline: none !important;
  border: none !important;
  box-shadow: none !important;
}
.dropDom:hover,
:focus {
  outline: none !important;
  /* border: none !important; */
  box-shadow: none !important;
}
.el-dropdown-link {
  display: inline-block;
  height: 30px !important;
}
.navbar-nav {
  background: white;
}
.dropDom {
  outline: none !important;
  /* border: none !important; */
  box-shadow: none !important;
  /* border: 1px black solid; */
  height: 30px !important;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
  span,
  .el-sub-menu__icon-arrow {
    display: block;
  }
}
.el-menu-vertical-demo {
  span,
  .el-sub-menu__icon-arrow {
    display: none;
  }
}
.el-sub-menu {
  overflow: hidden;
}
.nav-item {
  // border: 1px red solid;
}
</style>
