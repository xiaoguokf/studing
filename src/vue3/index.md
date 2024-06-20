# vue3迁移
vue3相比vue2进行了非常大的改变，根据ES6规范进行重构，在性能，体积，规范方面得到了有效的提升。

## vue3与vue2的区别

### 打包工具

vue3使用了vite进行打包，vite采用了ES6规范进行模块化，使得开发速率得到较大的提升。因为模块化，使得配置能够能够热更新，用户无重启即可修改掉vite的配置。


### 响应式原理

在 JavaScript 中有两种劫持 property 访问的方式：getter / setters 和 Proxies。

使用Proxy将数据进行拦截，遵循设计模式（就是代理模式），使得更加语义化。

Vue 2 使用 getter / setters 完全是出于支持旧版本浏览器的限制。而在 Vue 3 中则使用了 Proxy 来创建响应式对象，仅将 getter / setter 用于 ref。


### tree-sharking 摇树优化

vue3相对于vue2，进行了更加高度的模块化，使得在打包时，在支持的打包软件（如：webpack vite）能够进行摇树优化。缩减包的体积。


### TS支持优化

vue3使用setup，这种方式将声明式变为组合式，使得数据具有更好的声明，开发变得规范化。


## 框架升级

更新到vue3之后对应的生态要切换为新版本，以获得最新的支持

新版本的 Router, Devtools & test utils 来支持 Vue

构建工具链: Vue CLI -> Vite

状态管理: Vuex -> Pinia

IDE 支持: Vetur -> Volar

新的 TypeScript 命令行工具: vue-tsc

静态网站生成: VuePress -> VitePress

JSX: @vue/babel-preset-jsx -> @vue/babel-plugin-jsx


## 总结

vue3相对于vue2具有相对较大的修改，篇幅较多，本文将以 `新增` `修改` `移除`三大部分进行讲述vue的变化
