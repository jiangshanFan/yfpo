<template>
  <div id="login" class="tc posr">
    <div class="login posa boxShadow">
      <h2 class="title">模具品质管理系统</h2>
      <span class="f12">欢迎登录!</span>

      <div class="login_info">

        <el-input placeholder="请输入用户名" v-model.trim="accountName" size="small" clearable>
          <i slot="prefix" class="el-input__icon icon_user"></i>
        </el-input>

        <el-input type="password" placeholder="请输入用密码" v-model.trim="pwd" size="small" clearable show-password>
          <i slot="prefix" class="el-input__icon icon_pwd"></i>
        </el-input>

        <el-button type="primary" size="small" style="width: 100%;" @click="login">登录</el-button>
      </div>

    </div>
  </div>
</template>

<script>
/* eslint-disable */
  import { login, } from '../axios/api'

  export default {
    name: "login",
    created() {
      sessionStorage.clear();
    },
    mounted() {
      this.$store.commit('Auth/CLEAR_PERMISSION');  // avoid losing the efficacy of token, goto the page of login.vue, but the token still resist
    },
    methods: {
      async login() {
        if(this.accountName !== '' && this.pwd !== '') {
          let params = {
            accountName: this.accountName,
            pwd: this.pwd,
            type: 1,
          };
          try {
            let res = await login(params);
            if(res.status === 1) {
              sessionStorage.setItem('token',res.msg.authorization);
              sessionStorage.setItem('accountName',res.msg.userLoginVO.name);
              sessionStorage.setItem('userLoginVO',JSON.stringify(res.msg.userLoginVO));

              this.$store.dispatch('token', sessionStorage.getItem('token'));
              this.$store.dispatch('accountName', sessionStorage.getItem('accountName'));
              this.$store.dispatch('userLoginVO', JSON.parse(sessionStorage.getItem('userLoginVO')));

              if(!this.$store.state.Auth.permissionList) {
                this.$store.dispatch('Auth/FETCH_PERMISSION').then(() => {  // 此处的then写法在旧版IE不支持
                  if (this.$store.getters.userLoginVO.role) {
                    this.$router.replace('/');
                  } else {
                    this.$router.push({path: '/mould/userName'});
                  }
                }); //刷新界面就请求权限数据
              }
            }
          }catch (e) {
            console.log(e)
          }
        } else {
          this.$message({showClose: true, type: 'warning', message: '请填写完整用户名和密码！'});
        }
      }
    },

    data() {
      return {
        accountName: '',
        pwd: '',
      }
    },
  }
</script>

<style lang="scss" scoped>
  #login {
    height: 100%;
    background: url("../assets/login_bg.png") no-repeat center 0;
    background-size: cover;
    .login {
      width: 800px;
      height: 460px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      padding: 80px 40px 80px 400px;
      box-sizing: border-box;
      border-radius: 5px;
      background: #fff url("../assets/login_dialog_bg.png") no-repeat 40px center;
      background-size: 360px;
      .title {
        margin: 0 !important;
      }
      .login_info {
        height: 210px;
        padding: 0 60px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        flex-direction: column;
        .icon_user {
          width: 20px;
          height: 20px;
          display: inline-block;
          margin-top: 6px;
          background: url("../assets/login_user.png") no-repeat center 0em;
          background-size: cover;
        }
        .icon_pwd {
          width: 20px;
          height: 20px;
          display: inline-block;
          margin-top: 6px;
          background: url("../assets/login_pwd.png") no-repeat center 0em;
          background-size: cover;
        }
      }
    }
  }
</style>
