<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>扫描管理</el-breadcrumb-item>
      <el-breadcrumb-item>web资产结果</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图区域-->
    <el-card >
      <!--搜索与添加区域-->
      <el-row :gutter="24">
        <el-col :span="8">
          <el-input clearable @clear="getUserList" placeholder="请输入内容" v-model="queryInfo.search">
            <el-button slot="append" icon="el-icon-search"  @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-table-column
            label="类型"
            prop="type"
            :filter-multiple="false"
            :column-key="'type'"
            :filters="filterStatus"
        >
        </el-table-column>
      </el-row>

      <!--用户列表区域-->
      <el-table :data="userList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="IP地址" prop="ip"></el-table-column>
        <el-table-column label="标题" prop="title"></el-table-column>
        <el-table-column label="web指纹" prop="web">
<!--          <template slot-scope="scope" >-->
<!--            <el-table  :data="scope.row.web">-->
<!--              <el-table-column prop="name" type="index">-->
<!--              </el-table-column>-->
<!--            </el-table>-->
<!--          </template>-->
        </el-table-column>
<!--        <el-table-column label="WAF" prop="WAF"></el-table-column>-->
        <el-table-column label="域名" prop="domain"></el-table-column>

        <el-table-column label="操作" width="185px">
          <template slot-scope="scope">
            <!--修改按钮-->
            <el-tooltip  effect="dark" content="修改" placement="top" :enterable="false">
              <el-button @click="showEditDialog(scope.row.id)"  type="primary" icon="el-icon-edit" size="mini"></el-button>
            </el-tooltip>
            <!--删除按钮-->
            <el-tooltip  effect="dark" content="删除" placement="top" :enterable="false">
              <el-button type="danger" @click="removeUserById(scope.row.id)" icon="el-icon-delete" size="mini"></el-button>
            </el-tooltip>
            <!--分配角色按钮-->
            <el-tooltip effect="dark" content="重写扫描" placement="top" :enterable="false">
              <el-button type="danger" @click="RewriteScan(scope.row.ip, scope.row.port)" icon="el-icon-delete" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!--分页区域-->
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.page"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
      <!--添加用户的对话框-->

      <!--修改用户的对话框-->
      <el-dialog
          title="修改用户信息"
          :visible.sync="editDialogVisible"
          width="50%" @close="editDialogClosed">
        <!--内容主体区域-->
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px" >
          <el-form-item label="用户名">
            <el-input v-model="editForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <!--底部区域-->
        <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editUserInfo">确 定</el-button>
            </span>
      </el-dialog>

    </el-card>
  </div>
</template>

<script>


