import { $axios } from "../common/request";

// getOrderDetails
export const getOrderDetailPage = (params) => {
  return $axios({
    url: '/order/page',
    method: 'get',
    params
  })
}

// getOrdersById
export const queryOrderDetailById = (id) => {
  return $axios({
    url: `/orderDetail/${id}`,
    method: 'get'
  })
}

// cancel, deliver, complete
export const editOrderDetail = (params) => {
  return $axios({
    url: '/order',
    method: 'put',
    data: { ...params }
  })
}
