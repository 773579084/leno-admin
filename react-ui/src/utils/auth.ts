import Cookies from 'js-cookie'
import useStore from '@/store'
import { toJS } from 'mobx'

const TokenKey = 'leno_admin_token'

/* Token */
export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token: string) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

/**
 * 权限字符判断
 * @param perm
 * @returns boolean
 */
export function hasPermi(perm: string) {
  const {
    useUserStore: { permissions },
  } = useStore()

  const permList = toJS(permissions)
  if (permList[0] === '*:*:*') return false
  return !permList.some((item) => item === perm)
}
