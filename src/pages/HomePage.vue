<template>
  <div id="picture-manage">
    <!-- 搜索框 -->
    <div class="search-bar">
      <a-input-search
        placeholder="从海量图片中搜索"
        v-model:value="searchParams.searchText"
        enter-button="搜索"
        size="large"
        @search="doSearch"
      />
    </div>
    <!-- 分类 + 标签 -->
    <a-tabs v-model:activeKey="selectedCategory" @change="doSearch">
      <a-tab-pane key="all" tab="全部" />
      <a-tab-pane v-for="category in categoryList" :key="category" :tab="category" />
    </a-tabs>
    <div class="tag-bar" style="margin-bottom: 16px">
      <span style="margin-right: 8px">标签：</span>
      <a-space :size="[0, 8]" wrap>
        <a-checkable-tag
          v-for="(tag, index) in tagList"
          :key="tag"
          v-model:checked="selectedTagList[index]"
          @change="doSearch"
        >
          {{ tag }}
        </a-checkable-tag>
      </a-space>
    </div>

    <!-- 图片列表 -->
    <PictureList :data-list="dataList" :loading="loading"/>
    <a-pagination
      style="text-align: right"
      v-model:current="searchParams.current"
      v-model:pageSize="searchParams.pageSize"
      :total="total"
      @change="pagination.onChange"
    />
  </div>

</template>

<script setup lang="ts">
// 数据
import {computed, onMounted, reactive, ref} from "vue";
import {getTagAndCategoryUsingGet, listPictureVoByPageUsingPost} from "@/api/pictureController";
import {message} from "ant-design-vue";
import {useRouter} from "vue-router";
import PictureList from "@/components/PictureList.vue";

const dataList = ref([])
const total = ref(0)
const loading = ref(true)

// 搜索条件
const searchParams = reactive<API.PictureQueryDto>({
  current: 1,
  pageSize: 12,
  sortField: 'createTime',
  sortOrder: 'descend',
})

// 分页参数
const pagination = computed(() => {
  return {
    current: searchParams.current ?? 1,
    pageSize: searchParams.pageSize ?? 10,
    total: total.value,
    // 切换页号时，会修改搜索参数并获取数据
    onChange: (page, pageSize) => {
      searchParams.current = page
      searchParams.pageSize = pageSize
      fetchData()
    },
  }
})

// 获取数据
const fetchData = async () => {
  loading.value = true
  // 转换搜索参数
  const params = {
    ...searchParams,
    tags: [],
  }
  if (selectedCategory.value !== 'all') {
    params.category = selectedCategory.value
  }
  selectedTagList.value.forEach((useTag, index) => {
    if (useTag) {
      params.tags.push(tagList.value[index])
    }
  })
  const res = await listPictureVoByPageUsingPost(params)
  if (res.data.data) {
    dataList.value = res.data.data.records ?? []
    total.value = res.data.data.total ?? 0
  } else {
    message.error('获取数据失败，' + res.data.message)
  }
  loading.value = false
}

// const fetchData = async () => {
//   loading.value = true
//   const res = await listPictureVoByPageUsingPost(searchParams)
//   if (res.data.data) {
//     dataList.value = res.data.data.records ?? []
//     total.value = res.data.data.total ?? 0
//   } else {
//     message.error('获取数据失败，' + res.data.message)
//   }
//   loading.value = false
// }

const doSearch = () => {
  // 重置搜索条件
  searchParams.current = 1
  fetchData()
}

const router = useRouter()
// 跳转至图片详情
const doClickPicture = (picture) => {
  router.push({
    path: `/picture/${picture.id}`,
  })
}


const categoryList = ref<string[]>([])
const selectedCategory = ref<string>('all')
const tagList = ref<string[]>([])
const selectedTagList = ref<string[]>([])

// 获取标签和分类选项
const getTagCategoryOptions = async () => {
  const res = await getTagAndCategoryUsingGet()
  if (res.data.code === 0 && res.data.data) {
    // 转换成下拉选项组件接受的格式
    categoryList.value = res.data.data.categories ?? []
    tagList.value = res.data.data.tags ?? []
  } else {
    message.error('加载分类标签失败，' + res.data.message)
  }
}

onMounted(() => {
  getTagCategoryOptions()
})



// 页面加载时请求一次
onMounted(() => {
  fetchData()
})


</script>

<style scoped>
#picture-manage .search-bar{
  max-width: 480px;
  margin: 0 auto 16px;
}

</style>
