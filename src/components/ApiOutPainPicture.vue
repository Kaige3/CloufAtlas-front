<template>
    <a-modal  class="image-out-painting"
      v-model:open="open" :footer="false" title="阿里云Ai阔图" @cancel="handleCancel">

      <a-flex justify="center" style="gap: 20px">
        <div class="image1">
          <h4>原图</h4>
          <img :src="picture?.url"
               :alt="picture?.name"
               style="max-height:400px">
        </div>

        <div class="image1">
          <h4>阔图结果</h4>
          <img
            style="max-height:400px"
            v-if="resultImageUrl"
            :src="resultImageUrl"
            :alt="picture?.name">
        </div>



      </a-flex>

      <a-flex gap="16" justify="center">
        <a-button type="primary" :loading="!!taskId" @click="createTask" >生成图片</a-button>
        <a-button type="primary" :loading="handleLoading"  @click="handleUpload">应用结果</a-button>
      </a-flex>
    </a-modal>
</template>
<script lang="ts" setup>
import {onUnmounted, ref} from 'vue';
import {
  createOutPaintingTaskUsingPost,
  getOutPaintingTaskUsingGet,
  uploadPictureByUrlUsingPost
} from "@/api/pictureController";
import {message} from "ant-design-vue";
const open = ref<boolean>(false);
const resultImageUrl = ref<string>('');

interface Props {
  picture?: API.PictureVO;
  spaceId?: number;
  onSuccess?: (newPicture: API.PictureVO) => void;
}
// 初始值
const props = withDefaults(defineProps<Props>(), {
})
let taskId = ref<string>()
let pollingTimer: NodeJS.Timeout | null = null;
// 打开弹窗
const handleOk = () => {
  open.value = true;
};
// 关闭弹窗
const handleCancel = () => {
  open.value = false;
};
const handleLoading = ref<boolean>(false);

// 创建扩图任务
const createTask = async () => {
  if (!props.picture?.id) {
    return;
  }
  const res = await createOutPaintingTaskUsingPost({
    pictureId: props.picture.id,
    parameters: {
      xScale: 2,
      yScale: 2,
    },
  })
  if (res.data.code === 0 && res.data.data) {
    message.success('创建任务成功，请等待任务完成，不要退出界面');
    console.log(res.data.data.output.taskId);
    taskId.value = res.data.data.output.taskId;
    startPolling();
  } else {
    message.error('创建任务失败');
  }
}

// 清理轮询定时器
const clearPollingTimer = () => {
  if (pollingTimer) {
    clearInterval(pollingTimer);
    pollingTimer = null;
    taskId.value = null;
  }
}
// 开始轮询任务
const startPolling = () => {
  if (!taskId.value) {
    return;
  }
  pollingTimer = setInterval(async () => {
  try {
      const res = await getOutPaintingTaskUsingGet({
        taskId: taskId.value,
      })
      if (res.data.code === 0 && res.data.data) {
        const taskResult = res.data.data.output
        if (taskResult.taskStatus === 'SUCCEEDED') {
          message.success('任务完成');
          resultImageUrl.value = taskResult.outputImageUrl;
          clearPollingTimer();
        } else if (taskResult.taskStatus === 'FAILED') {
          message.error('任务失败');
          clearPollingTimer();
        }
      }
    } catch (e) {
    console.log("查询任务状态失败"+e);
    message.error('查询任务状态失败');
    clearPollingTimer();
  }
} ,3000)
}
// 上传图片
const handleUpload = async () => {
  handleLoading.value = true;
  try {
    const params: API.PictureUploadDto = {
      fileUrl: resultImageUrl.value,
      spaceId: props.spaceId,
    }
    // 如果有id就是修改
    if (props.picture?.id) {
      params.id = props.picture.id;
    }
    const res = await uploadPictureByUrlUsingPost(params);
    if (res.data.code === 0 && res.data.data) {
      message.success('图片上传成功');
      props.onSuccess?.(res.data.data); // 调用回调函数,将结果传递给父组件
      handleCancel();// 关闭弹窗
    } else {
      message.error('图片上传失败');
    }
  } catch (e) {
    console.log("图片上传失败"+e);
    message.error('图片上传失败');
}
  finally {
    handleLoading.value = false;
  }
}


// 清理定时器，避免内存泄漏
onUnmounted(() => {
  clearPollingTimer()
})

defineExpose({
  handleOk
});
</script>

