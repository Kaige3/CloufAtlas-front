<template>
  <div>
    <a-modal v-model:open="open" :footer="false" title="欢迎分享" @cancel="handleCancel">
      <h4>复制分享链接</h4>
      <a-typography-link copyable>
        {{ link }}
      </a-typography-link>
      <a-space direction="vertical" align="center">
        <h4>手机扫码查看</h4>
        <a-qrcode :value="link" />
      </a-space>

    </a-modal>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
const open = ref<boolean>(false);

interface Props {
  title?: string;
  link?: string;
}
// 初始值
const props = withDefaults(defineProps<Props>(), {
  title: () => '分享',
  link: () => 'http://kaigee.top',
})
// 打开弹窗
const handleOk = () => {
  open.value = true;
};
// 关闭弹窗
const handleCancel = () => {
  open.value = false;
};

defineExpose({
  handleOk,
});
</script>

