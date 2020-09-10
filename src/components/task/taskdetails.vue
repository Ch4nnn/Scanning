<template>
<div>
  <!--面包屑导航区-->
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>任务列表</el-breadcrumb-item>
    <el-breadcrumb-item>扫描结果</el-breadcrumb-item>
  </el-breadcrumb>

  <el-container>
    <el-aside width="200px">
      <span>任务介绍</span>


    </el-aside>
    <el-main>
      <el-progress type="circle" :percentage="10"></el-progress>
    </el-main>
  </el-container>
</div>
</template>

<script>
export default {
  name: "taskdetails"
}
</script>

<style scoped>

</style>
