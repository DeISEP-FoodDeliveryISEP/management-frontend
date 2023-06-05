import { $axios } from "../common/request"

// download preview
export const commonDownload = (params) => {
  return $axios({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
    url: '/common/download',
    method: 'get',
    params
  })
}

export const imageUpload = (file) => {
  return $axios({
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    url: '/common/upload',
    method: 'post',
    data: {file: file}
  })
}