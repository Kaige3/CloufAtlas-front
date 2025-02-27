<template>
  <div class="picture-search-form">
    <a-form layout="inline" :model="searchParams" @finish="doSearch">

      <a-form-item label="关键词" name="searchText">
        <a-input v-model:value="searchParams.searchText"
                 placeholder="请输入搜索关键词"
                 allowClear
        />
      </a-form-item>

      <a-form-item label="分类" name="category">
        <a-input v-model:value="searchParams.category"
                 style="min-width: 180px"
                 placeholder="请输入分类"
                 :options="categoryList"
                 allowClear
        />
      </a-form-item>

      <a-form-item label="标签" name="tags">
         <a-select
           v-model:value="searchParams.tags"
           style="min-width: 180px"
           mode="tags"
           placeholder="请选择标签"
           :options="tagList"
           allowClear
         />
      </a-form-item>

      <a-form-item label="请选择日期" name="date">
        <a-time-range-picker
          style="width: 400px"
          v-model:value="rangeDate"
          showTime
          :placeholder="['编辑开始时间','编辑结束时间']"
          format="YYYY/MM/DD HH:mm:ss"
          :presets="rangePresets"
          @change="onDateChange"
        />
      </a-form-item>

      <a-form-item label="名称" name="name">
        <a-input v-model:value="searchParams.name"
                 placeholder="请输入名称"
                 allowClear
        />
      </a-form-item>

      <a-form-item label="简介" name="introduction">
        <a-input v-model:value="searchParams.introduction"
                 placeholder="请输入描述"
                 allowClear
        />
      </a-form-item>

      <a-form-item label="宽度" name="picWidth">
        <a-input-number v-model:value="searchParams.picWidth"
                        placeholder="请输入宽度"
                        allowClear
        />
      </a-form-item>
      <a-form-item label="高度" name="picHeight">
        <a-input-number v-model:value="searchParams.picHeight"
                        placeholder="请输入高度"
                        allowClear
        />
      </a-form-item>

      <a-form-item label="文件格式" name="picFormat">
        <a-input v-model:value="searchParams.picFormat"
                 placeholder="请输入文件格式"
                 allowClear
        />
      </a-form-item>

      <a-form-item>
        <a-space>
        <a-button type="primary" html-type="submit" style="width:100%">搜索</a-button>
        <a-button type="primary" @click="resetForm" style="width:100%">重置</a-button>
        </a-space>
      </a-form-item>



    </a-form>
  </div>
</template>

<script setup lang="ts">

import PictureQueryDto = API.PictureQueryDto;
import {onMounted, reactive, ref} from "vue";
import {getTagAndCategoryUsingGet} from "@/api/pictureController";
import {message} from "ant-design-vue";
import dayjs from "dayjs";

interface Props {
  onSearch?: (searchParams: PictureQueryDto) => void
}

const props = defineProps<Props>()
// 搜索条件
const searchParams = reactive<API.PictureQueryDto>({})
const categoryList = ref<string[]>([])
const tagList = ref<string[]>([])
const rangeDate = ref<[]>([])

// 获取数据
const doSearch = () => {
  props.onSearch?.(searchParams)
}
/**
 * 每次点击时间触发 参数改变
 * @param dates
 */
const onDateChange = (dates: any[]) => {
  if(dates.length < 2){
    searchParams.startEditTime = undefined
    searchParams.endEditTime = undefined
  }else {
    searchParams.startEditTime = dates[0].toDate
    searchParams.endEditTime = dates[1].toDate
  }
}

const rangePresets = ref([
  { label: '过去 7 天', value: [dayjs().add(-7, 'd'), dayjs()] },
  { label: '过去 14 天', value: [dayjs().add(-14, 'd'), dayjs()] },
  { label: '过去 30 天', value: [dayjs().add(-30, 'd'), dayjs()] },
  { label: '过去 90 天', value: [dayjs().add(-90, 'd'), dayjs()] },
])


// 获取categoryList和tagList
const getCategoryTagList = async () => {
  const res = await getTagAndCategoryUsingGet()
  if (res.data.code === 0 && res.data.data) {
    console.log(res.data.data);
    // 转换成下拉选项组件接受的格式
    categoryList.value = (res.data.data.categories?? []).map((data:string) => {
      return {
        label: data,
        value: data,
      }
    })
    tagList.value = (res.data.data.tags?? []).map((data:string) => {
      return {
        label: data,
        value: data,
      }
    })
  } else {
    message.error('加载分类标签失败，' + res.data.message)
  }
}
// 重置表单
const resetForm = () => {
  // 取消所有对象的值
  Object.keys(searchParams).forEach((key) => {
    searchParams[key] = undefined
  })
  rangeDate.value = []
  props.onSearch?.(searchParams)
}
onMounted(() => {
  getCategoryTagList()
})
</script>

<style scoped>
.picture-search-form  .ant-form-item {
  margin-top: 16px;
}

</style>
