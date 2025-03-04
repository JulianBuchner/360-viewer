const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === 'production' ? '/360-viewer/' : '/',
  pwa: {
    name: '360 Image Viewer',
    themeColor: '#121212',
    msTileColor: '#1e1e1e',
    manifestOptions: {
      icons: []
    },
    iconPaths: {
      favicon32: null,
      favicon16: null,
      appleTouchIcon: null,
      maskIcon: null,
      msTileImage: null
    }
  },
});
