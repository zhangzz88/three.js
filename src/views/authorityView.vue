<template>
  <div>
    <el-tree
      ref="treeRef"
      :data="data"
      show-checkbox
      node-key="roleId"
      :default-expanded-keys="[2, 3]"
      :default-checked-keys="authorityData.routerData.authority"
      :props="defaultProps"
    />
    <el-button @click="getCheckedKeys()">修改权限</el-button>
  </div>
</template>
 <script setup lang="ts">
import { reactive, ref } from "vue";
import { useRoute } from "vue-router";
import { initData } from "../types/authority";
import { getauthorityList } from "../http/home/index";
import { ElTree } from "element-plus";
import type Node from "element-plus/es/components/tree/src/model/node";
const { query } = useRoute();
const authorityData = reactive(new initData());

// 获取所有权限列表
getauthorityList().then((res) => {
  authorityData.roleList = res.data;
  // console.log("获取所有权限列表", res);
});

// 将路由传参赋值
authorityData.routerData = {
  authority: query.authority,
  roleId: query.roleId,
  roleName: query.roleName,
};

// 树形控件懒加载
const defaultProps = {
  children: "roleList",
  label: "name",
};
const data = [
  {
    name: "订单列表",
    roleId: 1,
    viweRole: "",
    roleList: [
      {
        name: "订单详情",
        roleId: 4,
        viewRole: "",
        roleList: [
          {
            name: "审核",
            roleId: 5,
          },
        ],
      },
      {
        name: "查看",
        roleId: 2,
      },
      {
        name: "删除",
        roleId: 3,
      },
    ],
  },
  {
    name: "商品列表",
    roleId: 6,
    viweRole: "",
    roleList: [
      {
        name: "商品详情",
        roleId: 9,
        viewRole: "",
        roleList: [
          {
            name: "修改",
            roleId: 10,
          },
        ],
      },
      {
        name: "查看",
        roleId: 7,
      },
      {
        name: "删除",
        roleId: 8,
      },
    ],
  },
];
const data1 = [
  {
    id: 1,
    label: "Level one 1",
    children: [
      {
        id: 4,
        label: "Level two 1-1",
        children: [
          {
            id: 9,
            label: "Level three 1-1-1",
          },
          {
            id: 10,
            label: "Level three 1-1-2",
          },
        ],
      },
    ],
  },
  {
    id: 2,
    label: "Level one 2",
    children: [
      {
        id: 5,
        label: "Level two 2-1",
      },
      {
        id: 6,
        label: "Level two 2-2",
      },
    ],
  },
  {
    id: 3,
    label: "Level one 3",
    children: [
      {
        id: 7,
        label: "Level two 3-1",
      },
      {
        id: 8,
        label: "Level two 3-2",
      },
    ],
  },
];
interface Tree {
  id: number;
  label: string;
  children?: Tree[];
}
const treeRef = ref<InstanceType<typeof ElTree>>();
const getCheckedNodes = () => {
  // console.log(treeRef.value!.getCheckedNodes(false, false));
};
//获取权限列表选中项，将路由传来的用户id用接口将选中的加进去
const getCheckedKeys = () => {
  // console.log(treeRef.value!.getCheckedKeys(false));
};
// console.log("路由是", authorityData.routerData);
</script>