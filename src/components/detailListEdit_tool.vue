<template>
  <div class="detailListEdit_tool">
    <el-row>
      <el-col>
        <p class="tc p20 boxShadow_head">
          <span class="mr40">项目名称：{{basicInfo.projectName}}</span>
          <span class="ml20">模具编号：{{basicInfo.mouldNo}}</span>
        </p>

        <h1 class="tc mt20">TOOL INFORMATION</h1>

        <!--  main content  -->
        <div class="mainContent mt20">
          <el-form
            ref="detailListEdit_tool"
            :rules="rules"
            :model="form"
            label-width="100px"
            size="small"
            label-position="right"
            :disabled="this.$store.getters.userLoginVO.role !== 1"
          >
            <el-row class="flex_row_spaceAround mt40">
              <el-row>
                <el-form-item label="车型名称" prop="vehicleType">
                  <el-input maxlength="16" clearable v-model="form.vehicleType"></el-input>
                </el-form-item>

                <el-form-item label="浇口点数" prop="gatePoints">
                  <el-input maxlength="16" clearable v-model="form.gatePoints"></el-input>
                </el-form-item>

                <el-form-item label="油压控制段数" prop="oilPressureControlQuantity">
                  <el-input maxlength="16" clearable v-model="form.oilPressureControlQuantity"></el-input>
                </el-form-item>
              </el-row>

              <el-row>
                <el-form-item label="主机厂" prop="mainEngineFactory">
                  <el-input maxlength="16" clearable v-model="form.mainEngineFactory"></el-input>
                </el-form-item>

                <el-form-item label="型腔数" prop="cavity">
                  <el-input maxlength="16" clearable v-model="form.cavity"></el-input>
                </el-form-item>
              </el-row>

              <el-row>
                <el-form-item label="供应商" prop="supplier">
                  <el-input maxlength="16" clearable v-model="form.supplier"></el-input>
                </el-form-item>

                <el-form-item label="注塑机型号" prop="injectionMoldingMachineModel">
                  <el-input maxlength="16" clearable v-model="form.injectionMoldingMachineModel"></el-input>
                </el-form-item>
              </el-row>
            </el-row>

            <el-row class="flex_column_center mt40">
              <el-col class="ovwh tc" :span="12">
                <img
                  src="../assets/tool_information.png"
                  alt="产品图"
                  style="width: 100%;max-width: 360px;height: auto;"
                />
              </el-col>
              <el-col :span="12">
                <el-col :span="12">
                  <el-form-item label="A" label-width="30px" prop="a1Length">
                    <el-input
                      clearable
                      style="width:calc(100% - 30px);margin-right: 5px;max-width:120px;"
                      v-model="form.a1Length"
                    ></el-input>mm
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="a" label-width="30px" prop="alength">
                    <el-input
                      clearable
                      style="width:calc(100% - 30px);margin-right: 5px;max-width:120px;"
                      v-model="form.alength"
                    ></el-input>mm
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="B1" label-width="30px" prop="b1Length">
                    <el-input
                      clearable
                      style="width:calc(100% - 30px);margin-right: 5px;max-width:120px;"
                      v-model="form.b1Length"
                    ></el-input>mm
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="b" label-width="30px" prop="blength">
                    <el-input
                      clearable
                      style="width:calc(100% - 30px);margin-right: 5px;max-width:120px;"
                      v-model="form.blength"
                    ></el-input>mm
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="B2" label-width="30px" prop="b2Length">
                    <el-input
                      clearable
                      style="width:calc(100% - 30px);margin-right: 5px;max-width:120px;"
                      v-model="form.b2Length"
                    ></el-input>mm
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="c" label-width="30px" prop="clength">
                    <el-input
                      clearable
                      style="width:calc(100% - 30px);margin-right: 5px;max-width:120px;"
                      v-model="form.clength"
                    ></el-input>mm
                  </el-form-item>
                </el-col>
              </el-col>
            </el-row>

            <el-row class="flex_row_spaceAround mt40">
              <el-row>
                <el-form-item label="模具总重量" prop="totalWeight">
                  <el-input
                    clearable
                    style="width:calc(100% - 30px);margin-right: 5px;max-width:120px;"
                    v-model="form.totalWeight"
                  ></el-input>kg
                </el-form-item>

                <el-form-item label="一级顶行程" prop="firstTopTrip">
                  <el-input
                    clearable
                    style="width:calc(100% - 30px);margin-right: 5px;max-width:120px;"
                    v-model="form.firstTopTrip"
                  ></el-input>mm
                </el-form-item>
              </el-row>

              <el-row>
                <el-form-item label="定模侧重量" prop="fixedWeight">
                  <el-input
                    clearable
                    style="width:calc(100% - 30px);margin-right: 5px;max-width:120px;"
                    v-model="form.fixedWeight"
                  ></el-input>kg
                </el-form-item>

                <el-form-item label="二级顶行程" prop="secondTopTrip">
                  <el-input
                    clearable
                    style="width:calc(100% - 30px);margin-right: 5px;max-width:120px;"
                    v-model="form.secondTopTrip"
                  ></el-input>mm
                </el-form-item>
              </el-row>

              <el-row>
                <el-form-item label="动模侧重量" prop="dynamicWeight">
                  <el-input
                    clearable
                    style="width:calc(100% - 30px);margin-right: 5px;max-width:120px;"
                    v-model="form.dynamicWeight"
                  ></el-input>kg
                </el-form-item>

                <el-form-item label="三级顶行程" prop="thirdTopTrip">
                  <el-input
                    clearable
                    style="width:calc(100% - 30px);margin-right: 5px;max-width:120px;"
                    v-model="form.thirdTopTrip"
                  ></el-input>mm
                </el-form-item>
              </el-row>
            </el-row>

            <el-row class="tc mt40" :gutter="40" v-if="this.user===1">
              <el-form-item label-width="0px">
                <el-button type="primary" @click="submitForm('detailListEdit_tool')">保存</el-button>
                <el-button type="plain" @click="resetForm('detailListEdit_tool')">重置</el-button>
              </el-form-item>
            </el-row>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
