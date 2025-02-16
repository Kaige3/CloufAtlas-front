import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import HomePage from "@/pages/HomePage.vue";
import UserLoginPage from "@/pages/user/UserLoginPage.vue";
import UserRegisterPage from "@/pages/user/UserRegisterPage.vue";
import UserManagePage from "@/pages/admin/UserManagePage.vue";
import AddPicturePage from "@/pages/picture/AddPicturePage.vue";
import PictureManagePage from "@/pages/admin/PictureManagePage.vue";
import PictureDetailPage from "@/pages/picture/PictureDetailPage.vue";
import AddPictureBatchPage from "@/pages/picture/AddPictureBatchPage.vue";
import SpaceManagePage from "@/pages/admin/SpaceManagePage.vue";
import AddSpacePage from "@/pages/space/AddSpacePage.vue";
import MyspacePage from "@/pages/space/MyspacePage.vue";
import SpaceDetailPage from "@/pages/space/SpaceDetailPage.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: '主页',
      component: HomePage
    },
    {
      path: '/add_picture',
      name: '创建图片',
      component: AddPicturePage
    },
    {
      path: '/user/login',
      name: '登录',
      component: UserLoginPage
    },
    {
    path :'/user/register',
    name : '注册',
      component: UserRegisterPage
    },
    {
      path: '/admin/userManage',
      name: '用户管理',
      component: UserManagePage
    },{
      path: '/admin/pictureManage',
      name: '图片管理',
      component: PictureManagePage
    },
    {
      path: '/add_picture/batch',
      name: '批量创建图片',
      component: AddPictureBatchPage,
    },
    {
      path: '/picture/:id',
      name: '图片详情',
      component: PictureDetailPage,
      props: true
    },{
      path: '/admin/spaceManage',
      name: '空间管理',
      component: SpaceManagePage
    },{
      path: '/add_space',
      name: '添加空间',
      component: AddSpacePage
    },{
      path: '/my_space',
      name: '我的空间',
      component: MyspacePage,
    }, {
      path: '/space/:id',
      name: '空间详情',
      component: SpaceDetailPage,
      props: true
    }
  ],
})

export default router
