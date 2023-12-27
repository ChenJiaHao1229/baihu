import axios from 'axios'

// 创建axios实例
const instance = axios.create({
  // baseURL: 'https://nxplus.cn', // 替换成你的实际基础URL
  timeout: 5000, // 设置请求超时时间
  headers: {
    'Content-Type': 'application/json' // 设置默认请求头为JSON格式
  }
})

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    // 对响应错误做些什么
    return Promise.reject(error)
  }
)

export default instance
