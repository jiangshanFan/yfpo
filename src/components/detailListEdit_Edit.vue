<template>
  <div class="detailListEdit_Edit">
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
          element-loading-background="rgba(0, 0, 0, 0.9)"
        >
          <h1 class="tc mt20">{{allInfo.largeClass}}</h1>

          <el-tabs class="mt20" v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane
              v-for="item in tabs"
              :key="item.name"
              :label="item.label"
              :name="item.name"
            ></el-tab-pane>
          </el-tabs>
          <!-- echarts -->
          <div id="main" style="width:100%; height:200px;"></div>
          <!-- 表格数据 -->
          <el-table
            :data="table.content"
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
              :index="(index) => this.$indexS(index, currentPage, size, activeName)"
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

        <el-col class="mt20">
          <p>备注：</p>
          <el-input
            type="textarea"
            :rows="3"
            placeholder="请输入备注"
            v-model="remark"
            maxlength="100"
            show-word-limit
            :disabled="this.$store.getters.userLoginVO.role !== 1"
          ></el-input>
        </el-col>
      </el-col>

      <el-col class="tc mt20">
        <el-button type="primary" size="mini" @click="saveInfo($store.getters.userLoginVO.role)">保存</el-button>
      </el-col>
    </el-row>

    <detail v-else @changed="showDefault"></detail>
  </div>
</template>

