import type {DefaultTheme} from "vitepress/types/default-theme";

let sidebar: DefaultTheme.Sidebar = {
    '/vue3':[
        {
            text: "开始",
            items: [
                {
                    text: "概览",
                    link: "/vue3/index"
                }
            ]
        },
        {
            text: "新增功能",
            items: [
                {
                    text: "全局API",
                    // link: "/vue3/index",
                    items: [
                        {
                            text: "应用实例",
                            link: "/vue3/add/global-api/app.md"
                        }
                    ]
                }
            ]
        }
    ],
    '/groovy':[
        {
            text: "开始",
            items: [
                {
                    text: "概览",
                    link: "/groovy/index"
                }
            ]
        },{
            text: "与java的不同",
            link: "/groovy/groovy-and-java.md"
        }

    ]
}

export default sidebar