<template>
  <div>
    <!-- 空间信息 -->
    <a-flex justify="space-between">
      <h2>{{ space.spaceName }}（{{ SPACE_TYPE_MAP[space.spaceType]}}）</h2>
      <a-space size="middle">
        <a-button v-if="canUpload" type="primary" :href="`/add_picture?spaceId=${id}`" target="_blank">
          + 创建图片
        </a-button>
        <a-button
          v-if="canManageSpaceUser"
          type="primary"
          ghost
          :icon="h(TeamOutlined)"
          :href="`/spaceUserManage/${id}`"
          target="_blank"
        >
          成员管理
        </a-button>

        <a-button
          v-if="canManageSpaceUser"
          type="primary"
                  ghost
                  :icon="h(BarChartOutlined)"
                  :href="`/SpaceAnalyzePage?spaceId=${id}`"
                  target="_blank">
          空间分析
        </a-button>

        <a-button
          v-if="canEdit"
          :icon="h(EditOutlined)"
                  @click="doBatchEdit"
        >
          + 批量修改图片
        </a-button>

        <a-tooltip
          :title="`占用空间 ${formatSize(space.totalSize)} / ${formatSize(space.maxSize)}`"
        >
          <a-progress
            type="circle"
            :percent="((space.totalSize * 100) / space.maxSize).toFixed(1)"
            :size="42"
          />
        </a-tooltip>
      </a-space>
    </a-flex>
    <PictureSearch :on-search="onSearch"/>

    <!--      按照颜色搜索-->
    <!-- 按颜色搜索 -->
    <a-form-item label="按颜色搜索" style="margin-top: 16px">
      <color-picker format="hex" @pureColorChange="onColorChange" />
    </a-form-item>


    <!-- 图片列表 -->
    <PictureList
      :dataList="dataList"
      :loading="loading"
      :show-op="true"
      :on-reload="fetchData"
      :can-delete="canDelete"
      :can-edit="canEdit"
    />
<!--    批量修改图片-->
    <BatchEditePicture ref="batchEditPictureModalRef"
                       :spaceId="id"
                       :pictureList="dataList"
                       :onSuccess="onBatchEditPictureSuccess"/>
    <a-pagination
      style="text-align: right"
      v-model:current="searchParams.current"
      v-model:pageSize="searchParams.pageSize"
      :total="total"
      :show-total="() => `图片总数 ${total} / ${space.maxCount}`"
      @change="onPageChange"
    />
  </div>
</template>

<script setup lang="ts">
import {computed, h, onMounted, ref, watch} from "vue";
import {getSpaceVoByIdUsingGet} from "@/api/spaceController";
import {message} from "ant-design-vue";
import {
  listPictureVoByPageUsingPost,
  searchPictureByColorUsingPost
} from "@/api/pictureController";
import {formatSize} from "@/utils";
import PictureList from "@/components/PictureList.vue";
import PictureSearch from "@/pages/picture/PictureSearch.vue";
import {ColorPicker} from "vue3-colorpicker";
import BatchEditePicture from "@/components/BatchEditePicture.vue";
import {EditOutlined,BarChartOutlined,TeamOutlined} from "@ant-design/icons-vue";
import {SPACE_PERMISSION_ENUM, SPACE_TYPE_ENUM, SPACE_TYPE_MAP} from "../../constants/space";

const props = defineProps<{
  id: string | number
}>()

const space = ref<API.SpaceVO>({})
// 数据
const dataList = ref([])
const total = ref(0)
const loading = ref(true)
const batchEditPictureModalRef = ref()

// 获取空间详情
const fetchSpaceDetail = async () => {
  try {
    const res = await getSpaceVoByIdUsingGet({
      id: props.id,
    })
    if (res.data.code === 0 && res.data.data) {
      space.value = res.data.data
    } else {
      message.error('获取空间详情失败，' + res.data.message)
    }
  } catch (e: any) {
    message.error('获取空间详情失败：' + e.message)
  }
}


// 搜索条件
const searchParams = ref<API.PictureQueryDto>({
  current: 1,
  pageSize: 12,
  sortField: 'createTime',
  sortOrder: 'descend',
})

// 分页参数
const onPageChange = (page, pageSize) => {
  searchParams.value.current = page
  searchParams.value.pageSize = pageSize
  fetchData()
}

// 执行搜索按钮
const onSearch = (newSearchParams: API.PictureQueryDto) => {
  searchParams.value = {
    ...searchParams.value,
    ...newSearchParams,
    current: 1,
  }
  fetchData()
}

// 获取数据列表
const fetchData = async () => {
  loading.value = true
  // 转换搜索参数
  const params = {
    spaceId: props.id,
    ...searchParams.value,
  }
  const res = await listPictureVoByPageUsingPost(params)
  if (res.data.data) {
    dataList.value = res.data.data.records ?? []
    total.value = res.data.data.total ?? 0
  } else {
    message.error('获取数据失败，' + res.data.message)
  }
  loading.value = false
}

// 当颜色发生变化时，触发搜索图片
const onColorChange = async (color: string) => {
  const res = await searchPictureByColorUsingPost({
    picColor: color,
    spaceId: props.id,
  })
  if (res.data.code === 0 && res.data.data) {
    const data = res.data.data ?? []
    dataList.value = data
    total.value = data.length
  }else {
    message.error('获取数据失败，' + res.data.message)
  }
}

// 控制批量修改图片的弹窗
const doBatchEdit = () => {
  if (batchEditPictureModalRef.value) {
    batchEditPictureModalRef.value.handleOk()
  }
  console.log("点击考虑")
}
function createPermissionChecker(permission: string) {
  return computed(() => {
    return (space.value.permissionList ??[]).includes(permission);
  });
}
// 权限
const canManageSpaceUser = createPermissionChecker(SPACE_PERMISSION_ENUM.SPACE_USER_MANAGE);
const canUpload = createPermissionChecker(SPACE_PERMISSION_ENUM.PICTURE_UPLOAD);
const canEdit = createPermissionChecker(SPACE_PERMISSION_ENUM.PICTURE_EDIT);
const canDelete = createPermissionChecker(SPACE_PERMISSION_ENUM.PICTURE_DELETE);

// 批量修改图片成功回调函数
const onBatchEditPictureSuccess = () => {
  fetchData()
}
// 切换空间时，重新加载数据
watch(() => props.id, () => {
  fetchData()
  fetchSpaceDetail()
})

// 页面加载时请求一次
onMounted(() => {
  fetchData()
  fetchSpaceDetail()
})

</script>

<style scoped>

</style>
