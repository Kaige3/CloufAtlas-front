<template>
  <div class="upload-container">
    <a-upload
      list-type="picture-card"
      class="avatar-uploader"
      :show-upload-list="false"
      :before-upload="beforeUpload"
      :custom-request="handleUpload"
    >
      <img style="max-width: 720px"
        v-if="picture?.url" :src="picture?.url" alt="avatar" />

      <div v-else>
        <loading-outlined v-if="loading"></loading-outlined>
        <plus-outlined v-else></plus-outlined>
        <div class="ant-upload-text">快点上传图片吧</div>
      </div>
    </a-upload>
  </div>

</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import type { UploadProps } from 'ant-design-vue';
import { uploadPictureUsingPost} from "@/api/pictureController";


interface Props {
  picture?: API.PictureVO
  spaceId?: number
  onSuccess?: (newPicture: API.PictureVO) => void
}

const props = defineProps<Props>();

const loading = ref<boolean>(false);

// 上传前校验
const beforeUpload = (file: UploadProps['fileList'][number]) => {
  // 校验文件类型
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('上传的文件类型不支持!');
  }
  // 校验文件大小
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('不能上传超过两兆的图片!');
  }
  return isJpgOrPng && isLt2M;
};

// 上传图片时传递spaceId

// 上传图片
const handleUpload = async ({file}: any) => {
  loading.value = true;
  try {
    const params: API.PictureUploadDto = props.picture? {id: props.picture.id} : {};
    params.spaceId = props.spaceId;
    const res = await uploadPictureUsingPost(params, {}, file);
    if(res.data.code === 0 && res.data.data) {
      message.success("上传图片成功");
      console.log(props.spaceId+"=====================");
      props.onSuccess?.(res.data.data);
    } else {
      message.error(res.data.message);
    }
  } catch (e) {
    message.error("上传图片失败");
  } finally {
    loading.value = false;
  }
}

</script>
<style scoped>
.upload-container :deep(.ant-upload){
  display: flex;
  height: 100% !important;
  width: 100% !important;
  min-height: 152px;
  min-width: 152px;
}
.avatar-uploader > .ant-upload {
  width: 128px;
  height: 128px;
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
