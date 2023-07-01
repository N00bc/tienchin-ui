import auth from '@/plugins/auth'
import router, {constantRoutes, dynamicRoutes} from '@/router'
import {getRouters} from '@/api/menu'
import Layout from '@/layout/index'
import ParentView from '@/components/ParentView'
import InnerLink from '@/layout/components/InnerLink'

// 匹配views里面所有的.vue文件
const modules = import.meta.glob('./../../views/**/*.vue')

const usePermissionStore = defineStore(
    'permission',
    {
        state: () => ({
            routes: [], // 1.HeaderSearch时使用 2.TagView中使用  并不涉及页面渲染,单纯只处理页面逻辑
            addRoutes: [], // 暂无具体使用场景
            defaultRoutes: [], // 1~n级菜单 是完整菜单项的备份
            topbarRouters: [], // 如果开启了TopNavi,顶部1级菜单就由此渲染
            sidebarRouters: [] // 左侧导航栏。在不开启TopNavi时候,存放1~n级菜单.开启TopNavi后存放2~n级菜单
        }),
        actions: {
            setRoutes(routes) {
                this.addRoutes = routes
                this.routes = constantRoutes.concat(routes)
            },
            setDefaultRoutes(routes) {
                this.defaultRoutes = constantRoutes.concat(routes)
            },
            setTopbarRoutes(routes) {
                this.topbarRouters = routes
            },
            setSidebarRouters(routes) {
                this.sidebarRouters = routes
            },
            generateRoutes(roles) {
                return new Promise(resolve => {
                    // 向后端请求路由数据
                    getRouters().then(res => {

                        const sdata = JSON.parse(JSON.stringify(res.data))
                        const rdata = JSON.parse(JSON.stringify(res.data))
                        const defaultData = JSON.parse(JSON.stringify(res.data))
                        const sidebarRoutes = filterAsyncRouter(sdata)
                        // rewriteRoutes 是将3~n级菜单变为2级菜单
                        const rewriteRoutes = filterAsyncRouter(rdata, false, true)
                        const defaultRoutes = filterAsyncRouter(defaultData)
                        // 根据用户权限,获取动态路由
                        const asyncRoutes = filterDynamicRoutes(dynamicRoutes)
                        asyncRoutes.forEach(route => {
                            // 将当前用户具有权限所对应的路由添加到路由中
                            router.addRoute(route)
                        })
                        this.setRoutes(rewriteRoutes)
                        this.setSidebarRouters(constantRoutes.concat(sidebarRoutes))
                        // 最完整的路由
                        this.setDefaultRoutes(sidebarRoutes)
                        this.setTopbarRoutes(defaultRoutes)
                        resolve(rewriteRoutes)
                    })
                })
            }
        }
    })

/**
 * 遍历后台传来的路由(component)字符串，转换为 component 组件对象
 * @param asyncRouterMap 服务端返回的动态菜单 JSON
 * @param lastRouter 是否是最后一个路由
 * @param type 是否需要 children 铺平操作
 * @returns {*}
 */
function filterAsyncRouter(asyncRouterMap, lastRouter = false, type = false) {
    return asyncRouterMap.filter(route => {
        if (type && route.children) {
            route.children = filterChildren(route.children)
        }
        if (route.component) {
            // Layout ParentView InnerLink组件特殊处理
            if (route.component === 'Layout') {
                route.component = Layout
            } else if (route.component === 'ParentView') {
                route.component = ParentView
            } else if (route.component === 'InnerLink') {
                route.component = InnerLink
            } else {
                // 将 component 字符串转换成已有组件
                route.component = loadView(route.component)
            }
        }
        if (route.children != null && route.children && route.children.length) {
            route.children = filterAsyncRouter(route.children, route, type)
        } else {
            delete route['children']
            delete route['redirect']
        }
        return true
    })
}

/**
 * 菜单铺平操作
 * 1.将 3~n级菜单变成2级菜单
 * 2.重新生成3~n级的path属性为 父path/path
 * @param childrenMap
 * @param lastRouter
 * @returns {*[]}
 */
function filterChildren(childrenMap, lastRouter = false) {
    var children = []
    childrenMap.forEach((el, index) => {
        if (el.children && el.children.length) {
            if (el.component === 'ParentView' && !lastRouter) {
                el.children.forEach(c => {
                    c.path = el.path + '/' + c.path
                    if (c.children && c.children.length) {
                        children = children.concat(filterChildren(c.children, c))
                        return
                    }
                    children.push(c)
                })
                return
            }
        }
        if (lastRouter) {
            el.path = lastRouter.path + '/' + el.path
        }
        children = children.concat(el)
    })
    return children
}

// 动态路由遍历，验证是否具备权限
export function filterDynamicRoutes(routes) {
    const res = []
    routes.forEach(route => {
        if (route.permissions) {
            if (auth.hasPermiOr(route.permissions)) {
                res.push(route)
            }
        } else if (route.roles) {
            if (auth.hasRoleOr(route.roles)) {
                res.push(route)
            }
        }
    })
    return res
}

/**
 * 动态加载component
 * @param view
 * @returns {function(): Promise<string extends keyof KnownAsTypeMap ? KnownAsTypeMap[string] : unknown>}
 */
export const loadView = (view) => {
    let res;
    // modules中是所有component
    for (const path in modules) {
        // dir格式就是sys_menu中 component 字段
        const dir = path.split('views/')[1].split('.vue')[0];
        if (dir === view) {
            res = () => modules[path]();
        }
    }
    return res;
}

export default usePermissionStore
