<template>
  <div>
    <h2>空间图库分析
      <span v-if="queryAll">全部空间</span>
      <span v-else-if="queryPublic">公开空间</span>
      <span v-else>
        <a href="`/space/${spaceId}`" target="_blank">id:{{ spaceId}}</a>
      </span>
    </h2>
    <a-row :gutter="[16, 16]">
      <a-col :span="12">
        <SpaceUsageAnalyze :query-all="queryAll" :query-public="queryPublic" :space-id="spaceId"/>
      </a-col>
      <a-col :span="12">
        <SpaceCategoryAnalyze :query-all="queryAll" :query-public="queryPublic" :space-id="spaceId"/>
      </a-col>
      <a-col :span="12">
        <SpaceTagsAnalyze :query-all="queryAll" :query-public="queryPublic" :space-id="spaceId"/>
      </a-col>
      <a-col :span="12">
        <SpaceUserUploadAnalyze :query-all="queryAll" :query-public="queryPublic" :space-id="spaceId" time-dimension="day"/>
      </a-col>
      <a-col :span="12">
        <SpacePictureSizeAnalyze :query-all="queryAll" :query-public="queryPublic" :space-id="spaceId"/>
      </a-col>
      <a-col :span="12">
        <SpaceTopAnalyze
          v-if="isAdmin"
          :query-all="queryAll"
          :query-public="queryPublic"
          :space-id="spaceId"/>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">

import SpaceUsageAnalyze from "@/components/analyze/SpaceUsageAnalyze.vue";
import SpaceCategoryAnalyze from "@/components/analyze/SpaceCategoryAnalyze.vue";
import SpaceTagsAnalyze from "@/components/analyze/SpaceTagsAnalyze.vue";
import SpaceUserUploadAnalyze from "@/components/analyze/SpaceUserUploadAnalyze.vue";
import SpacePictureSizeAnalyze from "@/components/analyze/SpacePictureSizeAnalyze.vue";
import SpaceTopAnalyze from "@/components/analyze/SpaceTopAnalyze.vue";
import {computed} from "vue";
import {useRoute} from "vue-router";
import {useLoginUserStore} from "@/store/user";

const route = useRoute();
const loginUserStore = useLoginUserStore();
const longinUser = loginUserStore.loginUser;

const isAdmin = computed(() =>{
  return longinUser?.userRole === "admin"
});

// 空间id
const spaceId = computed(() =>{
  return route.query?.spaceId as string
});
// 是否查询所有空间
const queryAll = computed(() =>{
  return !!route.query?.queryAll
});
// 是否查询公开空间
const queryPublic = computed(() =>{
  return !!route.query?.queryPublic
});
</script>

<style scoped>

</style>
