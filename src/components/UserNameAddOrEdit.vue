<template>
  <div class="UserNameAddOrEdit p20">
    <el-row>
      <el-col :span="12" :offset="6">
        <el-form :model="form" status-icon :rules="rules" ref="UserNameAddOrEdit" label-width="130px" label-position="right" class="mt20" size="small">
          <el-form-item prop="accountName" label="账户名称：">
            <el-input v-model="form.accountName" placeholder="请输入账户名称"></el-input>
          </el-form-item>
          <el-form-item prop="userName" label="姓名：">
            <el-input v-model="form.name" placeholder="请输入姓名"></el-input>
          </el-form-item>

          <el-form-item label="用户角色：" prop="role" :rules="[{ required: true, message: '该项不能为空！', trigger: 'change' }]">
            <el-select v-model="form.role" placeholder="请选择">
              <el-option v-for="item in options.roleList" :key="item.id" :label="item.label" :value="item.id"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="账户状态：" prop="status">
            <el-select v-model="form.status" placeholder="请选择">
              <el-option v-for="item in options.status" :key="item.id" :label="item.label" :value="item.id"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="公司名称：" prop="companyName" :rules="[{ required: true, max: 10, message: '不能超过十个字符！', trigger: ['blur', 'change'] }]">
            <el-input v-model="form.companyName" placeholder="请输入公司名称"></el-input>
          </el-form-item>

          <el-form-item label="职位：" prop="position" :rules="[{ required: true, max: 50, message: '该项不能为空！', trigger: 'change' }]">
            <el-input v-model="form.position" placeholder="请输入职位"></el-input>
          </el-form-item>
          <!-- 手机号码和邮箱 -->
          <el-form-item label="手机号：" prop="mobile" :rules="[{ required: true, min:11, max: 11, message: '请输入11位手机号码', trigger: 'change' }]">
            <el-input type="age" maxLength="11" v-model="form.mobile" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item prop="mail" label="邮箱：" :rules="[{ required: true, message: '请输入邮箱地址', trigger: 'blur' },{ type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }]">
            <el-input v-model="form.mail"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitForm('UserNameAddOrEdit')">确定</el-button>
            <el-button type="plain" @click="resetForm('UserNameAddOrEdit')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

  </div>
</template>

<script>
/* eslint-disable */
  import { Message, MessageBox, Loading } from 'element-ui';
  /** 导入api.js */
  import { addUser, updateUser, } from '../axios/api.js'
  export default {
    name: "UserNameAddOrEdit",
    async created() {
      this.form = Object.assign({status: 1, role: 1,},this.$store.getters.auth_userName);
      // if (!this.form.status) {
      //   this.form.status = 1;
      //   this.form.role = 1;
      // }
    },
    async mounted() {
      if (!this.form.accountName) {
        this.choose = 0;
      } else {
        this.choose = 1;
      }
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            let res;
            if (this.choose === 0) {
              res = await addUser(this.form);
            } else {
              res = await updateUser(this.form);
            }
            if (res.status === 1) {
              this.$emit('ifChange', 'addOrEdit');

              Message({showClose: true, type: 'success', message: '新增或更新账户成功！'})
            }
          } else {
            console.log('error submit!!');
            Message({showClose: true, type: 'error', message: '请仔细核对信息，确认无误再点击确定提交！'});
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
    },
    data() {
      let validateAccount = (rule, value, callback) => {
        if(!value) {
          callback(new Error('账户名称不能为空！'))
        } else if (/^\w+$/.test(value)) {
          callback();
        } else {
          callback(new Error('请正确填写，支持英文大小写、数字和下划线_，20字以内'));
        }
      };
      return {
        // options
        options: {
          status: [
            { id: 0, label: '关闭'},
            { id: 1, label: '启用'},
          ],
          roleList: [
            { id: 1, label: '内部用户'},
            { id: 2, label: '客户'},
          ],
        },


        // form
        form: {
          status: 1,
          role: 1,
        },

        rules: {
          accountName: [
            { required: true, validator: validateAccount, trigger: 'change' },
            { required: true, min: 6, max: 20, trigger: 'change', message: '请控制在6~20个字符以内!'},
          ],
          name: [
            { required: true, max: 20, trigger: 'change', message: '请控制在20个字符以内，但不能为空!'},
          ],
        },

        // choose api
        choose: 0,
      }
    },
  }
</script>

<style scoped>

</style>
