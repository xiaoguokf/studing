import type {DefaultTheme} from "vitepress";
type linkItem={
    link:string,
    items:linkItem[];
}
export  class Route {
    name:string;
    nav:DefaultTheme.NavItem
    sidebar:DefaultTheme.SidebarItem[]
    baseUrl:string
}

export function resolve(route: Route) {
    pathResolve(route.nav as linkItem,route.baseUrl)
    route.sidebar.forEach(i=>{
        pathResolve(i as linkItem,route.baseUrl);
    })
}


function pathResolve(item: linkItem,path:string) {
    let linkAddPath=false;
    if (item?.link){
        if (item.link.match("^[^/]")){
            item.link=path+"/"+item.link;
            linkAddPath=true;
        }
    }
    if (item?.items?.length){
        let cPath=join(item.link,linkAddPath?"":path);
        item.items.forEach(c=>pathResolve(c,cPath))
    }
}

function join(path:string,baseUrl:string):string {
   let pathArr=path?.split("/")??[]
    let baseArr=baseUrl?.split("/")??[];
    return [...pathArr,...baseArr].filter(item=>item).join("/")
}