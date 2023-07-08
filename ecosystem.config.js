module.exports = {
    apps: [
        {
            // 指定应用程序的名称。这个名称将用于在 PM2 的进程列表中标识和管理应用程序。
            name: 'leno-admin-01',
            // 指定要运行的应用程序的入口文件或命令。可以是相对路径或绝对路径。
            interpreter: './node_modules/.bin/ts-node',
            interpreter_args: "-P ../ -r tsconfig-paths/register",
            script: 'src/main.ts',
            // 用于指定应用程序的执行模式
            // fork:PM2 会为每个应用程序创建一个独立的进程。每个进程都独立运行
            // cluster：PM2 使用 Node.js 的集群模块，将应用程序分配到多个子进程中。这些子进程可以共享同一个端口，实现负载均衡和高可用性。 
            exec_mode: "cluster",
            // instances 指定创建子进程数量
            instances: 2,
            // // 用于指定在应用程序崩溃或异常退出后，PM2 将在重新启动应用程序之前等待的时间间隔
            // restart_delay: 3000,
            // // 指定是否监听应用程序的文件变化，以便在文件发生变化时自动重新启动应用程序。可以是布尔值 true 或 false，也可以是要监视的文件或目录的数组。
            // watch: true,
            // // 不见听哪些文件
            // ignore_watch: ['node_modules'],
        }
    ]
}
