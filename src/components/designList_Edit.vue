<template>
  <div class="designList_Edit">
    <el-row v-if="show">
      <el-col>
        <p class="tc p20 boxShadow_head">
          <span class="mr40">项目名称：{{allInfo.projectName}}</span>
          <span class="ml20">模具编号：{{allInfo.mouldNo}}</span>
        </p>
        <!--<hr>-->

        <div
          v-loading="loading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
        >
          <!-- <a class="exportExcelStyle" :href="`/api/project/exportDesignInfoByMouldNo?mouldNo=${this.$store.getters.mould_list.mouldNo}&type=1`" download>导出Excel</a> -->
          <el-button class="change" type="primary" size="mini" @click="changeInfo">更新提醒</el-button>
          <el-button class="changeOne" type="primary" size="mini" @click="getExcelOut">导出表格</el-button>
          <div style="width:93%; text-align:center;">
            <h1 class="tc mt20" style="padding-right">{{designList.tableName}}</h1>
          </div>
          <div id="main" style="width:100%; height:200px;"></div>
          <!-- 表格数据 -->
          <el-table
            :data="table.content"
            :span-method="arraySpanMethod"
            stripe
            border
            size="small"
            style="width: 100%;margin-top:10px;"
            header-cell-class-name="header_cell table_header_shadow"
            tooltip-effect="light"
          >
            <el-table-column
              fixed
              type="index"
              width="60"
              label="序号"
              align="center"
              :index="(index) => this.$indexS(index, currentPage, size)"
            ></el-table-column>

            <!-- circle -->
            <column :header="header"></column>

            <el-table-column fixed="right" label="操作" width="60" align="center">
              <template slot-scope="scope">
                <span>
                  <el-button
                    class="underline f12"
                    @click="lookDetails(scope.row)"
                    type="text"
                    align="center"
                  >详情</el-button>
                </span>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!--<el-col class="mt20">-->
        <!--<p>备注：</p>-->
        <!--<el-input type="textarea" :rows="3" placeholder="请输入备注" v-model="remark" maxlength="100" show-word-limit :disabled="this.$store.getters.userLoginVO.role !== 1"></el-input>-->
        <!--</el-col>-->
      </el-col>

      <el-col class="tc mt20">
        <el-button type="primary" size="mini" @click="updateInfo">保存</el-button>
      </el-col>
    </el-row>

    <detail v-else @changed="showDefault"></detail>
  </div>
</template>

