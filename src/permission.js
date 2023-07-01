import router from './router'
import {ElMessage} from 'element-plus'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import {getToken} from '@/utils/auth'
import {isHttp} from '@/utils/validate'
import {isRelogin} from '@/utils/request'
import useUserStore from '@/store/modules/user'
import useSettingsStore from '@/store/modules/settings'
import usePermissionStore from '@/store/modules/permission'

NProgress.configure({showSpinner: false});

const whiteList = ['/login', '/auth-redirect', '/bind', '/register'];
/**
 * 全局前置守卫
 * 类似Java中的过滤器:当发生页面跳转时 跳转页面行为会被此首位监听到
 * to: 需要去往的页面
 * from: 来的那个页面
 * next: 下一个要执行的函数，类似filterChain中的doFilter
 */
router.beforeEach((to, from, next) => {
    NProgress.start()
    // 获取JWT,存入Cookie中
    if (getToken()) {
        // 设置title
        to.meta.title && useSettingsStore().setTitle(to.meta.title)
        // 登录后无法跳转到登录页.而是去到根目录页
        if (to.path === '/login') {
            next({path: '/'})
            NProgress.done()
        }
        //
        else {
            // Pinia中无用户角色信息
            if (useUserStore().roles.length === 0) {
                isRelogin.show = true
                // 判断当前用户是否已拉取完user_info信息
                useUserStore().getInfo().then(() => {
                    isRelogin.show = false
                    // 加载动态路由信息
                    usePermissionStore().generateRoutes().then(accessRoutes => {
                        // 根据roles权限生成可访问的路由表
                        accessRoutes.forEach(route => {
                            if (!isHttp(route.path)) {
                                router.addRoute(route) // 动态添加可访问路由表
                            }
                        })
                        next({...to, replace: true}) // hack方法 确保addRoutes已完成
                    })
                }).catch(err => {
                    useUserStore().logOut().then(() => {
                        ElMessage.error(err)
                        next({path: '/'})
                    })
                })
            } else {
                next()
            }
        }
    }
    // 没有token
    else {
        // 没有token 没有登录
        if (whiteList.indexOf(to.path) !== -1) {
            // 在免登录白名单，直接进入
            next()
        }
        // 用户在未登录状态但访问需要登录的页面
        else {
            next(`/login?redirect=${to.fullPath}`) // 否则全部重定向到登录页
            NProgress.done()
        }
    }
})

router.afterEach(() => {
    NProgress.done()
})
