<template>
  <div class="space-usage">
    <a-card title="图库图片大小分析">

      <v-chart :option="options" style="height: 300px"></v-chart>
    </a-card>
  </div>
</template>

<script setup lang="ts">

import {computed, ref, watchEffect} from "vue";
import {getSpaceRangeAnalyzeUsingPost } from "@/api/spaceAnalyzeController";
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
const data = ref<API.SpaceSizeAnalyzeVo[]>([]);
const loading = ref(true);

// 加载数据
const fetchData = async () => {
  loading.value = true;
  const res = await getSpaceRangeAnalyzeUsingPost({
    queryAll: props.queryAll,
    queryPublic: props.queryPublic,
    spaceId: props.spaceId,
  });
  if (res.data.code === 0 && res.data.data) {
    data.value = res.data.data;
    console.log("图库图片大小分析===="+JSON.stringify(data.value));
  } else {
    message.error("获取数据失败"+res.data.message);
  }
  loading.value = false;
}
// 动态生成 option
// 使用 computed 动态生成 options
const options = {
  title: {
    text: '文件大小分布', // 标题
    subtext: '基于文件大小区间的统计', // 副标题
    left: 'center' // 标题居中
  },
  tooltip: {
    trigger: 'item', // 触发类型为数据项
    formatter: (params) => {
      const { name, value, percent } = params;
      return `${name}: ${value} 个 (${percent}%)`; // 自定义提示框内容
    }
  },
  legend: {
    orient: 'vertical', // 图例垂直排列
    left: 'left' // 图例靠左
  },
  series: [
    {
      name: '文件大小分布', // 系列名称
      type: 'pie', // 饼图类型
      radius: '50%', // 饼图半径
      data: [
        { value: 126, name: '<100KB' }, // 数据项 1
        { value: 3, name: '100KB~500KB' }, // 数据项 2
        { value: 2, name: '500KB~1MB' }, // 数据项 3
        { value: 0, name: '>10MB' } // 数据项 4
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10, // 高亮阴影模糊大小
          shadowOffsetX: 0, // 高亮阴影水平偏移
          shadowColor: 'rgba(0, 0, 0, 0.5)' // 高亮阴影颜色
        }
      }
    }
  ]
};
watchEffect(() => {
  fetchData();
})
</script>

<style scoped>

</style>
