import { post } from '@/utils/request'

export const api_resetPassword = (data: any) => {
  return post('/resetPassword', data)
}
