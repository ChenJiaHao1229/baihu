import axios, { AxiosRequestHeaders } from 'axios'
import constant from '@/utils/constant'
import { message } from 'antd'
import eventBus from '@/utils/eventBus'

const request = axios.create({
  baseURL: constant.apiPrefix,
  timeout: 60 * 1000
})

// http request 拦截器
request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(constant.authToken)
    if (token) {
      config.headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...config.headers
      } as AxiosRequestHeaders
    }
    return config
  },
  (err) => {
    return err
  }
)

// http response 拦截器
request.interceptors.response.use(
  (res) => res.data,
  (err) => {
    try {
      const { status, data, statusText } = err?.response
      message.error(`${data?.message || statusText || err?.message || err}`)
      if ([502, 504].includes(status)) {
        eventBus.$emit('navigate', `/error`)
      } else if (status === 401) {
        if (location.pathname !== '/login') {
          localStorage.removeItem(constant.authToken)
          eventBus.$emit('navigate', `/login`)
        }
      }
      return Promise.reject(err)
    } catch (error) {}
  }
)

export default request
