import {Route} from "../base/common";

export let k8s: Route = {
    name: "k8s",
    baseUrl: '/k8s',
    nav: {
        text: "k8s",
        link: "overview/index.md"
    },
    sidebar:  [
            {
                text: "概述",
                link: 'overview',
                items: [
                    {text: 'k8s组件', link: 'k8s-component.md'},
                    {text: 'k8s对象', link: 'k8s-object.md'}
                ]
            },
            {
                text: "调度和抢占",
                items: [
                    {text: 'pod委派', link: 'scheduling-eviction/选择器与pod委派.md'},
                ]
            },
            {
                text: "工作负载",
                items: [
                    {text: 'pod', link: 'workloads/pod.md'},
                ]
            },
        ]
}
