<template>
  <div class="space-usage">
    <a-card title="空间使用排行">
      <v-chart :option="options" style="height: 300px"></v-chart>
    </a-card>
  </div>
</template>

<script setup lang="ts">

import {computed, ref, watchEffect} from "vue";
import {getSpaceRankAnalyzeUsingPost } from "@/api/spaceAnalyzeController";
import {message} from "ant-design-vue";
import VChart from "vue-echarts";
import "echarts";
interface Props {
  queryAll?: boolean
  queryPublic?: boolean
  spaceId?: string
  timeDimension: string,
  userId?: number
}
const props = withDefaults(defineProps<Props>(), {
  queryAll: () => false,
  queryPublic: () => false,
})

// 图标数据
const data = ref<API.Space[]>([]);
const loading = ref(true);

// 加载数据
const fetchData = async () => {
  loading.value = true;
  const res = await getSpaceRankAnalyzeUsingPost({
    queryAll: props.queryAll,
    queryPublic: props.queryPublic,
    spaceId: props.spaceId,
  });
  if (res.data.code === 0 && res.data.data) {
    data.value = res.data.data;
    console.log("空间使用排行===="+JSON.stringify(data.value));
  } else {
    message.error("获取数据失败"+res.data.message);
  }
  loading.value = false;
}
// 动态生成 option
// 使用 computed 动态生成 options
const options = computed(() => {
  return {
    xAxis: {
      type: 'category',
      data: data.value.map((item) => item.spaceName) // X 轴数据：空间名称
    },
    yAxis: {
      type: 'value',
      name: '空间使用量（MB）' // Y 轴名称
    },
    series: [
      {
        name: '空间使用量',
        data: data.value.map((item) => (item.totalSize / (1024 * 1024)).toFixed(2)),// Y 轴数据：总大小
        type: 'bar',
        label: {
          show: true, // 显示数据标签
          position: 'top', // 标签位置
        }
      }
    ]
  }
}
)
watchEffect(() => {
  fetchData();
})
</script>

<style scoped>

</style>
