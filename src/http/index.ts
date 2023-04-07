import axios from 'axios'
import router from '../router'

const request = axios.create({
  baseURL:
    'https://www.fastmock.site/mock/b7f10c4a95d7fe55be139cbfad99770d/api',
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
})

request.interceptors.request.use((config) => {
  // config.headers.token = localStorage.getItem('token') //因为模拟接口所以暂时注释
  return config
})
request.interceptors.response.use(
  (res) => {
    if (res.data.code && res.data.code != 200) {
      alert('请求失败')
      return Promise.reject(res.data)
    }
    return res.data
  },
  (err) => {
    console.log(err)
  }
)

export default request
