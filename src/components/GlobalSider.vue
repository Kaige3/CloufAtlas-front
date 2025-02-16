<template>
  <div id="globalHeader">
    <a-row :wrap="false">

      <div id="globalSider">
        <a-layout-sider
          v-if="loginUserStore.loginUser.id"
          class="sider"
          width="200"
          breakpoint="lg"
          collapsed-width="0"
        >
          <a-menu
            mode="inline"
            v-model:selectedKeys="current"
            :items="menuItems"
            @click="doMenuClick"
          />
        </a-layout-sider>
      </div>
    </a-row>


  </div>
</template>
<script lang="ts" setup>
import { h, ref} from 'vue';
import { AppstoreOutlined, PictureOutlined } from '@ant-design/icons-vue';
import router from "@/router";

import { useLoginUserStore } from "@/store/user";

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
};

const menuItems: MenuItem[] = [
  { key: '/', icon: () => h(PictureOutlined), label: '公共图库' },
  { key: '/my_space', icon: () => h(AppstoreOutlined), label: '私人空间'},
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

// const items = computed(() => {
//   const loginUser = loginUserStore.loginUser;
//   return filterMenus(originItems, loginUser);
// });


// 路由跳转规则
const doMenuClick = ({key}:{key:string}) => {
  router.push({
    path: key });
}

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

