import { message } from 'antd'
import { useLocalStore } from '../store'
import { useRouterStore } from '../store'

let baseUrl = 'http://localhost:8000'
if (process.env.NODE_ENV === 'production') {
  baseUrl = 'http://122.51.255.180:8000'
}

async function request(url: string, init?: RequestInit) {
  const res = await fetch(baseUrl + url, {
    ...init,
    headers: {
      ...init?.headers,
      sessionId: useLocalStore.getState().sessionId.toString()
    }
  })

  if (!res.ok) {
    message.error(res.statusText)
    if (res.status === 401) useRouterStore.getState().trigger()
  }
  return res
}

export async function download(url: string, params?: Record<string, any>) {
  const queryString = new URLSearchParams(params).toString()
  const res = await request(url + (params ? '?' + queryString : ''))

  const filename = res.headers.get('filename')
  const blob = await res.blob()
  return new File([blob], filename ?? 'file', { type: blob.type })
}

async function parseJson(response: Promise<Response>) {
  return (await response).json() as Promise<{
    status: number
    message: string
    code: number
    data: { [key: string]: any }
  }>
}

export async function get(url: string, params?: Record<string, any>) {
  const queryString = new URLSearchParams(params).toString()
  return parseJson(request(url + (params ? '?' + queryString : '')))
}

export async function post(url: string, data: object) {
  return parseJson(
    request(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    })
  )
}

export async function formPost(url: string, data: object) {
  const formData = new FormData()
  Object.entries(data).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => {
        formData.append(key, item)
      })
    } else {
      formData.append(key, JSON.stringify(value))
    }
  })

  return parseJson(
    request(url, {
      method: 'POST',
      body: formData
    })
  )
}
