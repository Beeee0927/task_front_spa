import { appTools, defineConfig } from '@modern-js/app-tools'
import { tailwindcssPlugin } from '@modern-js/plugin-tailwindcss'

// https://modernjs.dev/en/configure/app/usage
export default defineConfig({
  runtime: {
    router: true
  },
  plugins: [
    appTools({
      bundler: 'rspack'
    }),
    tailwindcssPlugin()
  ],
  html: {
    title: '翼灵任务系统'
  }
})
