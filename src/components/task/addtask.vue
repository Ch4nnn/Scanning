<template>
<div>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item><a href="/">活动管理</a></el-breadcrumb-item>
    <el-breadcrumb-item>创建任务</el-breadcrumb-item>
  </el-breadcrumb>

  <el-divider></el-divider>

  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
    <el-form-item label="任务名称" prop="name">
      <el-col :span="10">
      <el-input v-model="ruleForm.name" placeholder="任务名称"></el-input>
      </el-col>
    </el-form-item>

    <el-form-item label="描述" prop="description">
      <el-col :span="10">
      <el-input v-model="ruleForm.description" placeholder="描述"></el-input>
      </el-col>
    </el-form-item>

    <el-form-item label="扫描模块" prop="trigger">
      <el-checkbox-group v-model="ruleForm.checkList">
        <el-checkbox label="nmap扫描端口" name="type" :true-label="1" value="nmap"></el-checkbox>
        <el-checkbox label="awvs扫描漏洞" name="type" v-model="checked1" value="awvs"></el-checkbox>
        <el-checkbox label="其他 + 1" name="type" v-model="checked_nmap"></el-checkbox>
        <el-checkbox label="其他 + 2" name="type"></el-checkbox>
      </el-checkbox-group>

    </el-form-item>
    <el-form-item label="调度方式" prop="trigger">
      <el-select v-model="ruleForm.trigger" placeholder="请认真选择调度方式" clearable="true" @change="currStationChange">
        <el-option label="直接调用" value="once"></el-option>
        <el-option label="data (单次任务)" value="data"></el-option>
        <el-option label="cron (cron 类任务)" value="cron"></el-option>
        <el-option label="interval (间隔性任务)" value="interval"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label=资产目标 prop="description" v-if="ruleForm.trigger=='once'">
      <el-form :model="ruleForm.formMeg">
      <el-input
          type="textarea"
          :rows="10"
          placeholder="请输入内容"
          v-model="ruleForm.formMeg.hosts">
      </el-input>
    </el-form>
    </el-form-item>

    <el-form-item label="运行时间" required v-if="ruleForm.trigger=='data'">
      <div>
        <el-col :span="3">
          <el-form-item prop="">
            <el-date-picker type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期" v-model="ruleForm.configuration.run_date" style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-col>
      </div>

    </el-form-item>
    <el-form-item label="年" prop="name" v-if="ruleForm.trigger=='cron'">
      <el-col :span="2">
        <el-input v-model="ruleForm.configuration.year" placeholder="年"></el-input>
      </el-col>
    </el-form-item>
    <el-form-item label="月" prop="name" v-if="ruleForm.trigger=='cron'">
      <el-col :span="2">
        <el-input v-model="ruleForm.configuration.month" placeholder="月"></el-input>
      </el-col>
    </el-form-item>
    <el-form-item label="周" prop="name" v-if="ruleForm.trigger=='cron' || select_change=='interval'">
      <el-col :span="2">
      <el-input v-model="ruleForm.configuration.weeks" placeholder="周"></el-input>
      </el-col>
    </el-form-item>
    <el-form-item label="每周几" prop="name" v-if="ruleForm.trigger=='cron'">
      <el-col :span="2">
        <el-input v-model="ruleForm.configuration.day_of_week" placeholder="每周几"></el-input>
      </el-col>
    </el-form-item>
    <el-form-item label="天" prop="name" v-if="ruleForm.trigger=='cron' || ruleForm.trigger=='interval'">
      <el-col :span="2">
      <el-input v-model="ruleForm.configuration.days" placeholder="天"></el-input>
      </el-col>
    </el-form-item>
    <el-form-item label="时" prop="name" v-if="ruleForm.trigger=='cron' || ruleForm.trigger=='interval'">
      <el-col :span="2">
      <el-input v-model="ruleForm.configuration.hours" placeholder="时"></el-input>
      </el-col>
    </el-form-item>
    <el-form-item label="分" prop="name" v-if="ruleForm.trigger=='cron' || ruleForm.trigger=='interval'">
      <el-col :span="2">
      <el-input v-model="ruleForm.configuration.minute" placeholder="分"></el-input>
      </el-col>

    </el-form-item>
    <el-form-item label="秒" prop="name" v-if="ruleForm.trigger=='cron' || ruleForm.trigger=='interval'">
      <el-col :span="2">
      <el-input v-model="ruleForm.configuration.second" placeholder="秒"></el-input>
      </el-col>
    </el-form-item>
    <el-form-item label="开始时期" v-if="ruleForm.trigger=='cron' || ruleForm.trigger=='interval'">
      <div>
        <el-col :span="3">
          <el-form-item prop="date1">
            <el-date-picker type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期" v-model="ruleForm.configuration.start_date" style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-col>
      </div>

    </el-form-item>
    <el-form-item label="结束时期" v-if="ruleForm.trigger=='cron' || ruleForm.trigger=='interval'">
      <div>
        <el-col :span="3">
          <el-form-item prop="date1">
            <el-date-picker type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期" v-model="ruleForm.configuration.end_date" style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-col>
      </div>

    </el-form-item>
    <!--// 是否开启-->
<!--    <el-form-item label="是否开启" prop="delivery" v-if="ruleForm.trigger=='cron' || ruleForm.trigger=='interval' || ruleForm.trigger=='data'">-->
<!--      <el-switch v-model="ruleForm.delivery"></el-switch>-->
<!--    </el-form-item>-->
    <el-form-item>
      <el-button type="primary" @click="submitForm">立即创建</el-button>
      <el-button @click="resetForm('ruleForm')">返回</el-button>
    </el-form-item>
  </el-form>
</div>
</template>

<script>
export default {
  data() {
    return {

      // select_change:"",
      end_date_day:'',
      end_date_time:'',

      // var end_date = this.end_date_day,
      ruleForm: {
        formMeg:{
          hosts: 'https://cuiqingcai.com/'
        },
        checkList:["nmap扫描端口",],
        name: '',
        description: '',
        trigger: 'once',
        configuration: {
          run_date: '',
          weeks: '',
          days: '',
          hours: '',
          minutes: '',
          month: '',
          day: '',
          hour: '',
          minute: '',
          second: '',
          year: '',
          day_of_week: '',
          start_date: '',
          end_date: '',
        },
        created_at:'',
      },
    };
  },
  methods: {
    async submitForm() {
      // const { data: res } = await this.$http.post("api/tasks/task", this.loginForm,transformRequest: [ function(data){
      //   return Qs.stringify(data)  //使用Qs将请求参数序列化
      // }])
      // if (res.code != 200)
      //   return this.$message.error("登录失败！请重新登录");
      // else this.$message.success("登录成功");
      let ruleForm = this.ruleForm
      await this.$http.post("api/tasks/task/", ruleForm);
      this.$router.push('/tasklist')

      console.log(ruleForm)

    },
    async Sanning(){
      const {data:res } = await this.$http.post('api/tasks/scannamp/',this.formMeg);
      //console.log(res)
      if(res.code !== 200) return this.$message.error(res.msg)
      else this.$message.success("添加扫描成功,正在扫描")
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    // 监听选择框的一个状态值
    currStationChange(val){
        console.log('currStationChange',val)
        this.ruleForm.trigger = val

    },
  }
}
</script>

<style scoped>

</style>
