<template>
  <div class="picture-list">
    <!-- 图片列表 -->
    <a-list
      :grid="{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 6 }"
      :data-source="dataList"
      :loading="loading"
    >
      <template #renderItem="{ item: picture }">
        <a-list-item style="padding: 0">
          <!-- 单张图片 -->
          <a-card hoverable @click="doClickPicture(picture)">
            <template #cover>
              <img
                style="height: 180px; object-fit: cover"
                :alt="picture.name"
                :src="picture.thumbnailUrl ?? picture.url"
                loading="lazy"
              />
            </template>

            <a-card-meta :title="picture.name">
              <template #description>
                <a-flex>
                  <a-tag color="green">
                    {{ picture.category ?? '默认' }}
                  </a-tag>
                  <a-tag v-for="tag in picture.tags" :key="tag">
                    {{ tag }}
                  </a-tag>
                </a-flex>
              </template>
            </a-card-meta>
            <template v-if="showOp" #actions>
              <a-space @click="(e) =>doSharePicture(picture,e)">
                <eye-outlined />
                分享
              </a-space>
              <a-space @click="(e) =>doSearch(picture,e)">
                <search-outlined />
                搜索
              </a-space>
              <a-space v-if="canEdit" @click="(e) =>doEdit(picture,e)">
                <edit-outlined />
                编辑
              </a-space>
              <a-space v-if="canDelete" @click="(e) =>doDelete(picture,e)">
                <delete-outlined />
                删除
              </a-space>
            </template>
          </a-card>
        </a-list-item>
      </template>
    </a-list>
    <SharePicture ref="shareModelRef" :link="shareLink"/>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import {deletePictureUsingPost} from "@/api/pictureController";
import {message} from "ant-design-vue";
import SharePicture from "@/components/SharePicture.vue";
import {ref} from "vue";

interface Props {
  dataList?: API.PictureVO[]
  loading?: boolean
  showOp?: boolean
  onReload?: () => void
  canEdit?: boolean
  canDelete?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  dataList: () => [],
  loading: false,
  showOp: false,
  canEdit: false,
  canDelete: false,
})

// 跳转至图片详情
const doClickPicture = (picture:API.PictureVO) => {
  router.push({
    path: `/picture/${picture.id}`,
  })
}
const router = useRouter()
const shareModelRef = ref()
const shareLink = ref<string>();

const doSharePicture = (picture:API.PictureVO,e:Event) => {
  e.stopPropagation()
  shareLink.value = `${window.location.protocol}//${window.location.host}/picture/${picture.id}`;
  if(shareModelRef.value) {
    shareModelRef.value.handleOk()
  }
}

// 编辑图片
const doEdit = (picture,e) => {
  e.stopPropagation()
  router.push({
    path: '/add_picture',
    query: {
      id: picture.id,
      spaceId: picture.spaceId,
    },
  })
}

// 删除图片
const doDelete = async (picture,e) => {
  e.stopPropagation()
  const id = picture.id
  if(!id){
    return
  }
  const res = await deletePictureUsingPost({id})
  if(res.data.code === 0){
    message.success('删除成功')
    props?.onReload?.()
  }else{
    console.error(res.data)
    message.error('删除失败')
  }
}

//  搜索图片
const doSearch = (picture,e) => {
  e.stopPropagation()
  window.open(`/search_picture?pictureId=${picture.id}`)
}
</script>

<style scoped></style>
