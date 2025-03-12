import { post } from '@/utils/request'

export const api_getTaskList = async (data: any) => {
  return post('/getTaskList', data)
}

export const api_getTaskDetail = async (data: any) => {
  return post('/getTaskDetail', data)
}
