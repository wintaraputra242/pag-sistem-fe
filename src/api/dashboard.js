import request from '@/utils/request'

const pathParent = '/dashboard'

export function get(params) {
  return request({
    url: pathParent + '/read.php',
    method: 'get',
    params
  })
}

export function getDetail(params) {
  return request({
    url: pathParent + '/detail.php',
    method: 'get',
    params
  })
}
