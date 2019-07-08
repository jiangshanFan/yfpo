<template>
  <div class="detailListEdit_Edit">
    <el-row v-if="show">
      <el-col :span="20" :offset="2">
        <p class="tc p20 boxShadow_head">
          <span class="mr40">项目名称：{{allInfo.projectName}}</span><span class="ml20">模具编号：{{allInfo.mouldNo}}</span>
        </p>
        <!--<hr>-->

        <div v-loading="loading"
             element-loading-text="拼命加载中"
             element-loading-spinner="el-icon-loading"
             element-loading-background="rgba(0, 0, 0, 0.8)">
          <h1 class="tc mt20">{{allInfo.largeClass}}</h1>

          <el-tabs class="mt20" v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane v-for="item in tabs" :key="item.name" :label="item.label" :name="item.name"></el-tab-pane>
          </el-tabs>

          <!-- 表格数据 -->
          <el-table :data="table.content" stripe border size="small" style="width: 100%;margin-top:10px;" header-cell-class-name="header_cell table_header_shadow" tooltip-effect="light">

            <el-table-column fixed type="index" width="60" label="序号" align="center" :index="(index) => this.$indexS(index, currentPage, size, activeName)"></el-table-column>

            <!-- circle -->
            <column :header="header"></column>

            <el-table-column fixed="right" label="操作" width="60" align="center">
              <template slot-scope="scope">
              <span>
                <el-button class="underline f12" @click="lookDetails(scope.row)" type="text" align="center">详情</el-button>
              </span>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <el-col class="mt20">
          <p>备注：</p>
          <el-input type="textarea" :rows="3" placeholder="请输入备注" v-model="remark" maxlength="100" show-word-limit :disabled="this.$store.getters.userLoginVO.role !== 1"></el-input>
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
  import { Message, MessageBox, Loading } from 'element-ui';
  /** 导入api.js */
  import { getApproveInfoByMouldNo, updateApproveInfoByInnerUser, updateApproveInfoByCustomer} from '../axios/api.js'
  import column from './tableColumn'
  import detailListEdit_Edit_detail from './detailListEdit_Edit_detail'

  export default {
    name: "detailListEdit_Edit",
    components: {
      'column': column,
      'detail': detailListEdit_Edit_detail,
    },
    props: {

    },
    created() {
      this.tabs = this.$store.getters.tabs;
    },
    mounted() {
      this.activeName = this.tabs[0].name;
      this.getList();
    },

    updated() {
      this.saveInfo()
    },
    methods: {
      // get dataList of table
      async getList() {
        this.loading = true;
        let params = {
          mouldNo: this.$store.getters.mould_list.mouldNo,
          smallClass: this.activeName,
        };

        let res = await getApproveInfoByMouldNo(params);

        if(res.status === 1) {
          this.allInfo = JSON.parse(JSON.stringify(res.msg));
          this.table.content = this.allInfo.checkList;
          this.remark = this.allInfo.remark;
          this.loading = false;
          // setTimeout(this.saveInfo,500);  // maybe the web's delay will cause the error
        }
      },

      // toggle different tab
      handleClick(tab, event) {
        this.getList();
      },

      // GET INPUT INFO
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
          this.allInfo.remark = this.remark;
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
      },

      // 查看详情
      lookDetails(item) {
        this.show = false;
        this.$store.dispatch('details', item);
        let obj = {id: 'detailListEdit_Edit_detail', name: item.serialNo+'详情'};
        this.$emit('bread', obj);
      },

      // show default module
      showDefault(val) {
        if (val) {
          this.show = true;
          this.$emit('change', 2)
        }
      },
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
          { prop: 'checkContent', label: '检查内容', pre: true, minWidth: '600px', width: 'unset',},

          { prop: 'makeConfirm', label: '制造商确认', eachWidth: 32, disabled: this.$store.getters.userLoginVO.role === 1, select: [{id: 0, label: 'Not OK'}, {id: 1, label: 'OK'}, {id: 2, label: 'OK with reserves'}, ]},
          { prop: 'tcConfirm', label: 'YFPO  TC 确认', eachWidth: 15, disabled: this.$store.getters.userLoginVO.role === 2, select: [{id: 0, label: 'Not OK'}, {id: 1, label: 'OK'}, {id: 2, label: 'OK with reserves'}, ]},
          { prop: 'factoryConfirm', label: 'YFPO  工厂确认', eachWidth: 16, disabled: this.$store.getters.userLoginVO.role === 2, select: [{id: 0, label: 'Not OK'}, {id: 1, label: 'OK'}, {id: 2, label: 'OK with reserves'}, ]},
        ],

        activeName: 'first',

        remark: '',

        tabs: [],

        show: true,
      }
    },
  }
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
