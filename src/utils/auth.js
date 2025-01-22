import Cookies from 'js-cookie'

const TokenKey = 'session-cookie'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token, { expires: '' })
}

// export function setToken(token, status) {
//   return Cookies.set(TokenKey, token, { expires: status === 'office' ? '' : 60 * 60 * 18 })
// }

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function setUserinfo(params) {
  const { username, nama, level, id_level, id_cabang, cabang, unit_a, unit_b, unit_c } = params
  const newParams = { username, nama, level, levelNum: id_level, cabangNum: id_cabang, cabang, unit_a, unit_b, unit_c }
  for (const [key, value] of Object.entries(newParams)) {
    Cookies.set(key, value, { expires: 60 * 60 * 18 })
  }
}

// export function setUserinfo(params, status) {
//   for (const [key, value] of Object.entries(params)) {
//     Cookies.set(key, value, { expires: status === 'office' ? '' : 60 * 60 * 18 })
//   }
// }

