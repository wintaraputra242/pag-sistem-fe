import request from '@/utils/request'

const pathParent = '/profile'

export function get() {
  return request({
    url: pathParent + '/read.php',
    method: 'get'
  })
}

export function edit(data) {
  return request({
    url: pathParent + '/edit.php',
    method: 'post',
    data
  })
}
