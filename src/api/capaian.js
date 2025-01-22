import request from '@/utils/request'

const pathParent = '/kinerja'

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


export function editStatus(data) {
  return request({
    url: pathParent + '/update_status.php',
    method: 'post',
    data
  })
}
