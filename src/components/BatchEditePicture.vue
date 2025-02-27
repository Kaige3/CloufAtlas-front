<template>
  <div>
    <a-modal v-model:open="open" :footer="false" title="批量编辑图片" @cancel="handleCancel">
      <a-typography-paragraph type="secondary">
        只对当前页面的图片进行批量编辑
      </a-typography-paragraph>


      <a-form layout="vertical" :model="formData" @finish="handleSubmit">

        <a-form-item label="分类" name="category">
          <a-auto-complete
            v-model:value="formData.category"
            placeholder="请输入分类"
            allowClear
            :options="categoryOptions"
          />
        </a-form-item>

        <a-form-item label="标签" name="tags" style="width: 100px">
          <a-select
            v-model:value="formData.tags"
            mode="tags"
            placeholder="请输入标签"
            allowClear
            :options="tagOptions"
          />
        </a-form-item>

        <a-form-item label="请输入命名规则" name="nameRule">
         <a-input  v-model:value="formData.nameRule" placeholder="请请输入命名规则，输入{序号}可动态使用数字替换“{序号}”"/>
        </a-form-item>

        <a-form-item>
          <a-button type="primary" html-type="submit" style="width: 100%">创建</a-button>
        </a-form-item>

      </a-form>

    </a-modal>
  </div>
</template>
<script lang="ts" setup>
import {onMounted, reactive, ref} from 'vue';
import {message} from "ant-design-vue";
import {batchEditePictureUsingPost, getTagAndCategoryUsingGet} from "@/api/pictureController";
const open = ref<boolean>(false);

interface Props {
  pictureList: API.PictureVO[];
  spaceId: number
  onSuccess: () => void;
}
// 初始值
const props = withDefaults(defineProps<Props>(), {})

const formData = reactive({
  nameRule: '',
  category: '',
  tags: [],
})
// 打开弹窗
const handleOk = () => {
  open.value = true;
};
// 关闭弹窗
const handleCancel = () => {
  open.value = false;
};
// 获取分类和标签信息
const categoryOptions = ref<string[]>([])
const tagOptions = ref<string[]>([])

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
// 提交表单
const handleSubmit = async (values:any) => {
  if (!props.spaceId) {
    return;
  }
  const res = await batchEditePictureUsingPost({
    pictureIdList: props.pictureList.map((picture) => picture.id),
    spaceId: props.spaceId,
    ...values
  })
  if (res.data.code === 0 && res.data.data) {
    message.success('批量编辑成功');
    props.onSuccess()
  } else {
    message.error('批量编辑失败，'+res.data.message);
  }
}
defineExpose({
  handleOk,
});
onMounted(() => {
  getTagCategoryOptions()
})
</script>

