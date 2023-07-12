module.exports = {
    apps: [{
        name: 'leno_admin_server',
        script: './dist/main.js',
        // 因为PM2并不会按照日志输出日志文件，所以用我自身配置的日期文件
        error_file: './logs/error.log', // 错误日志文件路径
        out_file: './logs/out.log', // 标准输出日志文件路径
        env: {
            NODE_ENV: 'production'
        }
    }]
}
