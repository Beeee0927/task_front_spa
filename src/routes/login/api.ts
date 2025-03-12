import { post } from '@/utils/request'

export const api_login = async (username: string, password: string) => {
  return post('/login', { username, password })
}
