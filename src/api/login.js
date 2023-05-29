import { $axios } from "../common/request"

export function loginApi(data) {
  return $axios({
    'url': '/employee/login',
    'method': 'post',
    data
  })
}

export function logoutApi(){
  return $axios({
    'url': '/employee/logout',
    'method': 'post',
  })
}
