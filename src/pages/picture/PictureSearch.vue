<template>
  <div>

  </div>
</template>

<script setup lang="ts">

import PictureQueryDto = API.PictureQueryDto;
import {reactive} from "vue";

interface Props {
  onSearch?: (searchParams: PictureQueryDto) => void
}

const props = defineProps<Props>()
// 搜索条件
const searchParams = reactive<API.PictureQueryDto>({})

// 获取数据
const doSearch = () => {
  props.onSearch?.(searchParams)
}



</script>

<style scoped>

</style>
