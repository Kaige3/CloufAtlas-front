<template>
  <div id="addSpacePage">

    <h2 style="margin-bottom: 16px">
      {{ route.query?.id ? '修改空间' : '创建'}}{{ SPACE_TYPE_MAP[spaceType]}}
    </h2>
    <a-form layout="vertical" :model="spaceForm" @finish="handleSubmit">

      <a-form-item label="名称" name="name">
        <a-input v-model:value="spaceForm.spaceName" placeholder="请输入名称" />
      </a-form-item>

      <a-form-item label="空间级别" name="spaceLevel">
        <a-select
          v-model:value="spaceForm.spaceLevel"
          :options="SPACE_LEVEL_OPTIONS"
          placeholder="请选择空间级别"
          style="min-width: 180px"
          allow-clear
          ></a-select>
      </a-form-item>

      <a-form-item>
        <a-button type="primary" html-type="submit" style="width: 100%" :loading="loading">提交</a-button>
      </a-form-item>

    </a-form>
    <a-card title="空间级别介绍">
      <a-typography-paragraph>
        ⭐目前仅支持开通普通版，想要升级请联系管理员。
        <a href="http://kaigee.top" target="_blank">程序员凯歌</a>
      </a-typography-paragraph>
      <a-typography-paragraph v-for="spaceLevel in spaceLeveList">
        {{ spaceLevel.text }}: 大小{{ formatSize(spaceLevel.maxSize)}},
        数量{{ spaceLevel.maxCount }}
      </a-typography-paragraph>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, reactive, ref} from "vue";
import {
  addSpaceUsingPost, getSpaceVoByIdUsingGet, listSpaceLevelUsingGet, updateSpaceUsingPost,

} from "@/api/spaceController";
import {message} from "ant-design-vue";
import router from "@/router";
import {SPACE_LEVEL_ENUM, SPACE_LEVEL_OPTIONS, SPACE_TYPE_ENUM, SPACE_TYPE_MAP} from "@/constants/space";
import {formatSize} from "../../utils";
import {useRoute} from "vue-router";

const spaceForm = reactive<API.SpaceAddDto | API.SpaceUpdateDto>({
  spaceName: '',
  spaceLevel: SPACE_LEVEL_ENUM.COMMON,
})

const spaceLeveList =ref<API.SpaceLevel[]>([])
const loading = ref<boolean>(false);
const spaceType = computed(() => {
  return route.query?.type?? SPACE_TYPE_ENUM.PRIVATE
})
// 提交表单
const handleSubmit = async ( values: any) => {
  const spaceId = oldSpace.value?.id
  loading.value = true;
  let res;
  // 更新
  if (spaceId) {
    res = await updateSpaceUsingPost({
      id: spaceId,
      ...spaceForm,
    })
  } else {
    // 新增
    res = await addSpaceUsingPost({
      ...spaceForm,
      spaceType: spaceType.value,
    })
  }
  if (res.data.code === 0 && res.data.data) {
    message.success('操作成功');
    // 跳转到空间详情
    router.push({
      path: `/space/${spaceId ?? res.data.data}`,
    })
  } else {
    message.error('创建失败，'+res.data.message);
  }
  loading.value = false;
}

// 获取空间等级列表
const getSpaceLevelList = async () => {
  const res = await listSpaceLevelUsingGet();
  if (res.data.code === 0 && res.data.data) {
    spaceLeveList.value = res.data.data;
  } else {
    message.error('获取空间等级列表失败，'+res.data.message);
  }
}
// 获取编辑空间的数据
const route = useRoute()
const oldSpace = ref<API.SpaceVO>()

const getOldSpaceList = async () => {
  const id = route.query?.id
  if (id) {
    const res = await getSpaceVoByIdUsingGet({
      id:id,
    })
    if (res.data.code === 0 && res.data.data) {
      const data = res.data.data
      oldSpace.value =data;
      spaceForm.spaceName = data.spaceName;
      spaceForm.spaceLevel = data.spaceLevel;
      console.log('空间级别选项:', SPACE_LEVEL_OPTIONS);
    } else {
      message.error('获取空间详情失败，' + res.data.message);
    }
  }
}

onMounted(() => {
  getSpaceLevelList();
  getOldSpaceList();
})


</script>

<style scoped>
#addSpacePage {
  max-width: 720px;
  margin: 0 auto;
}
</style>
