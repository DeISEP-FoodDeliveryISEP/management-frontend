import { $axios } from "../common/request"

// getSetMealByPage
export const getSetmealPage = (params) => {
  return $axios({
    url: '/setmeal/page',
    method: 'get',
    params
  })
}

// DeleteSetMeal
export const deleteSetmeal = (ids) => {
  return $axios({
    url: '/setmeal',
    method: 'delete',
    params: { ids }
  })
}

// EditSetMeal
export const editSetmeal = (params) => {
  return $axios({
    url: '/setmeal',
    method: 'put',
    data: { ...params }
  })
}

// addSetMeal
export const addSetmeal = (params) => {
  return $axios({
    url: '/setmeal',
    method: 'post',
    data: { ...params }
  })
}

// query setmeal detail
export const querySetmealById = (id) => {
  return $axios({
    url: `/setmeal/listById?id=${id}`,
    method: 'get'
  })
}

// activate/deactive in batch
export const setmealStatusByStatus = (params) => {
  return $axios({
    url: `/setmeal/status/${params.status}`,
    method: 'post',
    params: { ids: params.id }
  })
}
