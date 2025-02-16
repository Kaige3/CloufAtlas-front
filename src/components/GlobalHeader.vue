<template>
  <div id="globalHeader">
    <a-row :wrap="false">
<!--      logo和网站标题-->
      <a-col flex="200px">
        <RouterLink to="/">
          <div class="title-bar">
            <img src="../assets/logo.svg" alt="logo" class="logo">
            <div class="title">凯的云图库</div>
          </div>
        </RouterLink>
      </a-col>
<!--      中键导航栏-->
      <a-col flex="auto">
        <a-menu
          v-model:selectedKeys="current"
          mode="horizontal"
          :items="items"
          @click="doMenuClick"
        />
      </a-col>
<!--  最右边的登录-->
      <a-col flex="120px">
        <div class="user-login-status">
          <div v-if="loginUserStore.loginUser.id">
            <a-dropdown>
              <ASpace>
                <a-avatar :src="loginUserStore.loginUser.userAvatar" shape="square" size="large"/>
                {{ loginUserStore.loginUser.userName ?? '无名' }}
              </ASpace>
              <template #overlay>
                <a-menu>
                  <a-menu-item @click="doLogout">
                    退出登录
                  </a-menu-item>
                  <a-menu-item>
                    <router-link to="my_space">
                      <UserOutlined/>
                      我的空间
                    </router-link>
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </div>
          <div v-else>
            <a-button type="primary" href="/user/login">登录</a-button>
          </div>
        </div>
      </a-col>
    </a-row>

  </div>
</template>
<script lang="ts" setup>
import {computed, h, ref} from 'vue';
import { MailOutlined, AppstoreOutlined, SettingOutlined } from '@ant-design/icons-vue';
import router from "@/router";
import {type MenuProps, message} from "ant-design-vue";

import { useLoginUserStore } from "@/store/user";
import {userLogoutUsingPost} from "@/api/userController";

// 推出登录
const doLogout = async () => {
  const res = await userLogoutUsingPost();
  console.log(res);
  if (res.data.code === 0){
    loginUserStore.setLoginUser({
      userName: '未登录',
    })
    message.success('退出登录成功');
    await router.push('/user/login');
  }else {
    message.error('退出登录失败');
  }
};

// user Pinia信息
const loginUserStore = useLoginUserStore();
loginUserStore.fetchLoginUser();

// 导航栏高亮
const current = ref<string[]>([]);
router.afterEach((to, from, next) => {
  current.value = [to.path];
})


type MenuItem = {
  key: string;
  icon?: () => JSX.Element;
  label: string | JSX.Element;
  title: string;
};

const originItems: MenuItem[] = [
  { key: '/', icon: () => h(MailOutlined), label: '主页', title: '主页' },
  { key: '/admin/userManage', icon: () => h(AppstoreOutlined), label: '用户管理', title: '用户管理' },
  { key: 'others', label: h('a', { href: 'http://kaigee.top', target: '_blank' }, 'Kaige~Blog'), title: '凯的博客' },
  { key: '/add_picture',label:'创建图片', title: '创建图片'},
  { key: '/admin/pictureManage',label:'图片管理', title: '图片管理'},
  { key: '/admin/spaceManage',label:'空间管理', title: '空间管理'}
];

const hasPermission = (menuKey: string, loginUser?: { userRole: string }) => {
  if (menuKey.startsWith('/admin')) {
    return loginUser?.userRole === 'admin';
  }
  return true;
};

const filterMenus = (menus: MenuItem[] = [], loginUser?: { userRole: string }) => {
  return menus.filter((menu) => menu.key && hasPermission(menu.key, loginUser));
};

const items = computed(() => {
  const loginUser = loginUserStore.loginUser;
  return filterMenus(originItems, loginUser);
});


// 路由跳转规则
const doMenuClick = ({key}:{key:string}) => {
  router.push({
    path: key });
}

// 测试api
// healthUsingGet().then((res) => {
//   console.log(res);
// })

</script>

<style scoped>
.title-bar {
  display: flex;
  align-items: center;
}

.title {
  color: black;
  font-size: 18px;
  margin-left: 16px;
}

.logo {
  height: 48px;
}
</style>

