<script setup lang="ts">
import {onMounted, ref} from "vue";
import {addSpaceUserUsingPost, editSpaceUserUsingPost, listSpaceUserByPageUsingPost} from "@/api/spaceUserController";
import {message} from "ant-design-vue";
import {SPACE_ROLE_OPTIONS} from "@/constants/space";
import dayjs from "dayjs";

const columns =[
  {
    title: '用户',
    dataIndex: 'userInfo',
  },{
    title: '角色',
    dataIndex: 'userRole',
  },{
    title: '创建时间',
    dataIndex: 'createTime',
  },{
  title: '操作',
    key: 'action',
  }
]

interface Props {
  id: string
}
const props = defineProps<Props>()
// 数据
const dataList = ref([])

const formData = ref<API.SpaceUserAddDto>({})

// 获取数据
const fetchData = async () => {
  const id = props.id;
  const res = await listSpaceUserByPageUsingPost({
    spaceId: id,
  })
  if(res.data.code === 0){
    dataList.value = res.data.data
  } else {
    message.error('获取空间用户列表失败，' + res.data.message)
  }
}

// 编辑空间角色
const editSpaceRole = async (value,record) => {
  const res = await editSpaceUserUsingPost({
    id: record.id,
    spaceRole: value,
  })
  console.log(record.id+"============================");
  console.log(value+"============================");
  if(res.data.code === 0){
    message.success('修改成功')
  } else {
    message.error('修改失败，' + res.data.message)
  }
}
// 删除空间用户
const handleDelete = async (id:number) => {
  const res = await editSpaceUserUsingPost({
    id: props.id,
    spaceRole: 0,
  })
  if(res.data.code === 0){
    message.success('删除成功')
  } else {
    message.error(res.data.message)
  }
}
// 添加用户
// 创建成员
const handleSubmit = async () => {
  const spaceId = props.id
  if (!spaceId) {
    return
  }
  const res = await addSpaceUserUsingPost({
    spaceId,
    ...formData.value,
  })
  if (res.data.code === 0) {
    message.success('添加成功')
    // 刷新数据
    fetchData()
  } else {
    message.error('添加失败，' + res.data.message)
  }
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="spaceUserManage">
    <a-form layout="inline" @finish="handleSubmit" :model="formData">
      <a-form-item>
        <a-input v-model:value="formData.userId" placeholder="请输入用户id" allow-clear />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit">添加用户</a-button>
      </a-form-item>
    </a-form>

    <a-table :columns="columns" :dataSource="dataList">
      <template #bodyCell = "{column,record}">
        <template v-if="column.dataIndex === 'userInfo'">
          <a-space>
            <a-avatar :src="record.userVo.userAvatar" :size="32">
              {{record.userVo?.userName}}
            </a-avatar>
          </a-space>
        </template>
        <template v-if="column.dataIndex === 'userRole'">
          <a-select
            v-model:value="record.spaceRole"
            :options="SPACE_ROLE_OPTIONS"
            @change="(value) => editSpaceRole(value,record)"
            />
        </template>
        <template v-else-if="column.dateIndex === 'createTime'">
          {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template v-else-if="column.key === 'action'">
          <a-button  danger @click="(e) => handleDelete(record.id,e)">删除</a-button>
        </template>
      </template>
    </a-table>
  </div>

</template>

<style scoped>

</style>
