/**
 * 全局引入方式
 */
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@/': resolve('src') + '/',
      './as-needed': './global-import'
    }
  },
  plugins: [vue()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles/variables.scss" as *;`
      }
    }
  },
  optimizeDeps: {
    include: [
      'echarts/core',
      'echarts/charts',
      'echarts/renderers',
      'echarts/components',
      'vue-echarts',
      'echarts-wordcloud',
      'vuedraggable',
      'sortablejs',
      'xlsx'
    ]
  }
});
