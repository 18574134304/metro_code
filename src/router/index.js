import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
// import index from  //首页


// import emergency_video from '' //视频
// import vehicleList from  //车辆列表
// import journal from  //行车日志
// import drive from  //辅助驾驶
// import system from  //系统管理 司机账号管理

// import groundEnd from  //系统管理 地面端账号管理
// import notice from  //系统管理 公告
// import typesetting from  //系统管理  排班管理
// import electronics from  //系统管理 电子手册

Vue.use(Router)
// 路由配置
const router = new Router({
  mode: 'hash', //去掉url中的#
  routes: [
    {
      path: '/Login',
      name: 'Login',
      meta: {
        title: '登录'
      },
      component: () => import('@/views/Login.vue')
    },
    {
      path: '/',
      name: 'Home',
      component: Home,
      redirect: '/index',
      meta: {
        title: '首页',
        requiresAuth: true, // true表示需要登录
      },
      children: [
        {
          path: "/emergency_video",
          component: () => import('@/views/emergencyCommand/video.vue'),
          hidden: true
        },
        {
          path: "/vehicleList",
          component: () => import('@/views/emergencyCommand/vehicleList.vue'),
          hidden: true
        },
        {
          path: "/index",
          component: () => import('../views/index.vue'),
          hidden: true
        },
        {
          path: "/journal",
          component: () => import('@/views/logbook/journal.vue'),
          hidden: true,
          
        },
        
        {
          path: "/drive",
          component: () => import('@/views/assistedDriving/drive.vue'),
          hidden: true
        },
        {
          path: "/system",
          component: () => import('@/views/system/system.vue'),
          hidden: true
        },
        {
          path: "/groundEnd",
          component: () => import('@/views/system/groundEnd.vue'),
          hidden: true
        },
        {
          path: "/notice",
          component: () => import('@/views/system/notice.vue'),
          hidden: true
        },
        {
          path: "/typesetting",
          component: () => import('@/views/system/typesetting.vue'),
          hidden: true
        },
        {
          path: "/electronics",
          component: () => import('@/views/system/electronics.vue'),
          hidden: true
        },

      ]
    },

  ]
})

// 路由拦截，判断是否需要登录
router.beforeEach((to, from, next) => {
    let user = JSON.parse(localStorage.getItem("user")) ? JSON.parse(localStorage.getItem("user")) : {};
    console.log(user,'aaa')
    // return
    // if (to.path == "Login") {
    //   next()
    // }else {
      if(to.name!=='Login'){
        if(user && user.token) {
          next()
        }else {
          next('/Login')
        }
      }else{
        next()
      }
      
    // }
  })

export default router
