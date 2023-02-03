module.exports = {
  'parser': '@typescript-eslint/parser', //定义ESLint的解析器
  'extends': ['airbnb-base', 'plugin:@typescript-eslint/recommended'],//定义文件继承的子规范
  'plugins': ['@typescript-eslint'],//定义了该eslint文件所依赖的插件
  'env': {//指定代码的运行环境
    'browser': true,
    'node': true,
    'es2021': true
  },
  'settings': {
    //解决路径引用ts文件报错的问题
    'import/resolver': {
      'node': {
        'extensions': ['.js', '.jsx', '.ts', '.tsx']
      },
      // 解决tsconfig下的path别名导致eslint插件无法解决的bug
      'typescript': {
        'alwaysTryTypes': true
      }
    }
  },
}