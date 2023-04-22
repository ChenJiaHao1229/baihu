import path from 'path'

const CracoLessPlugin = require('craco-less')

module.exports = {
  // less
  plugins: [{ plugin: CracoLessPlugin }],
  // webpack
  webpack: {
    alias: {
      '@': path.join(__dirname, 'src')
    },
    configure: (webpackConfig: any, { paths }: { paths: any }) => {
      // 修改build的生成文件名称
      paths.appBuild = './dist/public'
      webpackConfig.output = {
        ...webpackConfig.output,
        path: path.resolve(__dirname, './dist/public'),
        publicPath: '/'
      }
      return webpackConfig
    }
  },
  include: ['src/**/*'],
  exclude: ['node_modules']
}
