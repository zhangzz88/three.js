<template>
  <div>
    <el-dialog
      v-model="showBool"
      title="编辑"
      width="50%"
      :modal="false"
      :close-on-click-modal="false"
    >
      <el-form :model="form">
        <el-form-item label="姓名" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="Zones" :label-width="formLabelWidth">
          <!-- <el-select v-model="form.region" placeholder="Please select a zone">
            <el-option label="Zone No.1" value="shanghai" />
            <el-option label="Zone No.2" value="beijing" />
          </el-select> -->
          <el-select-v2
            v-model="form.region"
            :options="options"
            placeholder="Please select"
            style="width: 240px"
            multiple
          />
        </el-form-item>
      </el-form>
      <!-- <span #default>123</span> -->

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showBool = false">取消</el-button>
          <el-button type="primary" @click="submit"> 确认 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import {
  computed,
  defineProps,
  defineEmits,
  reactive,
  ref,
  watch,
  onMounted,
} from "vue";
import { ElMessageBox } from "element-plus";
import { userData } from "../types/user";
import { getOrderList, getUserList, getRoleList } from "../http/home/index";
import { interfaceTypeAnnotation } from "@babel/types";

const prop = defineProps({
  test2: {
    type: Boolean,
    required: false,
    default: false,
  },
  edit: {
    type: Object,
    request: true,
  },
});
const emits = defineEmits(["update:test2", "list"]);

var showBool = computed({
  set(val) {
    emits("update:test2", val);
  },
  get() {
    return prop.test2;
  },
});

const handleClose = (done: () => void) => {
  ElMessageBox.confirm("Are you sure to close this dialog?")
    .then(() => {
      done();
    })
    .catch(() => {
      // catch error
    });
};

interface formInter {
  name: string;
  region: number[];
}
var form: formInter = reactive({
  name: "",
  region: [],
  date1: "",
  date2: "",
  delivery: false,
  type: [],
  resource: "",
  desc: "",
});

const dialogTableVisible = ref(false);
const dialogFormVisible = ref(false);
const formLabelWidth = "50px";

const initials = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];
const value = ref([]);
const test = new userData();

const options = ref([
  { value: "1", label: "a0" },
  { value: "2", label: "a1" },
  { value: "3", label: "a2" },
  { value: "4", label: "a3" },
  { value: "5", label: "a4" },
  { value: "6", label: "a5" },
]);
// 获取角色列表
getRoleList().then((res) => {
  let arr: any = [];
  res.data.forEach((item: any) => {
    var newObj = { value: null, label: null };
    newObj.value = item.roleId;
    newObj.label = item.roleName;
    arr.push(newObj);
  });
  options.value = arr;
});
watch(prop, (newval: any, oldval) => {
  form.name = newval.edit.nikeName || "";
  let arr: any = [];
  newval.edit.role.forEach((res: any) => {
    arr.push(res.role);
    form.region = arr;
  });
});

function submit() {
  showBool.value = false;
  emits("list", form.region, prop.edit);

}
</script>
<style scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>