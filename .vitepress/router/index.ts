import {groovy} from "./route/groovy";
import {vue3} from "./route/vue3";
import {k8s} from "./route/k8s";
import {resolve} from "./base/common";
let arr=[];
export default arr
arr.push(vue3)
arr.push(groovy)
arr.push(k8s)
arr.forEach(resolve)
