import {Route} from "../base/common";

export const groovy:Route={
    name:"groovy",
    baseUrl:'/groovy',
    nav:{
        text: "groovy",
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
            text: "语法",
            items: [
                {
                    text: "基础语法",
                    link: "syntax/base"
                }
            ]
        },
        {
            text: "与java的不同",
            link: "groovy-and-java"
        }

    ]
}