/* eslint-disable */
import { Message, MessageBox, Loading } from "element-ui";
/** 导入api.js */
import {
  getToolInformationByMouldNo,
  updateToolInformationByMouldNo
} from "../axios/api.js";

export default {
  name: "detailListEdit_tool",
  created() {
    this.getList();
    this.basicInfo = this.$store.getters.mould_list;
    this.user = this.$store.getters.userLoginVO.role;
    // console.log(this.$store.getters.userLoginVO.role)
  },
  methods: {
    // get dataList of table
    async getList() {
      this.loading = true;
      let params = {
        mouldNo: this.$store.getters.mould_list.mouldNo
      };

      let res = await getToolInformationByMouldNo(params);

      if (res.status === 1) {
        if (res.msg !== null) {
          this.form = JSON.parse(JSON.stringify(res.msg));
        } else {
          this.form = {};
        }
        this.loading = false;
      }
    },

    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let res = await updateToolInformationByMouldNo(this.form);
          if (res.status === 1) {
            Message({
              showClose: true,
              type: "success",
              message: "更新TOOL INFORMATION成功！"
            });
          }
        } else {
          console.log("error submit!!");
          Message({
            showClose: true,
            type: "error",
            message: "请仔细核对信息，确认无误再点击确定提交！"
          });
          return false;
        }
      });
    },
    resetForm(formName) {
      this.getList();
    }
  },
  data() {
    let validate1 = (rule, value, callback) => {
      if (!value) {
        value = "";
        callback();
      } else {
        if (!/^(\d|[1-9]\d{0,6})(\.\d{1,2})?$/.test(value)) {
          callback(new Error("输入有误，请核对"));
          Message({
            showClose: true,
            type: "error",
            message: "提示“小数点前1-7位，小数点后1-2位”！"
          });
        } else {
          callback();
        }
      }
    };
    let validate2 = (rule, value, callback) => {
      if (!value) {
        value = "";
        callback();
      } else {
        if (!/^(\d|[1-9]\d{0,5})(\.\d)?$/.test(value)) {
          callback(new Error("输入有误，请核对"));
          Message({
            showClose: true,
            type: "error",
            message: "提示“小数点前1-6位，小数点后1位”！"
          });
        } else {
          callback();
        }
      }
    };
    return {
      basicInfo: {},

      form: {},
      rules: {
        a1Length: [{ validator: validate2, max: 8, trigger: ["change"] }],
        alength: [{ validator: validate2, trigger: ["change"] }],
        b1Length: [{ validator: validate2, trigger: ["change"] }],
        b2Length: [{ validator: validate2, trigger: ["change"] }],
        blength: [{ validator: validate2, trigger: ["change"] }],
        clength: [{ validator: validate2, trigger: ["change"] }],
        dynamicWeight: [{ validator: validate1, trigger: ["change"] }],
        firstTopTrip: [{ validator: validate2, trigger: ["change"] }],
        fixedWeight: [{ validator: validate1, trigger: ["change"] }],
        secondTopTrip: [{ validator: validate2, trigger: ["change"] }],
        thirdTopTrip: [{ validator: validate2, trigger: ["change"] }],
        totalWeight: [{ validator: validate1, trigger: ["change"] }]
      },
      // 判断是内部用户还是客户
      user: {}
    };
  }
};
</script>

<style lang="scss" scoped>
.flex_column_center {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.flex_row_spaceAround {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}
</style>
