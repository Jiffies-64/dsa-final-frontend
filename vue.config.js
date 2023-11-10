const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
    host: '127.0.0.1',
    port: 8080,
    // client: {
    //   webSocketURL: 'ws://127.0.0.1:5000/llm',
    // },
    // headers: {
    //   'Access-Control-Allow-Origin': '*',
    // }
  }
})
