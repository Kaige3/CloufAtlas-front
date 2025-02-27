<template>
  <div class="space-usage">
    <a-flex gap="middle">
      <a-card title="存储空间">
        <div>
          <h3>{{ formatSize(data.usedSize)}} / {{ formatSize(data.maxSize)}}</h3>
          <a-progress type="dashboard" :percent="data.sizeUsageRatio ?? 0"/>
        </div>
      </a-card>
      <a-card title="文件数量">
        <div>
          <h3>{{ data.usedCount }} / {{ data.maxCount}}</h3>
          <a-progress type="dashboard" :percent="data.countUsageRatio ?? 0"/>
        </div>
      </a-card>
    </a-flex>
  </div>
</template>

<script setup lang="ts">

import {ref, watchEffect} from "vue";
import {getSpaceUsageAnalyzeUsingPost} from "@/api/spaceAnalyzeController";
import {message} from "ant-design-vue";
import {formatSize} from "../../utils";

interface Props {
  queryAll?: boolean
  queryPublic?: boolean
  spaceId?: string
}
const props = withDefaults(defineProps<Props>(), {
  queryAll: () => false,
  queryPublic: () => false,
})

// 图标数据
const data = ref<API.SpaceUsageAnalyzeVo>({});
const loading = ref(true);

// 加载数据
const fetchData = async () => {
  loading.value = true;
  const res = await getSpaceUsageAnalyzeUsingPost({
    queryAll: props.queryAll,
    queryPublic: props.queryPublic,
    spaceId: props.spaceId,
  });
  if (res.data.code === 0 && res.data.data) {
    data.value = res.data.data;
  } else {
    message.error("获取数据失败"+res.data.message);
  }
  loading.value = false;
}
watchEffect(() => {
  fetchData();
})
</script>

<style scoped>

</style>
