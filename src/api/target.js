import request from '@/utils/request'

const pathParent = '/target'
const pathParentDetail = '/target_detail'

export function get(params) {
  return request({
    url: pathParent + '/read.php',
    method: 'get',
    params
  })
}

export function create(data) {
  return request({
    url: pathParent + '/add.php',
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: pathParent + '/edit.php',
    method: 'post',
    data
  })
}

export function remove(data) {
  return request({
    url: pathParent + '/delete.php',
    method: 'post',
    data
  })
}

export function getDetail(params) {
  return request({
    url: pathParentDetail + '/read.php',
    method: 'get',
    params
  })
}

export function editDetail(data) {
  return request({
    url: pathParentDetail + '/edit.php',
    method: 'post',
    data
  })
}

export function removeDetail(data) {
  return request({
    url: pathParentDetail + '/reset_target.php',
    method: 'post',
    data
  })
}
