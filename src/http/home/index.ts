import request from '../index'
import axios from 'axios'
// 获取order列表
export function getOrderList() {
  return request({
    url: '/api/getorderList',
    method: 'get',
  })
}

//获取用户列表
export function getUserList() {
  return request({
    url: '/userList',
    method: 'get',
  })
}

//获取用户列表
export function getRoleList() {
  return request({
    url: '/roleList',
    method: 'get',
  })
}

// 获取权限列表
export function getauthorityList() {
  return request({
    url: '/authorityList',
    method: 'get',
  })
}

// 上传文件
export function postUpdata(data: any) {
  const http = axios.create({
    baseURL: 'http://localhost:8000',
  })
  return http({
    url: '/upload_video',
    method: 'POST',
    data,
  })
}
