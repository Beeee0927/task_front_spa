import { post } from '@/utils/request'

export const api_addTask = async (data: any) => {
  return post('/addTask', data)
}

export const api_updateTask = async (data: any) => {
  return post('/updateTask', data)
}
