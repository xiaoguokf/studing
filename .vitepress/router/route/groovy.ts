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
            text: "语言特性",
            items: [
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
                    text: "语义",
                    items: [
                        {
                            text: "基础语义",
                            link: "semantics/index"
                        }
                    ]
                },    {
                    text: "运算符",
                    items: [
                        {
                            text: "基础运算符",
                            link: "operators/index"
                        }
                    ]
                },
            ]
        },
        {
            text: "与java的不同",
            link: "groovy-and-java"
        }

    ]
}