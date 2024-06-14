import {defineConfig, defineConfigWithTheme} from "vitepress";
import nav from "./router/nav";
import sidebar from "./router/sidebar";


// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "XiaoGuo Studying",
  description: "小果学习笔记",
  lang:"zh-CN",
  srcDir:"src",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav,
    sidebar: sidebar,
    sidebarMenuLabel:'菜单',
    darkModeSwitchLabel:"外观",
    darkModeSwitchTitle:"暗夜模式",
    lightModeSwitchTitle:"白日模式",
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

      provider: "algolia",
      options: {
        appId:"1XX8KDHP2P",
        indexName:"studying-sshine",
        apiKey:"95f4069c538b24653a209a2bef169a05",
        placeholder:"搜索文档",
        translations: {
          button: {
            buttonText: "搜索",
            buttonAriaLabel:"搜索文档"
          },
          modal: {
            searchBox:{
              resetButtonTitle: '清除查询条件',
              resetButtonAriaLabel: '清除查询条件',
              cancelButtonText: '取消',
              cancelButtonAriaLabel: '取消'
            },
            startScreen:{
              noRecentSearchesText:"没有最近的搜索",
              recentSearchesTitle:"搜索历史",
              saveRecentSearchButtonTitle:"保存到搜索历史",
              removeRecentSearchButtonTitle:"从搜索历史中删除",
              favoriteSearchesTitle:"收藏",
              removeFavoriteSearchButtonTitle:"从收藏中删除"
            },
            noResultsScreen:{
              noResultsText:"无法找到相关结果",
              suggestedQueryText:"你可以尝试查询"
            },
            footer: {
              navigateText: "切换",
              selectText: "选择",
              closeText: "关闭",
              searchByText:"搜索供应商",
            },
          },
        },
      },
    },
  },
});
