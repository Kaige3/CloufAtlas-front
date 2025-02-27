<template>
  <div class="space-usage">
      <a-card title="用户上传分析">
        <template #extra>
          <a-space>
            <a-segmented v-model:value="timeDimension" :options="timeDimensionOptions" style="width: 100%"/>
           <a-input placeholder="请输入用户id" enter-button="搜索用户" @search="doSearch" style="width: 100%"/>
          </a-space>
        </template>
        <v-chart :option="options" style="height: 300px"></v-chart>
      </a-card>
  </div>
</template>

<script setup lang="ts">

import {computed, ref, watchEffect} from "vue";
import {getSpaceUploadTimeAnalyzeUsingPost } from "@/api/spaceAnalyzeController";
import {message} from "ant-design-vue";
import {formatSize} from "../../utils";
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
const data = ref<API.SpaceUserAnalyzeVo[]>([]);
const loading = ref(true);
const userId = ref<string>();
const timeDimension = ref<string>('day');

const timeDimensionOptions = [
  { label: '日', value: 'day' },
  { label: '周', value: 'week' },
  { label: '月', value: 'month' }
]
// 加载数据
const fetchData = async () => {
  loading.value = true;
  const res = await getSpaceUploadTimeAnalyzeUsingPost({
    queryAll: props.queryAll,
    queryPublic: props.queryPublic,
    spaceId: props.spaceId,
    timeDimension: timeDimension.value,
    userId: props.userId
  });
  if (res.data.code === 0 && res.data.data) {
    data.value = res.data.data;
    console.log("用户上传分析===="+JSON.stringify(data.value));
  } else {
    message.error("获取数据失败"+res.data.message);
  }
  loading.value = false;
}
// 动态生成 option
// 使用 computed 动态生成 options
const options = computed(() => {
  const xAxisData = data.value.map(item => item.period);
  const seriesData = data.value.map(item => parseInt(item.count));

  return {
    xAxis: {
      type: 'category',
      data: xAxisData,
      name: '时间'
    },
    yAxis: {
      type: 'value',
      name: '上传数量',
    },
    series: [
      {
        name: '上传数量',
        data: seriesData,
        type: 'line',
        smooth: true,
        emphasis: {
          focus: 'series'
        }
      }
    ]
  };
});
watchEffect(() => {
  fetchData();
})
</script>

<style scoped>

</style>
