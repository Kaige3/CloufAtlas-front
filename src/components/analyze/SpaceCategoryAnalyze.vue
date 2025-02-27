<template>
  <div class="space-usage">
      <a-card title="图库分类分析">
        <v-chart :option="options" style="height: 300px"></v-chart>
      </a-card>
  </div>
</template>

<script setup lang="ts">
import VChart from "vue-echarts";
import "echarts";

import {computed, ref, watchEffect} from "vue";
import {getSpaceCategoryAnalyzeUsingPost} from "@/api/spaceAnalyzeController";
import {message} from "ant-design-vue";


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
const data = ref<API.SpaceCategoryAnalyzeVo[]>([]);
const loading = ref(true);
// 假设这是从接口获取的数据

// 动态生成 option
const options = computed(() => {
  const categories = data.value.map((item) => item.category)
  const countData = data.value.map((item) => item.count)
  const sizeData = data.value.map((item) => (item.totalSize / (1024 * 1024)).toFixed(2)) // 转为 MB

  return {
    tooltip: { trigger: 'axis' },
    legend: { data: ['图片数量', '图片总大小'], top: 'bottom' },
    xAxis: { type: 'category', data: categories },
    yAxis: [
      {
        type: 'value',
        name: '图片数量',
        axisLine: { show: true, lineStyle: { color: '#5470C6' } }, // 左轴颜色
      },
      {
        type: 'value',
        name: '图片总大小 (MB)',
        position: 'right',
        axisLine: { show: true, lineStyle: { color: '#91CC75' } }, // 右轴颜色
        splitLine: {
          lineStyle: {
            color: '#91CC75', // 调整网格线颜色
            type: 'dashed', // 线条样式：可选 'solid', 'dashed', 'dotted'
          },
        },
      },
    ],
    series: [
      { name: '图片数量', type: 'bar', data: countData, yAxisIndex: 0 },
      { name: '图片总大小', type: 'bar', data: sizeData, yAxisIndex: 1 },
    ],
  }
})



// // 初始化 ECharts 实例并渲染图表
// const chart = echarts.init(document.getElementById('chart-container'));
// chart.setOption(options);
// 加载数据
const fetchData = async () => {
  loading.value = true;
  const res = await getSpaceCategoryAnalyzeUsingPost({
    queryAll: props.queryAll,
    queryPublic: props.queryPublic,
    spaceId: props.spaceId,
  });
  if (res.data.code === 0 && res.data.data) {
    data.value = res.data.data;
    console.log("拿到的分类分析"+JSON.stringify(data.value));
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
