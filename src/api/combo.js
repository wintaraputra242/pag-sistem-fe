import request from '@/utils/request'

const pathParent = '/combo'

export function cabang(params) {
  return request({
    url: pathParent + '/cabang.php',
    method: 'get',
    params
  })
}
