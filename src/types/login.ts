// 创建多个ts文件，提供给每个页面使用接口和变量和函数等（数据都可以放到此文件维护）
import router from '../router'
import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
// 提前创建好接口，设置好数据类型
interface loginFnn {
  username: string
  password: string
}

// 首页需要使用username和password在这里是为了抽离模块化，将变量在这里声明
export class InitData {
  ruleForm: loginFnn = {
    username: 'admin',
    password: '123',
  }
  ruleFormRef = ref<FormInstance>() //目前是空的，但是赋值的时候必须是form表单类型，
}

//点击事件
export class InitFnn {
  submitForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    // 验证开始
    formEl.validate((valid) => {
      if (valid) {
        localStorage.setItem('token', '测试token数据')
        router.replace({ path: 'order', replace: true })
        ElMessage.success('登录成功')
      } else {
        console.log('登录失败')
        return false
      }
    })
  }
}
