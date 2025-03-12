import { post } from '@/utils/request'

export const api_getMessages = (data?: any) => {
  return post('/getMessage', data)
}

export const api_readMessage = (data?: any) => {
  return post('/readMessage', data)
}

export const api_readAllMessage = (data?: any) => {
  return post('/readAllMessage', data)
}
