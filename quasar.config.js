const { defineConfig } = require('vite');
const vue = require('@vitejs/plugin-vue');
const { quasar, transformAssetUrls } = require('@quasar/vite-plugin');

module.exports = defineConfig({
  plugins: [
    vue({
      template: { transformAssetUrls }
    }),
    quasar({
      sassVariables: 'src/quasar-variables.sass'
    })
  ]
});