<script>
/* eslint-disable */
import { Message, MessageBox, Loading } from "element-ui";
/** 导入api.js */
import {
  getDesignInfoByMouldNo,
  updateDesignInfo,
  // exportDesignInfoByMouldNo,
  createDesignInfoByMouldNoExcel,
  getDesignInfoExcelStatus,
  downloadDesignInfoExcel,
  sendMailRemind
} from "../axios/api.js";
import column from "./tableColumn";
import designList_Edit_detail from "./designList_Edit_detail";
import Echarts from "../../node_modules/echarts/dist/echarts.min.js";
export default {
  name: "designList_Edit",
  components: {
    column: column,
    detail: designList_Edit_detail
  },
  props: {},
  created() {},
  mounted() {
    this.designList = this.$store.getters.design_type;
    this.loading = true;
    this.getList();
  },

  updated() {},
  methods: {
    // 更新提醒
    async changeInfo() {
      let res = await sendMailRemind({
        mouldNo: this.allInfo.mouldNo,
        smallClassOrTableName: this.designList.tableName
      });
      if (res.status === 1) {
        this.$message({
          type: "success",
          message: "已成功发送邮件"
        });
      } else {
        this.$message({
          type: "warning",
          message: "未能成功发送，请稍后尝试"
        });
      }
    },
    // 导出Excel方法
    async getExcelOut() {
      let res = await createDesignInfoByMouldNoExcel({
        mouldNo: this.allInfo.mouldNo,
        type: this.designList.type
      });
      // 结果判断成功使用定时器轮询请求接口 直至success成功
      if (res.status === 1) {
        this.loading=true
        let myTimer = callback => {
          this.timer = setInterval(() => {
            let resg = getDesignInfoExcelStatus({
              mark: res.msg
            });
            callback(resg);
          }, 3000);
        };
        myTimer(val => {
          val.then(end => {
            if (end.msg === "success") {
              this.loading=false
              clearInterval(this.timer);
              // 调用下载接口
              let reg = downloadDesignInfoExcel({
                mark: res.msg,
                mouldNo: this.allInfo.mouldNo,
                type: this.designList.type
              });
            }
          });
        });
      }
    },
    // Echarts封装
    async echart(gyr) {
      //导入echarts
      let myEcharts = Echarts.init(document.getElementById("main"));
      let option = {
        color: ["#A9D769", "#5CC4DE", "#EFAD5C", "#E23220"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          orient: "vertical",
          right: 20,
          top: 70,
          bottom: 20,
          data: ["未确认", "G", "Y", "R"]
        },
        grid: {
          left: "10%",
          right: "20%",
          bottom: "10%",
          containLabel: true
        },
        xAxis: {
          type: "value",
          splitLine: { show: false },
          axisTick: {
            show: false
          },
          axisLine: {
            symbol: ["none", "arrow"],
            symbolSize: [5, 5]
          }
        },
        yAxis: {
          type: "category",
          data: ["STATUS"],
          max: 2,
          axisTick: {
            show: false
          },
          axisLine: {
            symbol: ["none", "arrow"],
            symbolSize: [5, 5]
          }
        },
        series: [
          {
            name: "未确认",
            type: "bar",
            stack: "总量",
            label: {
              normal: {
                show: true,
                position: ["50%", "-55%"],
                formatter: function(params) {
                  if (params.value > 0) {
                    return params.value;
                  } else {
                    return "";
                  }
                },
                fontSize: 13,
                color: "#000"
              }
            },
            data: [gyr.noSure]
          },
          {
            name: "G",
            type: "bar",
            stack: "总量",
            label: {
              normal: {
                show: true,
                position: ["50%", "-55%"],
                formatter: function(params) {
                  if (params.value > 0) {
                    return params.value;
                  } else {
                    return "";
                  }
                },
                fontSize: 13,
                color: "#000"
              }
            },
            data: [gyr.g]
          },
          {
            name: "Y",
            type: "bar",
            stack: "总量",
            label: {
              normal: {
                show: true,
                position: ["50%", "-55%"],
                formatter: function(params) {
                  if (params.value > 0) {
                    return params.value;
                  } else {
                    return "";
                  }
                },
                fontSize: 13,
                color: "#000"
              }
            },
            data: [gyr.y]
          },
          {
            name: "R",
            type: "bar",
            barCategoryGap: "40%",
            stack: "总量",
            label: {
              normal: {
                show: true,
                position: ["50%", "-55%"],
                formatter: function(params) {
                  if (params.value > 0) {
                    return params.value;
                  } else {
                    return "";
                  }
                },
                fontSize: 13,
                color: "#000"
              }
            },
            data: [gyr.r]
          }
        ]
      };
      myEcharts.setOption(option);
      window.onresize = myEcharts.resize;
    },

    // get dataList of table
    async getList() {
      this.statusData = {
        g: 0,
        y: 0,
        r: 0,
        noSure: 0
      };
      this.loading = true;
      let params = {
        mouldNo: this.$store.getters.mould_list.mouldNo,
        type: this.designList.type
      };

      let res = await getDesignInfoByMouldNo(params);

      if (res.status === 1) {
        this.allInfo = JSON.parse(JSON.stringify(res.msg));

        this.table.content = this.allInfo.reviewList;
        this.loading = false;
        this.dealName();
        this.table.content.forEach(item => {
          if (item.status == "G") {
            this.statusData.g++;
          } else if (item.status == "Y") {
            this.statusData.y++;
          } else if (item.status == "R") {
            this.statusData.r++;
          } else {
            this.statusData.noSure++;
          }
        });

        //调用echarts
        this.echart(this.statusData);
      }
    },

    // toggle different tab
    handleClick(tab, event) {
      this.getList();
    },

    // merge cells
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      /*if (this.arrSpanIndex === 0 && !this.arrSpanName) {
          this.arrSpanName = row.name;
        }
        if (this.arrSpanIndex < this.arrSpan.length) {
          if (row.name !== this.arrSpanName) {
            this.arrSpanIndex += 1;
            this.arrSpanName = row.name;
          }

          if (columnIndex === 1) {
            if (rowIndex === 0) {
              return [this.arrSpan[0],1]
            } else if (rowIndex === this.arrSpan[this.arrSpanIndex - 1]) {
              return [this.arrSpan[this.arrSpanIndex] - this.arrSpan[this.arrSpanIndex - 1], 1]
            } else {
              return [0,0]
            }
          }
        }*/
      if (this.designList.type === 1) {
        if (columnIndex === 1) {
          if (rowIndex === 0) {
            return [1, 1];
          } else if (rowIndex === 1) {
            return [3, 1];
          } else if (rowIndex === 4) {
            return [3, 1];
          } else if (rowIndex === 7) {
            return [7, 1];
          } else if (rowIndex === 14) {
            return [3, 1];
          } else {
            return [0, 0];
          }
        }
      } else if (this.designList.type === 2) {
        if (columnIndex === 1) {
          if (rowIndex === 0) {
            return [1, 1];
          } else if (rowIndex === 1) {
            return [1, 1];
          } else if (rowIndex === 2) {
            return [3, 1];
          } else if (rowIndex === 5) {
            return [8, 1];
          } else if (rowIndex === 13) {
            return [9, 1];
          } else if (rowIndex === 22) {
            return [3, 1];
          } else if (rowIndex === 25) {
            return [3, 1];
          } else if (rowIndex === 28) {
            return [6, 1];
          } else if (rowIndex === 34) {
            return [2, 1];
          } else if (rowIndex === 36) {
            return [1, 1];
          } else {
            return [0, 0];
          }
        }
      } else if (this.designList.type === 3) {
        if (columnIndex === 1) {
          if (rowIndex === 0) {
            return [4, 1];
          } else if (rowIndex === 4) {
            return [10, 1];
          } else if (rowIndex === 14) {
            return [8, 1];
          } else if (rowIndex === 22) {
            return [12, 1];
          } else if (rowIndex === 34) {
            return [2, 1];
          } else {
            return [0, 0];
          }
        }
      }
    },

    // deal the order of table.name
    dealName() {
      let arr = [];
      let index = 0;
      arr[0] = 1;
      let val, newVal;
      for (let i = 0; i < this.table.content.length; i++) {
        val = this.table.content[i].name;
        newVal = this.table.content[i + 1]
          ? this.table.content[i + 1].name
          : "";
        if (val !== newVal) {
          if (index) {
            arr[index] += arr[index - 1];
          }
        }
        if (newVal) {
          if (val === newVal) {
            arr[index] += 1;
          } else {
            index += 1;
            arr[index] = 1;
          }
        }
      }
      console.log(arr);
      this.arrSpan = [...arr];
    },

    // update designList info
    async updateInfo() {
      let res = await updateDesignInfo(this.allInfo);
      if (res.status === 1) {
        Message({
          showClose: true,
          type: "success",
          message: "更新状态成功！"
        });
        this.getList();
      }
    },

    /*// GET INPUT INFO
      async saveInfo(val) {
        let arr = {};
        let inputs = document.getElementsByClassName('param');

        console.log(inputs);

        for (let i = 0; i < inputs.length / 3; i++) {  // inputs divide 3, because of the attribute of "fixed"(is-hidden), create three different part & same content
          inputs[i].disabled = this.$store.getters.userLoginVO.role !== 1;
          if (!inputs[i].disabled) {
            inputs[i].maxLength = 10;
          }
          let n = inputs[i].name - 1;
          if (!arr[n]) {
            arr[n] = [];
          }
          arr[n].push(inputs[i].value);
        }
        if (val) {
          let c = [...this.table.content];
          c.forEach((item, index) => {
            if (arr[index]) {
              if (arr[index][0]) {
                item.firstParam = arr[index][0];
              }
              if (arr[index][1]) {
                item.secondParam = arr[index][1];
              }
            }

          });
          // console.log(this.table.content);
          // this.allInfo.remark = this.remark;
          let res;
          if (val === 1) {
            res = await updateApproveInfoByInnerUser(this.allInfo);
          } else {
            res = await updateApproveInfoByCustomer(this.allInfo);
          }
          if (res.status === 1) {
            Message({showClose: true, type: 'success', message: '保存成功！'});
            this.getList();
          }
        }
      },*/

    // 查看详情
    lookDetails(item) {
      item.mouldNo = this.allInfo.mouldNo;
      this.show = false;
      this.$store.dispatch("design_details", item);
      let obj = { id: "designList_Edit_detail", name: item.name + "详情" };
      this.$emit("bread", obj);
    },

    // show default module
    showDefault(val) {
      if (val) {
        this.show = true;
        if (val === "4-1") {
          this.$emit("changed", "4-1");
        }
        this.getList();
      }
    }
  },
  data() {
    return {
      // table
      allInfo: {},
      table: {},
      loading: true,
      currentPage: 1,
      size: 10,

      header: [
        { prop: "name", label: "名称", width: 100 },
        {
          prop: "verification",
          label: "VERIFICATION",
          pre: true,
          minWidth: "600px",
          width: "unset"
        },

        {
          prop: "status",
          label: "STATUS",
          width: 120,
          select: [
            { id: "G", label: "G" },
            { id: "Y", label: "Y" },
            { id: "R", label: "R" }
          ],
          disabled: true
        },
        { prop: "remarks", label: "REMARKS", minWidth: 100 }
      ],

      remark: "",

      designList: {},

      show: true,

      // arraySpanMethod
      arrSpan: [],
      arrSpanIndex: 0,
      arrSpanName: "",
      //status数据
      statusData: {
        g: 0,
        y: 0,
        r: 0,
        noSure: 0
      },
      // 导出excel秘钥
      keyUp: "",
      // 轮询请求接口回调值
      sorF: 0,
      // 定时器全局定义
      timer: null
    };
  }
};
</script>

<style lang="scss">
.change {
  float: right;
}
.changeOne {
  float: left;
}
.exportExcelStyle {
  float: left;
  width: 80px;
  height: 30px;
  background: #409eff;
  color: white;
  text-decoration: none;
  line-height: 30px;
  border-radius: 6px;
  text-align: center;
  font-size: 12px;
}
.el-tabs__item {
  height: 32px !important;
  line-height: 32px !important;
  font-size: 12px !important;
}
.param {
  /*outline*/
  width: 80px;
  outline: none;
  border: none;
  border-bottom: 1px solid #ddd;
  background: none;
  text-align: center;
}

.mouldList {
  .el-select {
    .el-input__inner {
      /*text-align: center;*/
      /*outline: none;*/
      /*border: none;*/
      /*background: none;*/
      /*border-bottom: 1px solid #aaa;*/
      /*border-radius: unset;*/
    }
  }
}
</style>
