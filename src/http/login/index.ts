import request from '../index'

export function login() {
  return request({
    url: '/api/getorderList',
    method: 'get'
  })
}
