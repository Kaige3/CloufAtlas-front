<template>
<div id="searchPicturePage">
  <h2 style="margin-bottom: 16px">以图搜图</h2>
  <h3 style="margin: 16px 0">原图</h3>
  <a-card style="width: 240px">
    <template #cover>
      <img
        :alt="picture.name"
        :src="picture?.thumbnailUrl"
        style="width: 100%" />
    </template>
  </a-card>
  <h3 style="margin: 16px 0">搜索结果</h3>
   <a-list
   :grid="{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 5, xxl: 6 }"
   :data-source="searchResult"
   >
     <template #renderItem="{ item }">
       <a-list-item style="padding: 0"
       >
         <a-card>
           <template #cover>
             <img
               :alt="item.title"
               :src="item.imgUrl"
               style="width: 100%" />
           </template>
         </a-card>
       </a-list-item>
     </template>

   </a-list>

</div>
</template>

<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import {getPictureVoByIdUsingGet, searchPictureUsingPost} from "@/api/pictureController";
import {message} from "ant-design-vue";

const route = useRoute();
const picture = ref<API.PictureVO>({})

// 从路由参数获取id
const pictureId = computed(() => {
  return route.query?.pictureId;
})
const searchResult = ref<API.SoImageSearchDto[]>([])

// 获取老数据
const getOldPicture = async () =>{
  const id = route.query?.id;
  if(id){
    const res = await  getPictureVoByIdUsingGet({
      id:id,
    })
    if(res.data.code === 0 && res.data.data) {
      picture.value = res.data.data;
    }
  }
}
// 获取图片搜图结果
const getSearchResult = async () => {

  const res = await  searchPictureUsingPost({
    id:pictureId.value,
  })
  if(res.data.code === 0 && res.data.data) {
    searchResult.value = res.data.data ?? []
    console.log(searchResult);
  } else {
    message.error('获取图片搜图结果失败，' + res.data.message)
  }

}


onMounted(() => {
  getOldPicture()
  getSearchResult()
})
</script>

<style scoped>
#addPicturePage {
  max-width: 720px;
  margin: 0 auto;
}
</style>
