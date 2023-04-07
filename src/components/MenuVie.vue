<template>
  <div>
    <!-- 1.路由没有children就渲染单个菜单 -->
    <template v-if="item.children && item.children.length == 0">
      <el-menu-item :index="item.path">
        <el-icon>
          <component :is="item.meta.icon" />
        </el-icon>
        <template #title>{{ item.meta.title }}</template>
      </el-menu-item>
    </template>

    <!-- 2.路由有children就渲染多个菜单 -->
    <template v-if="item.children && item.children.length > 0">
      <el-sub-menu :index="item.path">
        <template #title>
          <el-icon> <component :is="item.meta.icon" /></el-icon>
          <span>{{ item.meta.title }}</span>
        </template>
        <MenuVie
          v-for="val in item.children"
          :key="val.path"
          :index="val.path"
          :item="val"
        ></MenuVie>
      </el-sub-menu>
      <!-- <el-sub-menu :index="item.path">
        <template #title>
          <el-icon><location /></el-icon>
          <span>Navigator One</span>
        </template>
        <el-menu-item-group>
          <template #title><span>Group One</span></template>
          <el-menu-item index="1-1">item one</el-menu-item>
          <el-menu-item index="1-2">item two</el-menu-item>
        </el-menu-item-group>
      </el-sub-menu> -->
    </template>
  </div>
</template>

<script  lang="ts">
import router from "@/router";
import { computed, defineComponent, defineProps } from "vue";
import MenuVie from "./MenuVie.vue";
export default defineComponent({
  props: ["item"],
  setup(props) {
    return {};
  },
});
</script>
<style>
</style>