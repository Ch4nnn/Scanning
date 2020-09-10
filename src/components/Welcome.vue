<template>
<div>
  <el-container>
    <el-aside width=70%>
      <el-form :model="formMeg">
        <el-input
            type="textarea"
            :rows="10"
            placeholder="请输入内容"
            v-model="formMeg.hosts">
        </el-input>
      </el-form>
      <div>
        <el-row type="flex" class="row-bg" justify="center">
          <el-col :span="6">
            <el-button class="btns" type="primary" icon="el-icon-search" @click="Sanning">  扫描</el-button></el-col>
        </el-row>
      </div>
    </el-aside>
    <el-main>
      <div class="block">
        <el-timeline>
          <el-timeline-item
              v-for="(activity, index) in activities"
              :key="index"
              :icon="activity.icon"
              :type="activity.type"
              :color="activity.color"
              :size="activity.size"
              :timestamp="activity.date_done">
            {{activity.task_args}}
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-main>
  </el-container>
</div>
</template>

<script>
export default {
  name: "Welcome",
  data() {
    return {
      activities: [],
      formMeg:{
        hosts: 'https://cuiqingcai.com/'
      }
    }
  },

  created(){
    this.GetScanLog()
  },

  // cuiqingcai.com
  methods:{
    async Sanning(){
      const {data:res } = await this.$http.post('api/tasks/scannamp/',this.formMeg);
      //console.log(res)
      if(res.code !== 200) return this.$message.error(res.msg)
      else this.$message.success("添加扫描成功,正在扫描")
    },
    async GetScanLog(){
      const {data:res} = await this.$http.get('api/tasks/taskresult/')
      if(res.code !== 200) return this.$message.error(res.msg)
      //console.log(res)
      this.activities=res.data.results
      // console.log(this.activities)
    },
  },

}
</script>

<style scoped>
.btns {
  display: flex;
  justify-content: flex-end;
  margin-top: 5%;
  size: 200px;

}
</style>
