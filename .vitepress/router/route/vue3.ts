import {Route} from "../base/common";
export let vue3:Route={
    name:"vue3迁移",
    baseUrl:'/vue3',
    nav:{
        text: "vue3迁移",
        link: "index"
    },
    sidebar:[
        {
            text: "开始",
            items: [
                {
                    text: "概览",
                    link: "index"
                }
            ]
        },
        {
            text: "新增功能",
            items: [
                {
                    text: "全局API",
                    items: [
                        {
                            text: "应用实例",
                            link: "add/global-api/app.md"
                        }
                    ]
                }
            ]
        }
    ]
}