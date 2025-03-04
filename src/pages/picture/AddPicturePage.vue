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

<!--      上传图片成功后显示此按钮-->

      <a-flex justify="center" style="gap: 20px">
        <a-button type="primary" @click="doEditPicture">编辑图片</a-button>
        <a-button type="default" @click="doImageOutPain">AI扩图</a-button>
      </a-flex>

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
<!--  点击编辑按钮，显示模态框-->
  <div v-if="picture" class="edit-picture">
    <ImageCropper :imageUrl="picture.url"
                  :onSuccess="onCropSuccess"
                  ref="open"
                  :picture="picture"
                  :spaceId="spaceId"
    />
  </div>
<!--  点击ai扩图，显示模态框-->
  <div v-if="picture" class="image-out-pain">
    <ApiOutPainPicture :imageUrl="picture.url"
                  :onSuccess="OnOutPainSuccess"  n
                  ref="imageOutPaintingRef"
                  :picture="picture"
                  :spaceId="spaceId"
    />
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
import ImageCropper from "@/components/ImageCropper.vue";
import ApiOutPainPicture from "@/components/ApiOutPainPicture.vue";

const pictureForm = reactive<API.PictureEditDto>({})

const picture = ref<API.PictureVO>()

const uploadType = ref<'file' | 'url'>('file')
const open = ref()
const imageOutPaintingRef = ref()



const onSuccess = (newPicture: API.PictureVO) => {
  picture.value = newPicture
  pictureForm.name = newPicture.name
}
// 编辑图片成功
const onCropSuccess = (newPicture: API.PictureVO) => {
  picture.value = newPicture;
}
// Ai扩图片成功
const OnOutPainSuccess = (newPicture: API.PictureVO) => {
  picture.value = newPicture;
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

const doEditPicture = () => {
  open.value.handleOk()
}
const doImageOutPain = () => {
  imageOutPaintingRef.value.handleOk()
}
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
