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
import {computed, h, ref, watchEffect} from 'vue';
import { AppstoreOutlined, PictureOutlined ,TeamOutlined} from '@ant-design/icons-vue';
import router from "@/router";

import { useLoginUserStore } from "@/store/user";
import {SPACE_TYPE_ENUM} from "@/constants/space";
import {listMyJoinSpaceUsingPost} from "@/api/spaceUserController";
import {message} from "ant-design-vue";

// user Pinia信息
const loginUserStore = useLoginUserStore();
const teamSpaceList = ref<API.SpaceUserVo[]>([]);
loginUserStore.fetchLoginUser();

// 导航栏高亮
const current = ref<string[]>([]);
router.afterEach((to, from, next) => {
  current.value = [to.path];
})


const fixedMenuItems = [
  { key: '/', icon: () => h(PictureOutlined), label: '公共图库' },
  { key: '/my_space', icon: () => h(AppstoreOutlined), label: '私人空间'},
  { key: '/add_space?type=' + SPACE_TYPE_ENUM.TEAM,icon:h(TeamOutlined), label: '创建空间'},
];

const menuItems = computed(()=>{
  // 没有团队空间，只展示固定菜单
  if(!teamSpaceList.value.length){
    return fixedMenuItems;
  }
  // 有团队空间，展示固定菜单和团队空间
  const teamSpaceMenus = teamSpaceList.value.map(SpaceUser=>{
    const space = SpaceUser.spaceVo;
    return {
      key: `/space/${space.id}`,
      icon: () => h(PictureOutlined),
      label: space.spaceName,
    }
  })
  const teamSpaceMenuGroup = {
    type: "group",
    label: '团队空间',
    key: 'teamSpace',
    children: teamSpaceMenus,
  }
  return [...fixedMenuItems, teamSpaceMenuGroup];
})

// 加载团队空间
const fetchTeamSpaceList = async () => {
  const res = await listMyJoinSpaceUsingPost()
  if (res.data.code === 0 && res.data.data) {
    teamSpaceList.value = res.data.data;
  } else {
    message.error('获取团队空间列表失败，' + res.data.message);
  }
}
// 初始化加载团队空间
watchEffect(()=>{
  if(loginUserStore.loginUser.id){
    fetchTeamSpaceList();
  }
})

// const hasPermission = (menuKey: string, loginUser?: { userRole: string }) => {
//   if (menuKey.startsWith('/admin')) {
//     return loginUser?.userRole === 'admin';
//   }
//   return true;
// };

// const filterMenus = (menus: MenuItem[] = [], loginUser?: { userRole: string }) => {
//   return menus.filter((menu) => menu.key && hasPermission(menu.key, loginUser));
// };


// 路由跳转规则
const doMenuClick = ({key}:{key:string}) => {
  router.push(key);
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

