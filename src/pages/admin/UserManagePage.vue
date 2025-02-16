<template>
  <a-form layout="inline" :mode="searchParams" @submit="doSearch">
    <a-form-item label="账号">
      <a-input v-model:value="searchParams.userAccount" placeholder="请输入账号" />
    </a-form-item>
    <a-form-item label="姓名">
      <a-input v-model:value="searchParams.userName" placeholder="请输入姓名" />
    </a-form-item>
    <a-form-item>
      <a-button type="primary" html-type="submit">查询</a-button>
    </a-form-item>
  </a-form>
  <a-table :columns="columns"
           :data-source="dataList"
           :pagination="pagination"
            @change="doTableChange"
  >
    <template #headerCell="{ column }">
      <template v-if="column.key === 'name'">
        <span>
          <smile-outlined />
          Name
        </span>
      </template>
    </template>

    <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'userAvatar'">
            <a-image :src="record.userAvatar" :width="120" :height="100" />
          </template>
          <template v-else-if="column.dataIndex === 'userRole'">
            <div v-if="record.userRole === 'admin'">
              <a-tag color="green">
                管理员
              </a-tag>
            </div>
            <div v-else>
              <a-tag color="blue">
                普通用户
              </a-tag>
            </div>
          </template>
          <template v-else-if="column.dataIndex === 'createTime'">
            {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
          </template>
          <template v-else-if="column.key === 'action'">
            <a-button danger @click="doDelete(record.id)">删除</a-button>
          </template>
    </template>

  </a-table>
</template>


<script setup lang="ts">
import { SmileOutlined, DownOutlined } from '@ant-design/icons-vue';


import {computed, onMounted, reactive, ref} from "vue";
import {deleteUserByIdUsingPost, listUserByPageUsingPost} from "@/api/userController";
import {message} from "ant-design-vue";
import type {UserVo} from "src/api/typings";
import dayjs from "dayjs";


// 删除
const doDelete = async (id:number) => {
  if(!id){
    return
  }
  const res = await deleteUserByIdUsingPost({id});{
    if (res.data.code === 0){
      message.success('删除成功')
      fetchData()
    }else {
      message.error('删除失败'+res.data.message)
    }
  }
};
// 搜索
const doSearch= ()=>{
  // 重置分页参数
  searchParams.current = 1;
  fetchData()
}
// 切换分页参数
const doTableChange =(page:any) => {
  searchParams.current = page.current;
  searchParams.pageSize = page.pageSize;
  fetchData();
};
// 分页参数
const pagination = computed(() => {
  return {
    pageSize: searchParams.pageSize ?? 10,
    current: searchParams.current ?? 1,
    total: total.value,
    showTotal: (total) => `共 ${total} 条`,
    showSizeChanger: true,
  }
});

// 加载数据源
onMounted(() => {
  fetchData();
})

// 获取数据源
const dataList = ref<UserVo[]>([]);
const total = ref(0);

// 搜索参数
const searchParams = reactive<API.UserQueryDto>({
  current: 1,
  pageSize: 10,
  userName: '',
  userAccount: '',
})

// 后台数据
const fetchData = async () =>{

  const res = await listUserByPageUsingPost({
    ...searchParams
  })

  if(res.data.data){
    dataList.value = res.data.data.records ?? []
    total.value = res.data.data.total ?? 0
  }else {
    message.error('获取数据失败'+res.data.message)
  }
};

const columns = [
  {
    title: 'id',
    dataIndex: 'id',
  },
  {
    title: '账号',
    dataIndex: 'userAccount',
  },
  {
    title: '用户名',
    dataIndex: 'userName',
  },
  {
    title: '头像',
    dataIndex: 'userAvatar',
  },
  {
    title: '简介',
    dataIndex: 'userProfile',
  },
  {
    title: '用户角色',
    dataIndex: 'userRole',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
  },
  {
    title: '操作',
    key: 'action',
  },
]


</script>

<style scoped>

</style>
