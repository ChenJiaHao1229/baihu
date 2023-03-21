import { createProxyMiddleware } from 'http-proxy-middleware'
import constant from './utils/constant'

module.exports = function (app) {
  app.use(
    createProxyMiddleware(constant.apiPrefix, {
      target: 'http://localhost:5600',
      secure: false,
      changeOrigin: true,
      pathRewrite: {
        [`^${constant.apiPrefix}`]: ''
      }
    })
  )
}
