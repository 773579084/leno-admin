// webpack.prod.js
const path = require('path')
const { merge } = require('webpack-merge')
const baseConfig = require('./webpack.base.js')
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin')
const WebpackObfuscator = require('webpack-obfuscator');

module.exports = merge(baseConfig, {
  mode: 'production',
  // 配置css模块化生产环境下
  module: {
    rules: [
      {
        test: /\.(css|scss|sass)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                // 默认正则：/\.module\.\w+$/i.test(filename) or /\.icss\.\w+$/i.test(filename)
                auto: true,
                // 自定义输出 css 类名 =》 hash 名称
                localIdentName: '[hash:base64:8]'
              }
            }
          },
          'sass-loader'
        ],
        exclude: /node_modules/
      },
    ]
  },
  plugins: [
    // 防爬虫配置(开启过多可能会导致vscode奔溃，配置后会造成打包时间增长,打包体积增大)
    // new WebpackObfuscator({
    //   rotateStringArray: false, // 是否对字符串数组进行旋转
    //   stringArray: false, // 是否将字符串数组转换为十六进制编码
    //   selfDefending: true, // 是否开启安全防护
    //   compact: true
    // }),
    // 复制文件插件
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, '../public'), // 复制public下文件
          to: path.resolve(__dirname, '../dist'), // 复制到dist目录中
          filter: source => {
            return !source.includes('index.html') // 忽略index.html
          }
        },
        // 复制防爬虫文件到打包完成后的文件中
        {
          from: path.resolve(__dirname, '../robots.txt'),
          to: path.resolve(__dirname, '../dist'),
        }
      ],
    }),
    // 抽离css插件
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[contenthash:8].css'
    }),
    // 打包生成gzip插件
    new CompressionPlugin({
      test: /\.(js|css)$/, // 只生成css,js压缩文件
      filename: '[path][base].gz', // 文件命名
      algorithm: 'gzip', // 压缩格式，默认是gzip
      threshold: 10240, // 只有大小大于该值的资源会被处理。默认值是 10k
      minRatio: 0.8 // 压缩率,默认值是 0.8
    }),
  ],
  // 优化配置
  optimization: {
    minimizer: [
      // 压缩css
      new CssMinimizerPlugin(),
      // 压缩js
      new TerserPlugin({
        parallel: true, // 开启多线程压缩
        terserOptions: {
          compress: {
            pure_funcs: ["console.log"]
          }
        }
      }),
    ],
    splitChunks: { // 分隔代码
      cacheGroups: {
        vendors: { // 提取node_modules代码
          test: /node_modules/, // 只匹配node_modules里面的模块
          name: 'vendors', // 提取文件命名为vendors,js后缀和chunkhash会自动加
          minChunks: 1, // 只要使用一次就提取出来
          chunks: 'initial', // 只提取初始化就能获取到的模块，不管异步的
          minSize: 0, // 提取代码体积大于0就提取出来
          priority: 1, // 提取优先级为1
        },
      }
    }
  },
})
