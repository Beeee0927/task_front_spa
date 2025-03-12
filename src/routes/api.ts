import { download, get } from '@/utils/request'

export const downloadFile = (id: string) => {
  return download(`/download/${id}`)
}

export const downloadFiles = (ids: string[]) => {
  return Promise.all(ids?.map((id) => downloadFile(id)))
}
