<template>
  <div class="designList">
    <el-row v-if="designList_show === 0">
      <el-col>
        <h1>设计评审清单表</h1>

        <!-- 表格数据 -->
        <el-table
          :data="table.content"
          v-loading="loading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.9)"
          border size="small"
          style="width: 100%;margin-top:10px;"
          header-cell-class-name="header_cell table_header_shadow"
          tooltip-effect="light"
        >

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

    <Edit v-else-if="designList_show === 1" @changed="showDefault" @bread="bread"></Edit>
  </div>
</template>

<script>
/* eslint-disable */
  import { Message, MessageBox, Loading } from 'element-ui';
  /** 导入api.js */
  import { getDesignStatistics, } from '../axios/api.js'
  import column from './tableColumn'
  import Edit from './designList_Edit'

  export default {
    name: "designList",
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
      this.designList_show = this.showNo;
    },

    methods: {
      // get dataList of table
      async getList() {
        this.loading = true;
        let params = {
          mouldNo: this.$store.getters.mould_list.mouldNo,
        };

        let res = await getDesignStatistics(params);

        if(res.status === 1) {
          this.table.content = res.msg.slice();
          this.loading = false;
          // this.table.content = [{largeClass: 'TOOL IMFORMATION'}, ...this.table.content, ];
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

      edits(scope, obj={id: 'designListTable', name: '模具初结构预评审清单'}) {
        let index;
        this.designList_show = 1;
        obj.name = scope.row.tableName;
        obj.thing = '4-1';

        this.$store.dispatch('design_type', scope.row);
        this.$emit('designListTable', obj);
      },

      // change the breadCrumb
      bread(obj) {
        this.$emit('designListTable', obj);
      },

      // download Excel
      // async exportExcel() {
      //   let res = await downloadProjectList();
      // },

      // show default module
      showDefault(val) {
        if (val) {
          // this.designList_show = 0;
          // this.breadcrumb = this.breadcrumb.slice(0,3);
          if (val === '4-1') {
            this.$emit('ifChange','4-1');
          }
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
          { prop: 'tableName', label: '表名称', width: 'unset', minWidth: '200px'},
          { prop: 'unConfirm', label: '未确认',},

          { prop: 'g', label: 'G', width: 50,},
          { prop: 'y', label: 'Y', width: 50,},
          { prop: 'r', label: 'R', width: 50,},
        ],

        options: {

        },

        designList_show: 0,
      }
    },
  }
</script>

<style scoped>

</style>
