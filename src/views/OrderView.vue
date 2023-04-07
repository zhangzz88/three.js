<template>
  <div>
    <el-row>
      <!-- <attrs-view class="attrr"></attrs-view> -->
    </el-row>

    <el-progress :percentage="widthcall" />
    <el-row style="margin-bottom: 20px">
      <el-col :span="24">
        <el-upload
          drag
          :file-list="fileList"
          :on-change="onUpload"
          :auto-upload="false"
          ref="uploadfile"
          :limit="10"
          :show-file-list="false"
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">大文件上传本地环境测试</div>
        </el-upload>
      </el-col>
    </el-row>

    <el-table :data="listData" border style="width: 100%">
      <el-table-column prop="date" label="Date" width="180" />
      <el-table-column prop="name" label="Name" width="180" />
      <el-table-column prop="address" label="Address" />
    </el-table>

    <el-pagination
      background
      layout="prev, pager, next"
      :total="tableData.title - 1"
      @current-change="pageChange"
    />

    <!-- <el-row :gutter="10">
      <el-col :xs="12" :sm="6" v-for="item in 12" :key="item"
        ><div class="grid-content ep-bg-purple"
      /></el-col>
    </el-row> -->
    <el-dialog v-model="dialogFormVisible" title="Shipping address">
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
          <el-button @click="dialogFormVisible = false">Cancel</el-button>
          <el-button type="primary" @click="dialogFormVisible = false">
            Confirm
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, reactive, ref, toRefs } from "vue";
import { orderData } from "../types/order";
import { ElMessage } from "element-plus";
import { getOrderList } from "../http/home/index";
import { UploadFilled } from "@element-plus/icons-vue";
import SparkMD5 from "spark-md5";
import { create, size } from "lodash";
import { file } from "@babel/types";
import { postUpdata } from "../http/home/index";
import CryptoJS from "crypto-js";
import md5 from "js-md5";
import AttrsView from "../views/AboutView.vue";
export default defineComponent({
  components: {
    // AttrsView,
  },
  setup() {
    const dialogTableVisible = ref(false);
    const dialogFormVisible = ref(false);
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
    // =----------------------------------
    const fileList = ref([]);
    var baseurl: any = ref("");
    const widthcall = ref(0);
    //声明页面响应式数据，因为需要使用接口等ts技术为了方便使用所以放到单独ts文件
    const data = reactive(new orderData());
    // 进入页面获取列表数据
    function getListData() {
      getOrderList().then((res: any) => {
        if (res) {
          data.tableData = res;
          data.tableData.title = res.body.length;
          // 如果不是第一页
          if (data.tableData.page != 1) {
            data.listData = data.tableData.body.slice(
              data.tableData.page * 10,
              data.tableData.page * 10 + 10
            ); //渲染table
          } else {
            data.listData = data.tableData.body.slice(0, 10); //渲染table
          }
        }
      });
    }
    getListData();
    // 点击查询
    const onSubmit = () => {
      if (data) {
        if (data.formInline.user && data.formInline.region) {
          alert("开始查询");
        } else {
          ElMessage({
            message: "请输入内容",
            type: "warning",
          });
        }
      }
    };

    // 分页改变时候触发
    const pageChange = (val: number) => {
      data.tableData.page = val;
      if (val != 1) {
        data.listData = data.tableData.body.slice(val * 10, val * 10 + 10); //渲染table
      } else {
        data.listData = data.tableData.body.slice(0, 10); //渲染table
      }
    };

    function createFileReader(file: any) {
      let readData = new FileReader();
      readData.readAsBinaryString(file);
      return new Promise((resolve, reject) => {
        readData.addEventListener("load", function (e: any) {
          resolve(e);
        });
        readData.onerror = function (e) {
          reject(e);
        };
      });
    }
    // 获取到了文件执行
    async function onUpload(File: any) {
      let fileSize = File.size; //文件总体大小
      let chunkSize = 5 * 1024 * 1024; //每个切割多大5kb
      let SizeIndex = 0; //当前切割到多少个字节了当等于文件大小时候就是传完了
      if (localStorage.getItem("file")) {
        SizeIndex = Number(localStorage.getItem("file"));
      }
      // 如果当前切割的大小比如2MB小于文件大小，就开始切割
      while (SizeIndex < File.size) {
        const GoChunk = File.raw.slice(SizeIndex, SizeIndex + chunkSize); //指定开始结束开始切割
        // let sliceData: any = await createFileReader(GoChunk);
        // console.log(md5(sliceData.target.result));
        const formData = createFormData({
          name: "123",
          type: File.raw.type,
          size: SizeIndex, //当前上次索引
          fileName: File.name,
          uploadSize: File.size,
          file: GoChunk,
        });

        try {
          var uploadRqeuset = await postUpdata(formData); //发送请求
        } catch (e) {
          console.log("错误是", e);
          return;
        }

        SizeIndex += chunkSize; //每次切割完自动加5MB
        widthcall.value = Math.floor((SizeIndex / File.size) * 100); //计算占总体积百分之几
        localStorage.setItem("file", JSON.stringify(SizeIndex));
        console.log(uploadRqeuset, SizeIndex);
      }
    }

    function createFormData(obj: any) {
      const fd = new FormData();
      fd.append("name", obj.name);
      fd.append("type", obj.type);
      fd.append("size", obj.size);
      fd.append("fileName", obj.fileName);
      fd.append("uploadSize", obj.uploadSize);
      fd.append("file", obj.file);
      return fd;
    }
    function btnFnn() {
      document
        .getElementsByTagName("body")[0]
        .style.setProperty("--testFont", "white");
    }
    return {
      ...toRefs(data),
      onSubmit,
      pageChange,
      onUpload,
      fileList,
      baseurl,
      widthcall,
      btnFnn,
      dialogTableVisible,
      dialogFormVisible,
      formLabelWidth,
      form,
      gridData,
    };
  },
});
</script>
<style scoped lang="scss">
@import "../../../tst/src/css/home.scss";
.btn {
  background: $test;
}
.el-col {
  border-radius: 4px;
  margin-top: 20px;
}

.grid-content {
  border-radius: 4px;
  min-width: 100px;
  min-height: 100px;
  background: red;
  /* min-height: 36px; */
  /* width: 100%; */
  /* height: 100%; */
  /* background-color: antiquewhite; */
}
.prss {
  border: 1px red solid;
  width: 100px;
  height: 100px;
}
.attrr {
  // border: 1px red solid;
  height: 60px;
}
</style>