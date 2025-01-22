import request from '@/utils/request'

const pathParent = '/report'

export function get(params) {
  return request({
    url: pathParent + '/read.php',
    method: 'get',
    params
  })
}

export function getDetailCabang(params) {
  return request({
    url: pathParent + '/read_detail_cabang.php',
    method: 'get',
    params
  })
}

export function getDetailSA(params) {
  return request({
    url: pathParent + '/read_detail_sa.php',
    method: 'get',
    params
  })
}

export function getDetailSV(params) {
  return request({
    url: pathParent + '/read_detail_sv.php',
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