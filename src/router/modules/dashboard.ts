import type { Route } from '../index.type'
import Layout from '@/layout/index.vue'
import { createNameComponent } from '../createNode'
import { ElMessage } from "element-plus";
const route: Route[] = [
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    meta: { title: 'message.menu.dashboard.name', icon: 'sfont system-home' },
    children: [
      {
        path: 'dashboard',
        component: createNameComponent(() => import('@/views/main/dashboard/index.vue')),
        meta: { title: 'message.menu.dashboard.index', icon: 'sfont system-home', hideClose: true }
      }
      
    ]
  },
  {
    path: '/document',
    component: Layout,
    redirect: '/document',
    meta: { title: '系统管理', icon: 'sfont system-menu' },
    children: [
      {
        path: 'document',
        component: createNameComponent(() => import('@/views/main/dashboard/document.vue')),
        meta: { title: '文件', icon: 'sfont system-document', hideClose: true }
      },
      // {
      //   path: 'userList',
      //   component: createNameComponent(() => import('@/views/main/dashboard/userList.vue')),
      //   meta: { title: '用户', icon: 'sfont system-xingmingyonghumingnicheng', hideClose: true }
      // },
      {
        path: 'videoList',
        component: createNameComponent(() => import('@/views/main/dashboard/videoList.vue')),
        meta: { title: '媒体', icon: 'sfont system-page', hideClose: true }
      },
      {
        path: 'software',
        component: createNameComponent(() => import('@/views/main/dashboard/software.vue')),
        meta: { title: '软件', icon: 'sfont system-shequ', hideClose: true }
      }
      
    ]
  }
]

export default route