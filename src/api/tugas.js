import request from '@/utils/request'

const pathParent = '/tugas'

export function get(params) {
  return request({
    url: pathParent + '/read.php',
    method: 'get',
    params
  })
}

export function upload(data) {
  return request({
    url: pathParent + '/upload.php',
    method: 'post',
    data
  })
}

export function uploadTambahan(data) {
  return request({
    url: pathParent + '/upload_tambahan.php',
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
