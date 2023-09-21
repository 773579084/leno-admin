module.exports = {
  parser: '@typescript-eslint/parser', // 定义ESLint的解析器
  extends: ['airbnb-base', 'plugin:@typescript-eslint/recommended', "eslint:recommended", "prettier"],// 定义文件继承的子规范
  plugins: ['@typescript-eslint', "import"],// 定义了该eslint文件所依赖的插件
  env: {// 指定代码的运行环境
    'browser': true,
    'node': true,
    'es2021': true
  },
  settings: {
    // 解决路径引用ts文件报错的问题
    'import/resolver': {
      alias: {
        map: [['@', `${__dirname}/src`], ["socket.io", "socket.io-client"]],
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.d.ts'],
      },
      node: { extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'], },
      // 解决tsconfig下的path别名导致eslint插件无法解决的bug
      typescript: { 'alwaysTryTypes': true },
    },
  },
  // 不检查sql类型文件
  ignorePatterns: ["**/*.sql", "build/*"],
  rules: {
    // 关闭行尾规则
    "linebreak-style": "off",
    // 允许导入时省略文件扩展名
    'import/extensions': [
      "error",
      "ignorePackages",
      {
        "ts": "never",
        "tsx": "never"
      }
    ],
    // 允许大括号前后空格
    "object-curly-newline": ["error", { "consistent": true }],
    // 允许函数省略return语句
    "consistent-return": "off",
    // 允许console
    "no-console": "off",
    "max-len": ["error", {
      "code": 200,
      "tabWidth": 2, // 可选，根据你的项目配置
      // "ignoreUrls": true, // 可选，如果你希望忽略URL的长度
      // "ignoreTemplateLiterals": true // 可选，如果你希望忽略模板字面量的长度
    }],
    "no-restricted-syntax": ["error", "FunctionExpression", "WithStatement", "BinaryExpression[operator='in']"],
    'camelcase': 'off',
    "no-unused-vars": [
      "warn",
      {
        "vars": "local",
        "args": "none"
      }
    ],
    'no-template-curly-in-string': 'off',
    // 允许短路 允许三元运算
    "no-unused-expressions": ["error", { "allowShortCircuit": true, "allowTernary": true }],
    // 不优先使用默认导出
    "import/prefer-default-export": "off",
    // 允许循环
    "no-labels": ["error", { "allowLoop": true }],
    // 允许空捕获
    "no-empty": ["error", { "allowEmptyCatch": true }],
    "import/no-extraneous-dependencies": 'off'
  },
}
