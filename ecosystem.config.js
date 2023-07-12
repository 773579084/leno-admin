module.exports = {
    apps: [{
        name: 'leno_admin_server',
        script: './dist/main.js',
        error_file: './pm2logs/error.log', // 错误日志文件路径
        out_file: './pm2logs/out.log', // 标准输出日志文件路径
        env: {
            NODE_ENV: 'production'
        }
    }]
}
