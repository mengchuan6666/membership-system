import { menuToRoutes, eachTree } from 'ele-admin-plus/es';
import { HOME_PATH, LAYOUT_PATH, REDIRECT_PATH } from '@/config/setting';
import Layout from '@/layout/index.vue';
import RedirectLayout from '@/components/RedirectLayout/index.vue';
const modules = import.meta.glob('/src/views/**/index.vue');

/**
 * 静态路由
 */
export const routes = [
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/regiter',
    component: () => import('@/views/regiter/index.vue'),
    meta: { title: '注册' }
  },
  {
    path: '/home/index',
    component: () => import('@/views/home/index.vue'),
    meta: { title: '首页' }
  },
  {
    path: '/home/activity',
    component: () => import('@/views/home/activity.vue'),
    meta: { title: '活动培训' }
  },
  {
    path: '/home/pay',
    component: () => import('@/views/home/pay.vue'),
    meta: { title: '在线缴费' }
  },
  {
    path: '/home/consult',
    component: () => import('@/views/home/consult.vue'),
    meta: { title: '用户咨询' }
  },
  {
    path: '/home/renzheng',
    component: () => import('@/views/home/renzheng.vue'),
    meta: { title: '资格认定' }
  },
  {
    path: '/home/jifen',
    component: () => import('@/views/home/jifen.vue'),
    meta: { title: '会员积分' }
  },
  // 404
  {
    path: '/:path(.*)*',
    component: () => import('@/views/exception/404/index.vue')
  }
];

/**
 * 根据菜单生成动态路由
 * @param menus 菜单数据
 * @param homePath 主页地址
 */
export function getMenuRoutes(menus, homePath) {
  const childs = [
    // 用于刷新的路由
    {
      path: REDIRECT_PATH + '/:path(.*)',
      component: RedirectLayout,
      meta: { hideFooter: true }
    }
  ];
  const routes = [
    {
      path: LAYOUT_PATH,
      component: Layout,
      redirect: HOME_PATH ?? homePath,
      children: childs
    }
  ];
  // 路由铺平处理
  eachTree(menuToRoutes(menus, getComponent), (route) => {
    const temp = Object.assign({}, route, { children: void 0 });
    if (route.meta?.layout === false) {
      routes.push(temp); // 不需要外层布局的路由
    } else {
      childs.push(temp); // 需要外层布局的路由
    }
  });
  return routes;
}

/**
 * 解析路由组件
 * @param component 组件名称
 */
function getComponent(component) {
  if (component) {
    const module = modules[`/src/views${component}.vue`];
    if (!module) {
      return modules[`/src/views${component}/index.vue`];
    }
    return module;
  }
}
