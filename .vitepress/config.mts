import { defineConfig } from 'vitepress'
import { sidebarCn, sidebarEn } from './sidebar'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "GridBeat",
  description: "GridBeat 产品文档",
  ignoreDeadLinks: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [],
    sidebar: sidebarEn,
    socialLinks: [
      { icon: 'github', link: 'https://github.com/truenvr/gridbeat' }
    ]
  },
  locales: {
    root: {
      label: 'English',
      lang: 'en',
      link: '/en_US',
    },
    zh_CN: {
      label: '中文',
      lang: 'zh_CN', // 可选，将作为 `lang` 属性添加到 `html` 标签中
      link: '/zh_CN', // 默认 /fr/ -- 显示在导航栏翻译菜单上，可以是外部的
      themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
      nav: [],
        sidebar: sidebarCn,
        socialLinks: [
          { icon: 'github', link: 'https://github.com/truenvr/gridbeat' }
        ]
      },
    }
  }
})
