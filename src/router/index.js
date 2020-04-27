import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'login',
      component: resolve => require(['@/view/login/login'], resolve)
    },

    // 武汉
    {
      path: '/homeWuhan',
      name: 'homeWuhan',
      component: resolve => require(['@/view/homeWuhan/wuhanHome'], resolve)
    },
    // 中心城区
    {
      path: '/home',
      name: 'home',
      component: resolve => require(['@/view/home/Home'], resolve)
    },
    // 开发区
    {
      path: '/areaHome',
      name: 'areaHome',
      component: resolve => require(['@/view/areaHome/areaHome'], resolve)
    },
    // 围栏界面
    {
      path: '/rail',
      name: 'rail',
      component: resolve => require(['@/view/Rail/rail'], resolve)
    },
    // 围栏用户界面界面
    {
      path: '/selectCust',
      name: 'selectCust',
      component: resolve => require(['@/view/Rail/selectCust'], resolve)
    },
    // 巡查GIS
    {
      path: '/patrol',
      name: 'patrol',
      component: resolve => require(['@/view/patrol/patrol'], resolve)
    },
    // 复工复产
    {
      path: '/work',
      name: 'work',
      component: resolve => require(['@/view/work/work'], resolve)
    },
    // 账号管理
    {
      path: '/userManage',
      name: 'userManage',
      component: resolve => require(['@/view/userManage/userManage'], resolve)
    },

    // 手机端
    // 登录
    {
      path: '/loginMove',
      name: 'loginMove',
      component: resolve => require(['@/view/loginMove/loginMove'], resolve)
    },
    // 武汉市
    {
      path: '/whHomeMove',
      name: 'whHomeMove',
      component: resolve => require(['@/view/whHomeMove/whHomeMove'], resolve)
    },
    // 中心城区
    {
      path: '/homeMove',
      name: 'homeMove',
      component: resolve => require(['@/view/homeMove/homeMove'], resolve)
    },
    // 开发区
    {
      path: '/areaHomeMove',
      name: 'areaHomeMove',
      component: resolve => require(['@/view/areaHomeMove/areaHomeMove'], resolve)
    },
    // 战区动态
    {
      path: '/newsMove',
      name: 'newsMove',
      component: resolve => require(['@/view/newsMove/newsMove'], resolve)
    },
    // 战区动态-新建编辑
    {
      path: '/addNews',
      name: 'addNews',
      component: resolve => require(['@/view/newsMove/addNews'], resolve)
    },
    // 围栏
    {
      path: '/railMove',
      name: 'railMove',
      component: resolve => require(['@/view/Rail/railMove'], resolve)
    },
    {
      path: '/userInfo',
      name: 'userInfo',
      component: resolve => require(['@/view/Rail/userInfo'], resolve)
    },
    {
      path: '/userDetail',
      name: 'userInfo',
      component: resolve => require(['@/view/Rail/userDetail'], resolve)
    },
    // 巡查GIS
    {
      path: '/patrolMove',
      name: 'patrolMove',
      component: resolve => require(['@/view/patrolMove/patrolMove'], resolve)
    },
    // 高德导航
    {
      path: '/navMove',
      name: 'navMove',
      component: resolve => require(['@/view/navMove/navMove'], resolve)
    },
    // 复工复产
    {
      path: '/workMove',
      name: 'workMove',
      component: resolve => require(['@/view/workMove/workMove'], resolve)
    },
    // 复工复产搜索信息
    {
      path: '/workSearch',
      name: 'workSearch',
      component: resolve => require(['@/view/workMove/workSearch'], resolve)
    },
    // 账号权限
    {
      path: '/userMove',
      name: 'userMove',
      component: resolve => require(['@/view/userMove/userMove'], resolve)
    },
    // 添加账号
    {
      path: '/addUser',
      name: 'addUser',
      component: resolve => require(['@/view/userMove/addUser'], resolve)
    },


    {
      path: '/test',
      name: 'test',
      component: resolve => require(['@/view/test'], resolve)
    },

    // mawei
    //复工复产
    {
      path: '/mProduction',
      name: 'mProduction',
      component: resolve => require(['@/view/mProduction/index'], resolve)
    },
  ]
})
