// webpack.dev.js
const path = require('path')
const { merge } = require('webpack-merge')
const baseConfig = require('./webpack.base.js')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const FriendlyErrorsPlugin = require('@soda/friendly-errors-webpack-plugin');
const { networkInterfaces } = require('os');

// 基本的配置项
const port = 9091

// 合并公共配置，并添加开发环境配置
module.exports = merge(baseConfig, {
  mode: 'development', // 开发模式，不会压缩最终代码
  devServer: {
    host: '0.0.0.0', // host 配置 0.0.0.0 同域网络下其他主机可以访问开发环境项目
    port: port, // 服务端口号
    hot: true,
    open: true, // 编译完是否打开页面
    compress: false, // gzip压缩，开发环境不开启，提升速度
    historyApiFallback: true,// 支持 history 路由重定向到 index.html 文件
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    // 跨域配置
    proxy: {
      '/dev-api': {
        target: 'http://localhost:9090',
        changeOrigin: true, // 是否开启跨域
        pathRewrite: {
          '^/dev-api': '' // 将/dev-api前缀替换为空字符串
        }
      },
    },
    static: { //托管静态资源文件
      directory: path.join(__dirname, "../public"),
    },
  },
  // 配置css模块化开发环境下
  module: {
    rules: [
      {
        test: /\.(css|scss|sass)$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                // 默认正则：/\.module\.\w+$/i.test(filename) or /\.icss\.\w+$/i.test(filename)
                auto: true,
                // 自定义输出 css 类名 =》 hash 名称
                localIdentName: '[path][name]__[local]'
              }
            }
          },
          'sass-loader',
        ],
        exclude: /node_modules/
      },
    ]
  },
  devtool: 'eval-cheap-module-source-map',
  plugins: [
    // 开启react模块热替换插件
    new ReactRefreshWebpackPlugin(),
    new FriendlyErrorsPlugin({
      compilationSuccessInfo: {
        messages: [
          `App runing at:`,
          `Local: \x1b[38;2;39;184;219mhttp://localhost:${port}\x1b[0m`,
          `Network: \x1b[38;2;39;184;219mhttp://${getLocalIpAddress()}:${port}\x1b[0m`,
          ``,
          `Note that the development build is not optimized.`
        ],
      },
      alwaysShowErrors: true // 配置message信息一直最新显示
    }),
  ]
})

function getLocalIpAddress() {
  const interfaces = networkInterfaces();
  for (const interfaceName in interfaces) {
    const interface = interfaces[interfaceName];
    for (const subInterface of interface) {
      if (subInterface.family === 'IPv4' && !subInterface.internal) {
        return subInterface.address;
      }
    }
  }
}
