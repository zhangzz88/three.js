<template>
  <el-dialog v-model="propsComputed" title="Shipping address">
    <el-form :model="form">
      <el-form-item label="Promotion name" :label-width="formLabelWidth">
        <el-input v-model="form.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="Zones" :label-width="formLabelWidth">
        <el-select v-model="form.region" placeholder="Please select a zone">
          <el-option label="Zone No.1" value="shanghai" />
          <el-option label="Zone No.2" value="beijing" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="propsComputed = false">Cancel</el-button>
        <el-button type="primary" @click="propsComputed = false">
          Confirm
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>


<script lang="ts" setup>
import { reactive, ref, defineProps, computed, defineEmits } from "vue";

var props = defineProps({
  dialogFormVisible: { type: Boolean, default: () => false },
});
var emits = defineEmits(["update:dialogFormVisible"]);
const propsComputed = computed({
  set(newval) {
    emits("update:dialogFormVisible", newval);
  },
  get() {
    return props.dialogFormVisible;
  },
});

const dialogTableVisible = ref(false);
const formLabelWidth = "140px";

const form = reactive({
  name: "",
  region: "",
  date1: "",
  date2: "",
  delivery: false,
  type: [],
  resource: "",
  desc: "",
});

const gridData = [
  {
    date: "2016-05-02",
    name: "John Smith",
    address: "No.1518,  Jinshajiang Road, Putuo District",
  },
  {
    date: "2016-05-04",
    name: "John Smith",
    address: "No.1518,  Jinshajiang Road, Putuo District",
  },
  {
    date: "2016-05-01",
    name: "John Smith",
    address: "No.1518,  Jinshajiang Road, Putuo District",
  },
  {
    date: "2016-05-03",
    name: "John Smith",
    address: "No.1518,  Jinshajiang Road, Putuo District",
  },
];
</script>