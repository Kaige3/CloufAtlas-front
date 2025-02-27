<template>
  <div class="space-tags">
    <a-card title="图库标签分析">
      <v-chart :option="options" style="height: 300px"></v-chart>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import VChart from "vue-echarts";
import "echarts";
import 'echarts-wordcloud';

import {computed, ref, watchEffect} from "vue";
import { getSpaceTagAnalyzeUsingPost} from "@/api/spaceAnalyzeController";
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
const tagdata = ref<API.SpaceTagAnalyzeVo[]>([]);
const loading = ref(true);
// 假设这是从接口获取的数据



// 初始化 ECharts 实例


// 设置词云图配置
const options = computed(() => {
  // 将 dataList.value 转换为 ECharts 所需的格式
  const tagData = tagdata.value.map((item) => ({
    name: item.tag,  // 提取 tag 作为词云的 name
    value: item.count, // 提取 count 作为词云的 value
  }));

  // 返回 ECharts 的配置项
  return {
    tooltip: {
      trigger: 'item', // 触发类型为数据项
      formatter: (params: any) => `${params.name}: ${params.value} 次`, // 格式化提示框内容
    },
    series: [
      {
        type: 'wordCloud', // 词云图类型
        gridSize: 10, // 网格大小，控制词与词之间的间距
        sizeRange: [12, 50], // 字体大小范围
        rotationRange: [-90, 90], // 旋转角度范围
        shape: 'circle', // 词云形状为圆形
        textStyle: {
          // 随机颜色
          color: () =>
            `rgb(${Math.round(Math.random() * 255)}, ${Math.round(
              Math.random() * 255,
            )}, ${Math.round(Math.random() * 255)})`,
        },
        data: tagData, // 词云数据
      },
    ],
  };
});




// 加载数据
const fetchData = async () => {
  loading.value = true;
  const res = await getSpaceTagAnalyzeUsingPost({
    queryAll: props.queryAll,
    queryPublic: props.queryPublic,
    spaceId: props.spaceId,
  });
  if (res.data.code === 0 && res.data.data) {
    tagdata.value = res.data.data;
    console.log("拿到的标签分析"+JSON.stringify(tagdata.value));
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