<script>
/* eslint-disable */
import { Message, MessageBox, Loading } from "element-ui";
/** 导入api.js */
import Echarts from "../../node_modules/echarts/dist/echarts.min.js";
import {
  getApproveInfoByMouldNo,
  updateApproveInfoByInnerUser,
  updateApproveInfoByCustomer
} from "../axios/api.js";
import column from "./tableColumn";
import detailListEdit_Edit_detail from "./detailListEdit_Edit_detail";
export default {
  name: "detailListEdit_Edit",
  components: {
    column: column,
    detail: detailListEdit_Edit_detail
  },
  props: {},
  created() {
    this.tabs = this.$store.getters.tabs;
    let arr = [];
    if (this.tabs[0].name === "A") {
      this.header.forEach(item => {
        if (item.prop !== "factoryConfirm") {
          arr.push(item);
        }
      });
      this.header = [...arr];
    }
  },
  mounted() {
    this.loading = true;
    this.activeName = this.tabs[0].name;
    this.getList();
  },

  updated() {
    // this.saveInfo()
  },
  methods: {
    //echaets
    async echart(ec, sc, lc) {
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
          data: ["未确认", "OK", "OK with reserves", "Not Ok"]
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
            symbolSize:[5,5]
          }
        },
        yAxis: {
          type: "category",
          data:
            this.tabs[0].name !== "A"
              ? ["YFPO 工厂确认", "YFPO TC确认", "制造商确认"]
              : ["YFPO TC确认", "制造商确认"],
          max: this.tabs[0].name !== "A" ? 2 : 1,
          axisTick: {
            show: false
          },
          axisLine: {
            symbol: ["none", "arrow"],
            symbolSize:[5,5]
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
                position:
                  this.tabs[0].name !== "A"
                    ? ["50%", "-100%"]
                    : ["50%", "-40%"],
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
            data:
              this.tabs[0].name !== "A"
                ? [lc.noSure, sc.noSure, ec.noSure]
                : [sc.noSure, ec.noSure]
          },
          {
            name: "OK",
            type: "bar",
            stack: "总量",
            label: {
              normal: {
                show: true,
                position:
                  this.tabs[0].name !== "A"
                    ? ["50%", "-100%"]
                    : ["50%", "-40%"],
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
            data:
              this.tabs[0].name !== "A"
                ? [lc.okData, sc.okData, ec.okData]
                : [sc.okData, ec.okData]
          },
          {
            name: "OK with reserves",
            type: "bar",
            stack: "总量",
            label: {
              normal: {
                show: true,
                position:
                  this.tabs[0].name !== "A"
                    ? ["50%", "-100%"]
                    : ["50%", "-40%"],
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
            data:
              this.tabs[0].name !== "A"
                ? [lc.okWithServer, sc.okWithServer, ec.okWithServer]
                : [sc.okWithServer, ec.okWithServer]
          },
          {
            name: "Not Ok",
            type: "bar",
            barCategoryGap: this.tabs[0].name !== "A" ? "60%" : "40%",
            stack: "总量",
            label: {
              normal: {
                show: true,
                position:
                  this.tabs[0].name !== "A"
                    ? ["50%", "-100%"]
                    : ["50%", "-40%"],
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
            data:
              this.tabs[0].name !== "A"
                ? [lc.notOkData, sc.notOkData, ec.notOkData]
                : [sc.notOkData, ec.notOkData]
          }
        ]
      };
      myEcharts.setOption(option);
      window.onresize = myEcharts.resize;
      // console.log(ec,sc,lc);
    },
    // get dataList of table
    async getList() {
      this.echartsData = {
        notOkData: 0,
        okData: 0,
        okWithServer: 0,
        noSure: 0
      };
      this.secondData = {
        notOkData: 0,
        okData: 0,
        okWithServer: 0,
        noSure: 0
      };
      this.lastData = {
        notOkData: 0,
        okData: 0,
        okWithServer: 0,
        noSure: 0
      };
      this.loading = true;
      let params = {
        mouldNo: this.$store.getters.mould_list.mouldNo,
        smallClass: this.activeName
      };

      let res = await getApproveInfoByMouldNo(params);

      if (res.status === 1) {
        this.allInfo = JSON.parse(JSON.stringify(res.msg));
        this.table.content = this.allInfo.checkList;
        // console.log(this.table.content);
        // 制造商确认
        this.table.content.forEach(item => {
          if (item.makeConfirm == 0) {
            this.echartsData.notOkData++;
          } else if (item.makeConfirm == 1) {
            this.echartsData.okData++;
          } else if (item.makeConfirm == 2) {
            this.echartsData.okWithServer++;
          } else if (item.makeConfirm == null) {
            this.echartsData.noSure++;
          }
          // YFPO TC确认
          if (item.tcConfirm == 0) {
            this.secondData.notOkData++;
          } else if (item.tcConfirm == 1) {
            this.secondData.okData++;
          } else if (item.tcConfirm == 2) {
            this.secondData.okWithServer++;
          } else if (item.tcConfirm == null) {
            this.secondData.noSure++;
          }
          //工厂确认

          if (item.factoryConfirm == 0) {
            this.lastData.notOkData++;
          } else if (item.factoryConfirm == 1) {
            this.lastData.okData++;
          } else if (item.factoryConfirm == 2) {
            this.lastData.okWithServer++;
          } else if (item.factoryConfirm == null) {
            this.lastData.noSure++;
          }
        });

        //echarts调用
        this.echart(this.echartsData, this.secondData, this.lastData);

        this.remark = this.allInfo.remark;
        setTimeout(() => {
          this.loading = false;
        }, 500);
        setTimeout(this.saveInfo, 500); // maybe the web's delay will cause the error
      }
    },

    // toggle different tab
    handleClick(tab, event) {
      this.getList();
    },

    // GET INPUT INFO
    async saveInfo(val) {
      let arr = {};
      let inputs = document.getElementsByClassName("param");

      // console.log(inputs);

      for (let i = 0; i < inputs.length / 3; i++) {
        // inputs divide 3, because of the attribute of "fixed"(is-hidden), create three different part & same content
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
        this.allInfo.remark = this.remark;
        let res;
        if (val === 1) {
          res = await updateApproveInfoByInnerUser(this.allInfo);
        } else {
          res = await updateApproveInfoByCustomer(this.allInfo);
        }
        if (res.status === 1) {
          Message({ showClose: true, type: "success", message: "保存成功！" });
          this.getList();
        }
      }
    },

    // 查看详情
    lookDetails(item) {
      this.show = false;
      this.$store.dispatch("details", item);
      let obj = {
        id: "detailListEdit_Edit_detail",
        name: item.serialNo + "详情"
      };
      this.$emit("bread", obj);
    },

    // show default module
    showDefault(val) {
      if (val) {
        this.show = true;
        this.$emit("change", 2);
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
        {
          prop: "checkContent",
          label: "检查内容",
          pre: true,
          minWidth: "600px",
          width: "unset"
        },

        {
          prop: "makeConfirm",
          label: "制造商确认",
          eachWidth: 32,
          disabled: this.$store.getters.userLoginVO.role === 1,
          select: [
            { id: 0, label: "Not OK" },
            { id: 1, label: "OK" },
            { id: 2, label: "OK with reserves" }
          ]
        },
        {
          prop: "tcConfirm",
          label: "YFPO  TC 确认",
          eachWidth: 15,
          disabled: this.$store.getters.userLoginVO.role === 2,
          select: [
            { id: 0, label: "Not OK" },
            { id: 1, label: "OK" },
            { id: 2, label: "OK with reserves" }
          ]
        },
        {
          prop: "factoryConfirm",
          label: "YFPO  工厂确认",
          eachWidth: 16,
          disabled: this.$store.getters.userLoginVO.role === 2,
          select: [
            { id: 0, label: "Not OK" },
            { id: 1, label: "OK" },
            { id: 2, label: "OK with reserves" }
          ]
        }
      ],

      activeName: "first",

      remark: "",

      tabs: [],

      show: true,
      //echartsdata
      //制造商
      echartsData: {
        notOkData: 0,
        okData: 0,
        okWithServer: 0,
        noSure: 0
      },
      // yfpo tc
      secondData: {
        notOkData: 0,
        okData: 0,
        okWithServer: 0,
        noSure: 0
      },
      // 工厂确认
      lastData: {
        notOkData: 0,
        okData: 0,
        okWithServer: 0,
        noSure: 0
      }
    };
  }
};
</script>

<style lang="scss">
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
