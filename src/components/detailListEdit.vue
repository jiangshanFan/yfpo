<template>
  <div class="detailListEdit p20">
    <el-row v-if="detailListEdit_show === 0">
      <el-col :span="20" :offset="2">
        <h1>试模验收认可清单表</h1>

        <!-- 表格数据 -->
        <el-table :data="table.content" v-loading="loading" :span-method="arraySpanMethod" border size="small" style="width: 100%;margin-top:10px;" header-cell-class-name="header_cell table_header_shadow" tooltip-effect="light">

          <el-table-column fixed type="index" width="60" label="序号" align="center" :index="(index) => this.$indexS(index, currentPage, size)"></el-table-column>

          <!-- circle -->
          <column :header="header"></column>

          <el-table-column fixed="right" label="操作" width="60" align="center">
            <template slot-scope="scope">
              <span>
                <el-button class="underline f12" @click="edits(scope)" type="text" align="center">编辑</el-button>
              </span>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <Edit v-else-if="detailListEdit_show === 1" @changed="showDefault" @bread="bread"></Edit>
  </div>
</template>

<script>
/* eslint-disable */
  import { Message, MessageBox, Loading } from 'element-ui';
  /** 导入api.js */
  import { getApproveStatistics, } from '../axios/api.js'
  import column from './tableColumn'
  import Edit from './detailListEdit_Edit'

  export default {
    name: "detailListEdit",
    components: {
      'column': column,
      'Edit': Edit,
    },
    props: {
      show: {
        type: Boolean,
        default: function() {
          return true;
        }
      },
      showNo: {
        type: Number,
        default: function() {
          return 0;
        }
      },
    },
    created() {
      this.getList();
      this.detailListEdit_show = this.showNo;
    },

    methods: {
      // get dataList of table
      async getList() {
        this.loading = true;
        let params = {
          mouldNo: this.$store.getters.mould_list.mouldNo,
        };

        let res = await getApproveStatistics(params);

        if(res.status === 1) {
          this.table.content = [...res.msg.slice(0,2), ...res.msg.slice(3)];
          this.loading = false;
          // this.table.content = [{largeClass: 'TOOL IMFORMATION'}, ...this.table.content, ];
        }
      },

      // merge cells
      arraySpanMethod({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 1 || column.label === "操作") {
          if ((rowIndex - 2) % 3 === 0 && rowIndex > 1) {
            return [3,1]
          } else if (rowIndex === 0) {
            return [2,1]
          } else {
            return [0,0]
          }
        }
      },

      // deletes(row) {
      //   this.$confirm(`此操作将删除"${row.projectName}", 是否继续?`, '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).then(async () => {
      //     let res = await removeProjectInformation({id: row.id});
      //     if(res.status === 1) {
      //       this.getList();
      //       Message({showClose: true, type: 'success', message: '删除成功！'});
      //     }
      //   }).catch(() => {
      //     this.$message({type: 'info', message: '已取消删除'});
      //   });
      // },

      edits(scope, obj={id: 'detailListEditTable', name: 'TOOL INFORMATION'}) {
        let index;
        this.detailListEdit_show = 1;
        obj.name = scope.row.largeClass;
        obj.thing = '2-1';
        if (scope.$index) {
          index = (scope.$index + 1) / 3;  // 耦合度太高，考虑其他参数代替
        } else {
          index = 0;
        }
        this.tabs = this.detailList[index];
        this.$store.dispatch('tabs', this.tabs);
        console.log(this.tabs);
        this.$emit('detailListEditTable', obj);
      },

      // change the breadCrumb
      bread(obj) {
        this.$emit('detailListEditTable', obj);
      },

      // download Excel
      // async exportExcel() {
      //   let res = await downloadProjectList();
      // },

      // show default module
      showDefault(val) {
        if (val) {
          this.detailListEdit_show = 0;
          this.breadcrumb = this.breadcrumb.slice(0,3);
          this.getList();
        }
      },
    },
    data() {
      return {
        // table
        table: {},
        loading: true,
        currentPage: 1,
        size: 10,

        header: [
          { prop: 'largeClass', label: '表名称', width: 'unset', minWidth: '200px'},
          { prop: 'confirmor', label: '确认人', width: 'unset', minWidth: '120px'},
          { prop: 'unconfirm', label: '未确认',},

          { prop: 'ok', label: 'OK',},
          { prop: 'okWithReserves', label: 'OK with reserves', eachWidth: 10},
          { prop: 'notOk', label: 'Not OK', eachWidth: 15},
        ],

        options: {

        },

        detailListEdit_show: 0,

        // 所有认可清单项
        detailList: [
          [
            { name: 'A', label: 'A 吊装存放安全确认'},
            { name: 'B', label: 'B 顶块研配状态确认'},
            { name: 'C', label: 'C 分型面合模状态确认'},
          ],
          [
            { name: 'D', label: 'D 模具试模状态确认'},
            { name: 'E', label: 'E 产品质量状态确认'},
            { name: 'F', label: 'F 注塑工艺状态确认'},
            { name: 'G', label: 'G 产品取件确认'},
          ],
          [
            { name: 'H', label: 'H 模具试模状态确认'},
            { name: 'I', label: 'I 产品质量状态确认'},
            { name: 'J', label: 'J注塑工艺状态确认'},
            { name: 'K', label: 'K 产品取件确认'},
          ],
          [
            { name: 'L', label: 'L 空运转情况'},
            { name: 'M', label: 'M 模具匹配磨损情况'},
            { name: 'N', label: 'N顶出抽芯系统'},
            { name: 'O', label: 'O 热流道系统'},
            { name: 'P', label: 'P 冷却系统'},
            { name: 'Q', label: 'Q 信号系统'},
            { name: 'R', label: 'R 注塑设备匹配'},
            { name: 'S', label: 'S 模具总体考虑'},
          ],
          [
            { name: 'T', label: 'T产品质量状态确认'},
            { name: 'U', label: 'U 模具状态确认'},
            { name: 'V', label: 'V注塑工艺状态确认'},
            { name: 'W', label: 'W产品取件确认'},
          ],
          [
            { name: 'X', label: 'X 外围油漆、喷字、铭牌'},
            { name: 'Y', label: 'Y 模板与设备的匹配'},
            { name: 'Z', label: 'Z 发运检查测试报告'},
          ],
        ],
        tabs: [],
      }
    },
  }
</script>

<style scoped>

</style>
