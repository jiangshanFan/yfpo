<template>
  <div class="mouldAddOrEdit p20">
    <el-row>
      <el-col :span="16" :offset="4">
        <h1 v-html="Object.keys($store.getters.mould_list).length?'项目编辑':'新增项目'"></h1>

        <el-form :model="basicInfo" :rules="rules" ref="mouldAddOrEdit" label-width="120px" label-position="right" size="mini">

          <el-row :gutter="10" class="spec">
            <el-col :span="12">
              <el-form-item label="客户名称：" prop="customerName">
                <el-input style="width:100%;" v-model="basicInfo.customerName" clearable maxlength="16"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="项目名称：" prop="projectName">
                <el-input style="width:100%;" v-model="basicInfo.projectName" clearable maxlength="32"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="模具编号：" prop="mouldNo">
                <el-input style="width:100%;" v-model="basicInfo.mouldNo" clearable></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="零件名称：" prop="partName">
                <el-input style="width:100%;" v-model="basicInfo.partName" clearable></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="项目负责人：" prop="leader">
                <el-input style="width:100%;" v-model="basicInfo.leader" clearable></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="车型名称：" prop="vehicleType">
                <el-input style="width:100%;" v-model="basicInfo.vehicleType" clearable></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="主机厂：" prop="mainEngineFactory">
                <el-input style="width:100%;" v-model="basicInfo.mainEngineFactory" clearable></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="模具供应商：" prop="supplier">
                <el-input style="width:100%;" v-model="basicInfo.supplier" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-col class="tc mt20" :span="24">
            <el-form-item label-width="0">
              <el-button type="primary" @click="submitForm('mouldAddOrEdit')">确定</el-button>
              <el-button type="plain" @click="resetForm('mouldAddOrEdit')">重置</el-button>
            </el-form-item>
          </el-col>

        </el-form>
      </el-col>
    </el-row>

  </div>
</template>

<script>
/* eslint-disable */
import { Message, MessageBox, Loading } from 'element-ui';
/** 导入api.js */
import { insertMould, updateMould, } from '../axios/api.js'
  export default {
    name: "ProjectAddOrEdit",
    created() {
      this.basicInfo = Object.assign({},this.$store.getters.mould_list);
    },
    mounted() {
      if (!this.basicInfo.projectName) {
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
              res = await insertMould(this.basicInfo);
            } else {
              res = await updateMould(this.basicInfo);
            }
            if (res.status === 1) {

              this.$emit('ifChange','addOrEdit');

              Message({showClose: true, type: 'success', message: '新增或更新项目成功！'})
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
      let validateMouldNo = (rule, value, callback) => {
        if(!value) {
          value = '';
        }
        if (!/^[A-Z]{3}\d{6}$/.test(value)) {
          callback(new Error('“前三位大写英文字母，后六位数字”！'));
        } else {
          callback();
        }
      };
      return {
        // all info
        basicInfo: {},
        loading: false, //下拉列表请求后提示加载中

        options: {

        },


        rules: {
          projectName: [
            { required: true, message: '项目名称不能为空', trigger: ['blur','change'] },
          ],
          mouldNo: [
            // { required: true, message: '模具编号不能为空', trigger: ['blur','change'] },
            { required: true, validator: validateMouldNo, trigger: ['blur', 'change'] },
          ],
        },

        // choose api
        choose: 0,
      }
    }
  }
</script>

<style scoped>
 .el-form-item__label {
   font-size: 12px !important;
 }
</style>
