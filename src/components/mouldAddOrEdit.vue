<template>
  <div class="mouldAddOrEdit">
    <el-row>
      <el-col :span="18" :offset="3">
        <h1 v-html="Object.keys($store.getters.mould_list).length?'项目编辑':'新增项目'"></h1>

        <el-form
          :model="basicInfo"
          :rules="rules"
          ref="mouldAddOrEdit"
          label-width="120px"
          label-position="right"
          size="mini"
          :disabled="this.$store.getters.userLoginVO.role !== 1"
        >
          <el-row :gutter="10" class="spec">
            <el-col :span="12">
              <el-form-item label="客户名称：" prop="customerName">
                <el-input style="width:100%;" v-model="basicInfo.customerName" clearable maxlength="16"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="项目名称：" prop="projectName">
                <el-input style="width:100%;" v-model="basicInfo.projectName" clearable maxlength="16"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="模具编号：" prop="mouldNo">
                <el-input style="width:100%;" v-model="basicInfo.mouldNo" clearable></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="零件名称：" prop="partName">
                <el-input style="width:100%;" maxlength="24" v-model="basicInfo.partName" clearable></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12" v-if="!Object.keys($store.getters.mould_list).length">
              <el-form-item label="项目工程师：" prop="projectEngineer">
                <el-select v-model="basicInfo.projectEngineer" value-key="userId" placeholder="请选择">
                  <el-option v-for="item in options.role1" :key="item.userId" :label="item.name" :value="item"></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="12" v-if="!Object.keys($store.getters.mould_list).length">
              <el-form-item label="设计工程师：" prop="designEngineer">
                <el-select v-model="basicInfo.designEngineer" value-key="userId" placeholder="请选择">
                  <el-option v-for="item in options.role1" :key="item.userId" :label="item.name" :value="item"></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="12" v-if="!Object.keys($store.getters.mould_list).length">
              <el-form-item label="质量经理：" prop="qualityManager">
                <el-select v-model="basicInfo.qualityManager" value-key="userId" placeholder="请选择">
                  <el-option v-for="item in options.role1" :key="item.userId" :label="item.name" :value="item"></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="12" v-if="!Object.keys($store.getters.mould_list).length">
              <el-form-item label="YFPO TC：" prop="yfpoTc">
                <el-select v-model="basicInfo.yfpoTc" value-key="userId" placeholder="请选择">
                  <el-option v-for="item in options.role2" :key="item.userId" :label="item.name" :value="item"></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="12" v-if="!Object.keys($store.getters.mould_list).length">
              <el-form-item label="YFPO 工厂：" prop="yfpoFactory">
                <el-select v-model="basicInfo.yfpoFactory" value-key="userId" placeholder="请选择">
                  <el-option v-for="item in options.role2" :key="item.userId" :label="item.name" :value="item"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-col class="tc mt20" :span="24" v-if="this.user===1">
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
import { insertMould, updateMould, getUserListByRole} from '../axios/api.js'
  export default {
    name: "ProjectAddOrEdit",
    async created() {
      this.basicInfo = Object.assign({},this.$store.getters.mould_list);
      this.user=this.$store.getters.userLoginVO.role;
      let res1 = await getUserListByRole({role: 1});
      let res2 = await getUserListByRole({role: 2});
      if (res1.status === 1) {
        this.options.role1 = [...res1.msg];
      }
      if (res2.status === 1) {
        this.options.role2 = [...res2.msg];
      }
    },
    mounted() {
      if (!this.basicInfo.projectName) {
        this.choose = 0;
      } else {
        this.choose = 1;
      }
    },
    methods: {
      // 零件名称输入框
      // partNameBlur(){
      //   this.$len(32,this.basicInfo.partName)
      // },
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
          role1: [],
          role2: [],
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
        // 判断登录是客户还是内部人员
        user:{}
      }
    }
  }
</script>

<style scoped>
 .el-form-item__label {
   font-size: 12px !important;
 }
</style>
