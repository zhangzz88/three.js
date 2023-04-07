<template>
  <div>
    <!-- <h1>{{ show }}</h1> -->
    <el-form :inline="true" :model="data.roleFormData" class="demo-form-inline">
      <el-form-item label="标题搜索">
        <el-input v-model="data.roleFormData.user" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="角色">
        <el-select v-model="data.roleFormData.region" placeholder="请输入">
          <el-option
            class="seloption"
            :label="item.roleName"
            :value="item.roleId"
            v-for="item in data.roleList.data"
            :key="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="data.userList.data" border style="width: 100%">
      <el-table-column prop="id" label="ID" />
      <el-table-column prop="userName" label="姓名" />
      <el-table-column prop="address" label="角色">
        <template #default="scope">
          <el-button
            type="primary"
            link
            v-for="item in scope.row.role"
            :key="item"
          >
            {{ item.roleName }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="编辑">
        <template #default="scope">
          <!-- <h1>{{ scope.row }}</h1> -->
          <el-button type="primary" @click="editFnn(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      layout="prev, pager, next"
      :total="data.userList.data.length - 1"
      @current-change="pageChange"
    />

    <editDialog :edit="edit" v-model:test2="show" @list="listFnn"> </editDialog>
  </div>
</template>
<script setup lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from "vue";
import { userData } from "../types/user";
import type { userListFnn } from "../types/user";
import { ElMessage } from "element-plus";
import { getOrderList, getUserList, getRoleList } from "../http/home/index";
import editDialog from "../components/editDialog.vue";

//声明页面响应式数据，因为需要使用接口等ts技术为了方便使用所以放到单独ts文件
const data = reactive(new userData());
const show = ref(false);
const edit = ref({});

// 获取用户信息
getUserList().then((res) => {
  data.userList.data = res.data;
  data.userListData = res.data;
});

// 获取角色列表
getRoleList().then((res) => {
  data.roleList.data = res.data;
});

// 点击查询
const onSubmit = () => {
  var arr = [];
  arr = data.userListData.filter((res: any) => {
    return (
      res.nikeName == data.roleFormData.user &&
      res.role.find((item: any) => item.role == data.roleFormData.region)
    );
  });
  data.userList.data = arr;
};

// 分页改变时候触发
const pageChange = (val: number) => {
  return;
};

// 点击编辑触发
function editFnn(obj: any) {
  edit.value = obj;
  show.value = true;
}
function listFnn(res: any, obj: any) {
  let arr: any = [];
  data.roleList.data.forEach((item: any) => {
    if (res.find((res: any) => res == item.roleId)) {
      arr.push({ role: item.roleId, roleName: item.roleName });
    }
  });
  let test = data.userList.data.map((res: any) => {
    if (res.id == obj.id) {
      return { ...res, role: arr };
    } else {
      return res;
    }
  });
  data.userList.data = test;
}
// return {
//   ...toRefs(data),
//   onSubmit,
//   pageChange,
//   editFnn,
//   test2,
//   fnn,
// };
</script>
<style scoped>
.cell button {
  /* border: 1px red solid; */
  margin: 0;
}
</style>