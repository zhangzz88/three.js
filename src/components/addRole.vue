<template>
  <el-dialog
    v-model="showBool"
    title="添加"
    width="30%"
    :before-close="handleClose"
  >
    <el-form>
      <el-form-item> 请输入角色名 </el-form-item>
      <el-form-item>
        <el-input v-model="addrole" placeholder="请输入角色名"></el-input>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showBool = false">Cancel</el-button>
        <el-button type="primary" @click="(showBool = false), addFnn()">
          添加
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { ref, defineProps, defineEmits, computed } from "vue";
import { ElMessageBox } from "element-plus";
const addrole = ref("");
let prop = defineProps({
  addShow: { type: Boolean, defualt: false },
});

let emit = defineEmits(["update:addShow", "addData"]);
let showBool = computed({
  set(newval) {
    emit("update:addShow", newval);
  },
  get() {
    return prop.addShow;
  },
});
const addFnn = () => {
  if (addrole.value) {
    emit("addData", addrole);
    addrole.value = "";
  }
};
const handleClose = (done: () => void) => {
  ElMessageBox.confirm("Are you sure to close this dialog?")
    .then(() => {
      done();
    })
    .catch(() => {
      // catch error
    });
};
</script>
<style scoped>
.el-dialog__body {
  padding: 0;
}
</style>