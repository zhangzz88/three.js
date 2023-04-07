import 'bootstrap/dist/css/bootstrap.min.css'
import { createApp } from 'vue'
import ElementPlus, { ElStep } from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/el-loading.css'
import 'element-plus/theme-chalk/display.css'
import 'element-plus/theme-chalk/el-message.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'
import router from './router'
import store from './store'
const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(ElementPlus).use(store).use(router).mount('#app')

import 'bootstrap/dist/js/bootstrap.js'
