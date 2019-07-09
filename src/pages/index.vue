<template>
  <div id="index">
    <el-container>
      <!--  header module -->
      <el-header class="header">
        <div class="header_head">
          <img src="../assets/logo.png" alt="logo" />
          <span class="f20 fwb">模具品质管理系统</span>

          <el-dropdown @command="handleCommand">
            <el-button type="primary" plain>{{this.$store.getters.accountName}}<i class="el-icon-arrow-down el-icon--right"></i></el-button>
            <el-dropdown-menu slot="dropdown" style="font-size:12px;min-width:100px;">
              <!--<el-dropdown-item command="1" style="font-size:10px;cursor:pointer;">修改信息</el-dropdown-item>-->
              <el-dropdown-item command="2" style="font-size:10px;cursor:pointer;">修改密码</el-dropdown-item>
              <el-dropdown-item divided command="3" style="font-size:10px;cursor:pointer;">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>

      <!--  main content -->
      <el-main class="main">
        <transition name="slide-fade">
          <router-view class="bg_f"></router-view>
        </transition>

        <!-- Form -->
        <el-dialog title="修改密码" :visible.sync="dialogFormVisible" width="50%" center @closed="cancelAdd">
          <el-form :model="form" status-icon :rules="rules" ref="ruleForm" label-width="120px" label-position="right" class="mt20" size="small">
            <el-form-item label="原密码：" prop="oldPassword" :rules="{ required: true, min: 6, max: 20, message: '请输入6-20个非中文字符！', trigger: ['blur', 'change'] }">
              <el-input type="password" v-model="form.oldPassword" autocomplete="off" clearable></el-input>
            </el-form-item>
            <el-form-item label="新密码：" prop="newPassword">
              <el-input type="password" v-model="form.newPassword" autocomplete="off" clearable></el-input>
            </el-form-item>
            <el-form-item label="确认新密码：" prop="checkPass">
              <el-input type="password" v-model="form.checkPass" autocomplete="off" clearable></el-input>
            </el-form-item>

          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="changeInfo(form)" size="small">确 定</el-button>
            <el-button @click="dialogFormVisible = false" size="small">取 消</el-button>
          </div>
        </el-dialog>
      </el-main>

      <!--  footer module -->
      <el-footer class="footer"></el-footer>
    </el-container>
  </div>
</template>

<script>
/* eslint-disable */
  import { loginOut, changePwd,} from '../axios/api'
  import { set_main_height } from '../utils/common'

  function  setMainHeight() {
    let node = document.getElementsByClassName('main')[0];
    node.style.height = node.style.maxHeight = set_main_height(80, 30);
  }

  let resizeTimer = null;
  window.addEventListener('resize', function (){
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function(){
      // if (window.innerWidth > 720) {
      //   window.location.href = 'http://10.9.1.77:65379'
      // } else {
      //   window.location.href = 'http://10.9.1.77:65380'
      // }
      setMainHeight();
    } , 100);
  });

  export default {
    name: "index",
    inject: ['reload'],
    components: {

    },
    created() {

    },
    mounted() {
      setMainHeight();
    },
    methods: {
      //点击下拉菜单对应的菜单指令事件
      handleCommand(command) {
        if(command === '3') {
          this.clearStorage();
        }else {
          this.dialogFormVisible = true;
        }
      },

      //修改邮箱，联系方式或密码
      changeInfo(form) {
        this.$refs.ruleForm.validate(async (valid) => {
          if (valid) {
            let res = await changePwd({oldPassword: form.oldPassword, newPassword: form.newPassword,});
            this.dialogFormVisible = false;
            if (res.status === 1) {
              this.$message({showClose: true, type: 'success', message: '修改密码成功，请重新登录以验证密码！'});
              this.$refs.ruleForm.resetFields();
              this.clearStorage();
            }
            console.log('校验成功！')
          }
        })
      },

      //取消或者关闭弹框时清空校验信息
      cancelAdd() {
        this.$refs.ruleForm.resetFields();
      },

      //点击退出，退出登陆后，需要刷新页面，因为我们是通过addRoutes添加的，router没有deleteRoutes这个api，所以清除token,清除permissionList等信息，刷新页面是最保险的。
      async clearStorage() {
        let res = await loginOut();
        if (res.status === 1) {
          // localStorage.removeItem('token');
          // localStorage.removeItem('accountName');
          // localStorage.removeItem('userLoginVO');
          sessionStorage.clear();  /* only clear all info, the routes will be right, or not go to the method of set_router.js */
          this.$store.commit('Auth/CLEAR_PERMISSION');

          // this.$router.push('/login');

          this.reload();  // it doesn't have duplicate keys of route, but have a little delay. OR it has duplicate keys of route and it also can open the page of noneAuth.
        }
      },
    },
    watch: { //通过路由的更新可以直接赋值
      $route: function(to, from , next) {
        this.crumbList = this.$route.matched.slice(1);
      },
    },

    data() {
      let self = this;
      let validateNewPassword = (rule, value, callback) => {
        if(!value) {
          value = '';
        }
        if (!/^[^\u4e00-\u9fa5]{6,20}$/.test(value)) {
          callback(new Error('请输入6-20个非中文的字符！'));
        } else {
          if (self.form.checkPass) { //只需要判断再次输入密码的校验，此处只需要满足test校验即可
            self.$refs.ruleForm.validateField('checkPass')
          }
          callback();
        }
      };
      let validateCheckPass = (rule, value, callback) => {
        if(!value) {
          value = '';
        }
        if (!/^[^\u4e00-\u9fa5]{6,20}$/.test(value)) {
          callback(new Error('请输入6-20个非中文的字符！'));
        } else if (value !== self.form.newPassword) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        crumbList: [],

        src: '/static/logo.png',

        //弹框
        dialogFormVisible: false,
        form: {
          oldPassword: '',
          newPassword: '',
          checkPass: '',
        },

        rules: {
          newPassword: [
            { required: true, validator: validateNewPassword, trigger: ['blur', 'change']},
          ],
          checkPass: [
            { required: true, validator: validateCheckPass, trigger: ['blur', 'change'] },
          ],
        },
      }
    },
  }
</script>

<style lang="scss">
  @import "../style/common.scss";

  .footer {
    height: 30px !important;
    background: #F8FAFF url("../assets/footer.png") no-repeat center;
    background-size: auto 20px;
    position: relative;
    &:before {
      content:'';
      position: absolute;
      width: 100%;
      border-top: 1px solid #ddd;
      top: 0;
      left: 0;
    }
  }
</style>
