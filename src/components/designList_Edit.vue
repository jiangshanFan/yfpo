<template>
  <div class="designList_Edit">
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
          <h1 class="tc mt20">{{designList.tableName}}</h1>

          <!-- 表格数据 -->
          <el-table :data="table.content" :span-method="arraySpanMethod" stripe border size="small" style="width: 100%;margin-top:10px;" header-cell-class-name="header_cell table_header_shadow" tooltip-effect="light">

            <el-table-column fixed type="index" width="60" label="序号" align="center" :index="(index) => this.$indexS(index, currentPage, size)"></el-table-column>

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
  import { Message, MessageBox, Loading } from 'element-ui';
  /** 导入api.js */
  import { getDesignInfoByMouldNo, updateDesignInfo} from '../axios/api.js'
  import column from './tableColumn'
  import designList_Edit_detail from './designList_Edit_detail'

  export default {
    name: "designList_Edit",
    components: {
      'column': column,
      'detail': designList_Edit_detail,
    },
    props: {

    },
    created() {
      this.designList = this.$store.getters.design_type;
    },
    mounted() {
      this.getList();
    },

    updated() {
      // this.saveInfo()
    },
    methods: {
      // get dataList of table
      async getList() {
        this.loading = true;
        let params = {
          mouldNo: this.$store.getters.mould_list.mouldNo,
          type: this.designList.type,
        };

        let res = await getDesignInfoByMouldNo(params);

        if(res.status === 1) {
          this.allInfo = JSON.parse(JSON.stringify(res.msg));
          this.table.content = this.allInfo.reviewList;
          this.loading = false;
          this.dealName();
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
              return [1,1]
            } else if (rowIndex === 1) {
              return [3, 1]
            } else if (rowIndex === 4) {
              return [3, 1]
            } else if (rowIndex === 7) {
              return [7, 1]
            } else if (rowIndex === 14) {
              return [3, 1]
            } else {
              return [0,0]
            }
          }
        } else if (this.designList.type === 2) {
          if (columnIndex === 1) {
            if (rowIndex === 0) {
              return [1,1]
            } else if (rowIndex === 1) {
              return [1, 1]
            } else if (rowIndex === 2) {
              return [3, 1]
            } else if (rowIndex === 5) {
              return [8, 1]
            } else if (rowIndex === 13) {
              return [9, 1]
            } else if (rowIndex === 22) {
              return [3, 1]
            } else if (rowIndex === 25) {
              return [3, 1]
            } else if (rowIndex === 28) {
              return [6, 1]
            } else if (rowIndex === 34) {
              return [2, 1]
            } else if (rowIndex === 36) {
              return [1, 1]
            } else {
              return [0,0]
            }
          }
        } else if (this.designList.type === 3) {
          if (columnIndex === 1) {
            if (rowIndex === 0) {
              return [4,1]
            } else if (rowIndex === 4) {
              return [10, 1]
            } else if (rowIndex === 14) {
              return [8, 1]
            } else if (rowIndex === 22) {
              return [12, 1]
            } else if (rowIndex === 34) {
              return [2, 1]
            } else {
              return [0,0]
            }
          }
        }
      },

      // deal the order of table.name
      dealName() {
        let arr = [];
        let index = 0;
        arr[0]=1;
        let val, newVal;
        for (let i = 0; i < this.table.content.length; i++) {
          val = this.table.content[i].name;
          newVal = this.table.content[i+1]?this.table.content[i+1].name:'';
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
              arr[index]=1;
            }
          }
        }
        // console.log(arr);
        this.arrSpan = [...arr];
      },

      // update designList info
      async updateInfo() {
        let res = await updateDesignInfo(this.allInfo);
        if (res.status === 1) {
          Message({showClose: true, type: 'success', message: '更新状态成功！'});
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
        this.show = false;
        this.$store.dispatch('design_details', item);
        let obj = {id: 'designList_Edit_detail', name: item.name+'详情'};
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
          { prop: 'name', label: '名称', width: 100,},
          { prop: 'verification', label: 'VERIFICATION', pre: true, minWidth: '600px', width: 'unset',},

          { prop: 'status', label: 'STATUS', width: 120, select: [ { id: 'G', label: 'G'},{ id: 'Y', label: 'Y'},{ id: 'R', label: 'R'},{ id: 'N/A', label: 'N/A'},], disabled: true,},
          { prop: 'remarks', label: 'REMARKS', minWidth: 100,},
        ],

        remark: '',

        designList: {},

        show: true,

        // arraySpanMethod
        arrSpan: [],
        arrSpanIndex: 0,
        arrSpanName: '',
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
