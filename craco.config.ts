import path from 'path'

const CracoLessPlugin = require('craco-less')

module.exports = {
  // less
  plugins: [{ plugin: CracoLessPlugin }],
  // webpack
  webpack: {
    alias: {
      '@': path.join(__dirname, 'src')
    }
  },
  include: ['src/**/*', '/back/**/*'],
  exclude: ['node_modules']
}
