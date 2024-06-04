import { defineConfig } from "vitepress";
import nav from "./router/nav";
import sidebar from "./router/sidebar";
// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "XiaoGuo Studying",
  description: "小果学习笔记",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav,
    sidebar: sidebar,
    socialLinks: [
      { icon: "github", link: "https://github.com/xiaoguokf/studing" },
    ],docFooter:{
      next:"下一页",
      prev:"上一页"
    },
    lastUpdated:{
      text:"上次更新"
    },
    outline: {
      level: "deep", // 右侧大纲标题层级
      label: "目录", // 右侧大纲标题文本配置
    },
    returnToTopLabel: '返回顶部',
    search: {
      provider: "local",
      options: {
        translations: {
          button: {
            buttonText: "搜索",
          },
          modal: {
            noResultsText: "无法找到相关结果",
            footer: {
              navigateText: "切换",
              selectText: "选择",
              closeText: "关闭",
            },
          },
        },
      },
    },
  },
});
