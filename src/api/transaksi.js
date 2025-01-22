import request from '@/utils/request'

export const readTransaktionData = data => {
  return request({
    url: '/data_transaksi',
    method: 'post',
    data
  })
}

export const exportTransaktionData = data => {
  return request({
    url: '/export_transaksi',
    method: 'post',
    data
  })
}
