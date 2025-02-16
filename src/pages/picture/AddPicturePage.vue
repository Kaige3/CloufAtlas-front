<template>
  <div id="addPicturePage">
    <h2 style="margin-bottom: 16px">
      {{ route.query?.id ? '修改图片' : '创建图片'}}
    </h2>
    <a-typography-paragraph v-if="spaceId" type="secondary">
      保存值空间：<a href="`/space/${spaceId}`" target="_blank">{{spaceId}}</a>
    </a-typography-paragraph>
    <!-- 选择上传方式 -->
    <a-tabs v-model:activeKey="uploadType"
    >
      <a-tab-pane key="file" tab="文件上传">
        <PictureUpload :picture="picture" :onSuccess="onSuccess" :spaceId="spaceId" />
      </a-tab-pane>
      <a-tab-pane key="url" tab="URL 上传" force-render>
        <UrlPictureUpload :picture="picture" :onSuccess="onSuccess" :spaceId="spaceId"/>
      </a-tab-pane>
    </a-tabs>

    <a-form v-if="picture"
        layout="vertical" :model="pictureForm" @finish="handleSubmit">

        <a-form-item label="名称" name="name">
          <a-input v-model:value="pictureForm.name" placeholder="请输入名称" />
        </a-form-item>

        <a-form-item label="简介" name="introduction">
          <a-textarea
            v-model:value="pictureForm.introduction"
            placeholder="请输入简介"
            :rows="2"
            autoSize
            allowClear
          />
        </a-form-item>

        <a-form-item label="分类" name="category">
          <a-auto-complete
            v-model:value="pictureForm.category"
            placeholder="请输入分类"
            allowClear
            :options="categoryOptions"
          />
        </a-form-item>

        <a-form-item label="标签" name="tags">
          <a-select
            v-model:value="pictureForm.tags"
            mode="tags"
            placeholder="请输入标签"
            allowClear
            :options="tagOptions"
          />
        </a-form-item>

        <a-form-item>
          <a-button type="primary" html-type="submit" style="width: 100%">创建</a-button>
        </a-form-item>

      </a-form>
    </div>
</template>

<script setup lang="ts">
import PictureUpload from "@/components/PictureUpload.vue";
import {computed, onMounted, reactive, ref} from "vue";
import {editPictureUsingPost, getPictureVoByIdUsingGet, getTagAndCategoryUsingGet} from "@/api/pictureController";
import {message} from "ant-design-vue";
import router from "@/router";
import {useRoute} from "vue-router";
import UrlPictureUpload from "@/components/UrlPictureUpload.vue";

const pictureForm = reactive<API.PictureEditDto>({})

const picture = ref<API.PictureVO>()

const uploadType = ref<'file' | 'url'>('file')


const onSuccess = (newPicture: API.PictureVO) => {
  picture.value = newPicture
  pictureForm.name = newPicture.name
}

// 提交表单
const handleSubmit = async ( values: any) => {
  const pictureId = picture.value?.id;
  if (!pictureId) {
    return;
  }
  const res = await editPictureUsingPost({
    id: pictureId,
    spaceId: spaceId.value,
    ...values,
  });
  if (res.data.code === 0 && res.data.data) {
    message.success('修改成功');
    // 跳转到图片详情
    router.push({
      path: `/picture/${pictureId}`,
    })
  } else {
    message.error('创建失败，'+res.data.message);
  }
}

interface Option {
  value: string;
  label: string;
}
// 获取分类和标签信息
const categoryOptions = ref<Option[]>([])
const tagOptions = ref<Option[]>([])

// 调用接口获取分类和标签信息
const getTagCategoryOptions = async () => {
  const res = await getTagAndCategoryUsingGet();
  if(res.data.code === 0 && res.data.data) {
    // 转换为 下拉选项组件的格式
    tagOptions.value = (res.data.data.tags ?? []).map((data: string) => {
      return {
        value: data,
        label: data,
      }
    })
    categoryOptions.value = (res.data.data.categories ?? []).map((data: string) => {
      return {
        value: data,
        label: data,
      }
    })
  } else {
    message.error('获取分类和标签信息失败',res.data.message);
  }
}
const route = useRoute();
// 获取老数据
const getOldPicture = async () =>{
  const id = route.query?.id;
  if(id){
    const res = await  getPictureVoByIdUsingGet({
      id:id,
    })
    if(res.data.code === 0 && res.data.data) {
      const data = res.data.data;
      picture.value = data;
      pictureForm.name = data.name
      pictureForm.introduction = data.introduction
      pictureForm.category = data.category
      pictureForm.tags = data.tags
    }
  }
}
// 空间id
const spaceId = computed(() => {
  return route.query?.spaceId;
})

onMounted(() => {
  getTagCategoryOptions()
  getOldPicture()
})
</script>

<style scoped>
#addPicturePage {
  max-width: 720px;
  margin: 0 auto;
}
</style>
