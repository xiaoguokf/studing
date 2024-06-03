import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "XiaoGuo Studying",
  description: "小果学习笔记",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Examples", link: "/markdown-examples" },
    ],
    sidebar: [
      {
        text: "Examples",
        items: [
          { text: "Markdown Examples", link: "/markdown-examples" },
          { text: "Runtime API Examples", link: "/api-examples" },
        ],
      },
    ],
    socialLinks: [
      { icon: "github", link: "https://github.com/xiaoguokf/studing" },
    ],
    search: {
      provider: "local",
      options: {
        translations: {
          button: {
            buttonText: "搜索",
          },
          modal: {
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
