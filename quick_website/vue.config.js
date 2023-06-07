const {defineConfig} = require('@vue/cli-service')
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      fallback: {
        crypto: require.resolve('crypto-browserify'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        os: require.resolve('os-browserify/browser'),
        stream: require.resolve('stream-browserify'),
      },
    },
    plugins: [
      new NodePolyfillPlugin(),
    ]
  },
  /*
  devServer: {
    host: '127.0.0.1',
    port: 8080,
    https: false,
    public: 'http://localhost:8080/'
  }
  */
})