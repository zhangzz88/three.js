// 全部是动态路由
export const DynamicRouting = [
  {
    path: '/order',
    name: 'order',
    meta: {
      isShow: true,
      title: '订单列表',
      icon: 'Document',
    },
    component: () => import('../views/OrderView.vue'),
  },
  {
    path: '/list',
    name: 'list',
    meta: {
      isShow: true,
      title: '用户列表',
      icon: 'User',
    },
    component: () => import('../views/ListView.vue'),
  },
  {
    path: '/role',
    name: 'role',
    meta: {
      isShow: true,
      title: '角色管理列表',
      icon: 'Notification',
    },
    component: () => import('../views/RoleView.vue'),
  },
  {
    path: '/authority',
    name: 'authority',
    meta: {
      isShow: false,
      title: '角色的权限管理',
      icon: 'View',
    },
    component: () => import('../views/authorityView.vue'),
  },

  {
    path: '/three.js',
    name: 'three.js',
    meta: {
      isShow: true,
      title: 'three.js',
      icon: 'View',
    },
    children: [
      {
        path: '/threeDemo',
        name: 'threeDemo',
        meta: {
          isShow: true,
          title: 'threeJsDemo',
          icon: 'View',
          father: 'three.js',
        },
        component: () => import('../views/UploadView.vue'),
        children: [],
      },
      {
        path: '/3d',
        name: '3d',
        meta: {
          isShow: true,
          title: '3d看房Demo',
          icon: 'View',
          father: 'three.js',
        },
        component: () => import('../views/3dView.vue'),
        children: [],
      },
      {
        path: '/geometry',
        name: 'geometry',
        meta: {
          isShow: true,
          title: '画线demo',
          icon: 'View',
          father: 'three.js',
        },
        component: () => import('../views/shaderView.vue'),
        children: [],
      },
    ],
  },
  {
    path: '/:w+',
    // redirect: '/NoView',
    name: 'NoView',
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/NoView.vue'),
  },
]
