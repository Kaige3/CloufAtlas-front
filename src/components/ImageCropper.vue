<template>
  <div>
    <a-modal class="image-cropper" v-model:open="open" :footer="false" title="图片编辑" @cancel="handleCancel">
        <vue-cropper
          ref="cropperRef"
          :img="imageUrl"
          :autoCrop="true"
          :fixedBox="false"
          :centerBox="true"
          :canMoveBox="true"
          :info="true"
          outputType="png"
        />
        <div style="margin-bottom: 16px" />
        <!-- 图片操作 -->
        <div class="image-cropper-actions">
          <a-space>
            <a-button @click="rotateLeft">向左旋转</a-button>
            <a-button @click="rotateRight">向右旋转</a-button>
            <a-button @click="changeScale(1)">放大</a-button>
            <a-button @click="changeScale(-1)">缩小</a-button>
            <a-button type="primary" @click="handleConfirm" :loading="loading">确定</a-button>
          </a-space>
        </div>
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import {uploadPictureUsingPost} from "@/api/pictureController";
import {message} from "ant-design-vue";
const open = ref<boolean>(false);
const loading = ref(false);

interface Props {
  imageUrl?: string;
  picture?: API.PictureVO;
  spaceId?: number;
  onSuccess?: (newPicture: API.PictureVO) => void;
}
// 初始值
const props = withDefaults(defineProps<Props>(), {})
// 打开弹窗
const handleOk = () => {
  open.value = true;
};
// 关闭弹窗
const handleCancel = () => {
  open.value = false;
};
// 组件引用
const cropperRef = ref();
// 向左旋转
const rotateLeft = () => {
  cropperRef.value.rotateLeft();
}
// x向右旋转
const rotateRight = () => {
  cropperRef.value.rotateRight();
}
// 缩放
const changeScale = (scale: number) => {
  cropperRef.value.changeScale(scale);
}
// 确认
const handleConfirm = async () => {
  cropperRef.value.getCropBlob((blob:Blob) => {
    const fileName = (props.picture?.name || 'image') + '.png'
    const file = new File([blob], fileName)
    handleUpload(file)
  })
}

const handleUpload = async (file: File) => {
  loading.value = true;
  try {
    const params: API.PictureUploadDto = props.picture ? { id:props.picture.id } : {}
    params.spaceId = props.spaceId
    const res = await uploadPictureUsingPost(params, {},file)
    if (res.data.code === 0 && res.data.data) {
      message.success('图片上传成功')
      // 将上传成功的图片信息传递给父组件
      props.onSuccess?.(res.data.data)
      handleCancel();
    } else {
      message.error('图片上传失败，' + res.data.message)
    }
  }
  catch (error) {
    message.error('图片上传失败')
  } finally {
    loading.value = false;
  }
}

defineExpose({
  handleOk,
});
</script>

<style>
.image-cropper .vue-cropper{
  height: 500px !important;
}
</style>