// import PinyinMatch from 'pinyin-match'
export default {
  data(){
    //验证邮箱的规则
    var checkEmail = (rule,value,cb) =>{
      const regEmail = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/
      if(regEmail.test(value)){
        //合法的邮箱
        return cb()
      }
      cb(new Error("请输入合法的邮箱"))
    }
    //验证手机号码的规则
    var checkMobile = (rule,value,cb) =>{
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        //合法的手机号码
        return cb()
      }
      cb(new Error('手机号码格式不正确'))
    }

    return{
      //获取用户列表的参数对象
      queryInfo:{
        search:'',
        //当前页数
        page:1,
        //当前页数据个数
        page_size:20
      },
      userList:[],
      total: 0,
      //控制添加用户的对话框的显示与隐藏
      addDialogVisible: false,
      //控制修改用户的对话框的显示与隐藏
      editDialogVisible :false,
      //添加用户的表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      //添加表单的验证规则对象
      addFormRules: {
        username: [
          {required: true,message: '请输入用户名',trigger: 'blur'},
          {min: 3,max: 10,message: '用户名的长度在3~10个字符之间',trigger: 'blur'}
        ],
        password: [
          {required: true,message: '请输入密码',trigger: 'blur'},
          {min: 6,max: 15,message: '密码的长度在6~15个字符之间',trigger: 'blur'}
        ],
        email: [
          {required: true,message: '请输入邮箱',trigger: 'blur'},
          {validator: checkEmail, trigger: 'blur'}
        ],
        mobile: [
          {required: true,message: '请输入手机号码',trigger: 'blur'},
          {validator: checkMobile, trigger: 'blur'}
        ]
      },
      editForm: {},
      //修改表单的验证规则对象
      editFormRules: {
        email: [
          {required: true,message: '请输入邮箱',trigger: 'blur'},
          {validator: checkEmail, trigger: 'blur'}
        ],
        mobile: [
          {required: true,message: '请输入手机号码',trigger: 'blur'},
          {validator: checkMobile, trigger: 'blur'}
        ]
      },
      // 控制分配角色对话框的显示与隐藏
      setRoleDialogVisible :false,
      // 需要被分配角色的用户信息
      userInfo:{},
      // 所有角色的数据列表
      rolesList: [],
      // 已选中的角色id
      selectedRoleId:''

    }
  },
  created(){
    this.getUserList()
  },
  methods:{
    async getUserList(){
      const {data:res } = await this.$http.get('api/tasks/scanwebresult/',{params: this.queryInfo })
      console.log(res)
      if(res.code !== 200) return this.$message.error(res.msg)
      this.userList = res.data.results;
      this.total = res.data.count;
    },
    //监听 pagesize 改变的事件
    handleSizeChange(newSize){
      //console.log(newSize)
      this.queryInfo.pagesize = newSize;
      this.getUserList()
    },
    //监听页码值改变的事件
    handleCurrentChange(newPage){
      //console.log(newPage)
      this.queryInfo.page = newPage;
      this.getUserList()
    },
    //监听 Switch状态的改变
    async userStateChanged(userInfo){
      //console.log(userInfo)
      const {data:res} = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
      //console.log(res)
      if(res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error('更新用户状态失败！')
      }
      this.$message.success('更新用户状态成功！')
    },
    //监听添加用户对话框的关闭事件
    addDialogClosed(){
      this.$refs.addFormRef.resetFields()
    },
    //点击确定按钮，进行添加用户
    addUser(){
      this.$refs.addFormRef.validate( async valid=>{
        //console.log(valid)
        if(!valid) return
        //可以发起添加用户的请求
        const {data:res} = await this.$http.post('users',this.addForm)
        //console.log(res)
        if(res.meta.status !== 201) return this.$message.error('添加用户失败！')
        this.$message.success('添加用户成功!')
        //隐藏添加用户的对话框
        this.addDialogVisible = false
        this.getUserList()
      })
    },
    //展示修改用户的对话框
    async showEditDialog(id){
      const {data:res} = await this.$http.get('users/'+id)
      if(res.meta.status !== 200)   return this.$message.error('查询用户信息失败!')

      this.editForm = res.data
      this.editDialogVisible = true
      //console.log(editForm)
      //console.log(res)
    },
    //监听修改用户对话框的关闭事件
    editDialogClosed(){
      this.$refs.editFormRef.resetFields()
    },
    //修改用户的表单预验证
    editUserInfo(){
      this.$refs.editFormRef.validate( async valid=>{
        //console.log(valid)
        if(!valid) return
        //可以发起修改用户的请求
        const {data:res} = await this.$http.put('users/' + this.editForm.id,{
          email: this.editForm.email , mobile: this.editForm.mobile
        })
        //console.log(res)
        if(res.meta.status !== 200) return this.$message.error('更新用户信息失败!')

        //隐藏添加用户的对话框
        this.editDialogVisible = false
        //刷新数据列表
        this.getUserList()
        //提示修改成功
        this.$message.success('更新用户信息用户成功!')
      })
    },
    //根据id删除用户信息
    async removeUserById(id){
      //弹框询问用户是否删除数据
      const confirmResult =await  this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
      ).catch(err => err)
      //如果用户确认删除，则返回值为字符串 confirm
      //如果用户取消删除，则返回值为字符串 cancel
      //console.log(confirmResult)
      if(confirmResult !== 'confirm'){
        return this.$message.info('已取消删除')
      }
      const {data:res} = await this.$http.delete('api/tasks/scanresult/'+id)
      if(res.code !== 204) return this.$message.error('删除用户失败！')
      this.$message.success('删除用户成功!')
      //刷新用户列表
      this.getUserList()
    },

    async RewriteScan(ip, ports){
      //弹框询问用户是否删除数据
      const confirmResult =await  this.$confirm('此操作将继续验证主机端口详情, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
      ).catch(err => err)
      //如果用户确认删除，则返回值为字符串 confirm
      //如果用户取消删除，则返回值为字符串 cancel
      //console.log(confirmResult)
      if(confirmResult !== 'confirm'){
        return this.$message.info('已取消扫描')
      }
      const {data:res} = await this.$http.post('api/tasks/scannamp/', {hosts:ip,ports:ports})
      if(res.code !== 200) return this.$message.error('继续扫描失败！')
      this.$message.success('成功进行扫描!')
    },
    // PinyinMatch(val){
    //   if(val){
    //     let result = []
    //     this.copyCustomer.forEach(i=>{
    //       let m = PinyinMatch.match(i.name,val) //name是要过滤的字段
    //       if (m) {
    //         result.push(i)
    //       }
    //     })
    //     this.customer = result
    //   }else{
    //     this.customer=this.copyCustomer
    //   }
    // },

  }
}
</script>

<style lang="less" scoped>

</style>
