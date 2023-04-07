<template>
  <div>
    <!-- <el-button @click="show = true">添加角色</el-button> -->
    <el-table :data="data.roleData" style="width: 100%">
      <el-table-column prop="roleId" label="ID" width="180" />
      <el-table-column prop="roleName" label="角色名" width="180" />
      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="primary" link @click="edit(scope.row)">
            修改权限
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from "vue-router";
import { reactive, ref } from "vue";
import { getRoleList } from "../http/home/index";
import { InitData } from "../types/role";
const data = reactive(new InitData());
const show = ref(false);
const router = useRouter();
getRoleList().then((res) => {
  data.roleData = res.data;
});

const addFnn = ({ value }: any) => {
  data.roleData.push({
    roleId: data.roleData.length + 1,
    roleName: value,
    authority: [],
  });
};
// 点击编辑按钮跳转到新页面分配权限
function edit(e: any) {
  router.push({ path: "authority", query: e });
}
</script>
<style scoped>
.test {
  border: 1px red solid;
}
</style>