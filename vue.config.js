// const { defineConfig } = require('@vue/cli-service')
// module.exports = defineConfig({
//   transpileDependencies: true,
//   productionSourceMap: false,
//   chainWebpack: config => {
//     config.module.rule('images')
//       .test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)
//       .use('image-webpack-loader')
//       .loader('image-webpack-loader')
//       .options({ bypassOnDebug: true })
//       .end()


//     当环境变量user_analyzer为true使用
//     if (process.env.use_analyzer) {
//       config
//         .plugin('webpack-bundle-analyzer')
//         .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
//     }
//   },

// })
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  productionSourceMap: false,
  chainWebpack: (config) => {
    config.optimization.splitChunks({
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /.(s?css|less|sass)$/,
          chunks: 'all',
          priority: 10
        },
        common: {
          name: 'chunk-common',
          chunks: 'all',
          minChunks: 2, // 拆分前必须共享模块的最小 chunks 数。
          maxInitialRequests: 5, // 打包后的入口文件加载时，还能同时加载js文件的数量（包括入口文件）
          minSize: 0, // 生成 chunk 的最小体积
          priority: 1, // 优化将优先考虑具有更高 priority（优先级）的缓存组
          reuseExistingChunk: true // 如果当前 chunk 包含已从主 bundle 中拆分出的模块，则它将被重用，而不是生成新的模块
        },
        vendors: {
          name: 'chunk-vendors',
          test: /[\/]node_modules[\/]/,
          chunks: 'all',
          priority: 2,
          reuseExistingChunk: true
        },
      }
    })
  },
}
)