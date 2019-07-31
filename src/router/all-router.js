/* eslint-disable */
/* 知识产权管理 */
const mould = () => import('../pages/Mould/mould');
const mouldList = () => import('../pages/Mould/mouldList');
const userName = () => import('../pages/Mould/userName');


/* 所有的路由 */
const allRoutes = [
  {
    path: '/mould',
    component: mould,
    name: 'mould',
    meta: {
      name: 'YFPO',
      icon: ''
    },
    children: [
      {
        path: 'mouldList',
        component: mouldList,
        name: 'mouldList',
        meta: {
          name: '模具列表',
          button: {buttons: [], nextButton: [],}
        }
      },
      {
        path: 'userName',
        component: userName,
        name: 'userName',
        meta: {
          name: '用户管理',
          button: {buttons: [], nextButton: [],}
        }
      },
    ]
  },
];

export default  allRoutes;
