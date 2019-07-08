<template>
  <div class="mouldList posr ovwh">
    <!--面包屑-->
    <breadcrumbList :breadcrumb-list="breadcrumb" @showDefault="showDefault"></breadcrumbList>

    <AddOrEdit v-if="show === 1" @ifChange="showDefault"></AddOrEdit>

    <detailAddOrEdit v-else-if="show === 2" @ifChange="showDefault" @detailListEditTable="addBreadcrumb" :showNo="showNo"></detailAddOrEdit>

    <el-row v-else-if="show === 0">
      <el-col :span="20" :offset="2">
        <div class="mouldLists pl20 pr20">
          <!--  search -->
          <div class="section-search mb20 mt20">
            <el-row class="boxShadow_head p20">
              <div class="fl mr20 mb20">
                <span class="c6">项目名称：</span>
                <el-input v-model="search.value1" size="mini" clearable style="width:calc(100% - 100px);"></el-input>
              </div>

              <div class="fl mr20 mb20">
                <span class="c6">模具编号：</span>
                <el-input v-model="search.value2" size="mini" clearable style="width:calc(100% - 100px);"></el-input>
              </div>

              <div class="fl mr20 mb20">
                <span class="c6">项目创建时间：</span>
                <el-date-picker  clearable style="width:calc(100% - 100px);"
                                 v-model="search.value3"
                                 type="datetimerange"
                                 align="right"
                                 format="yyyy-MM-dd"
                                 range-separator="-"
                                 start-placeholder="开始日期"
                                 end-placeholder="结束日期"
                                 :default-time="['00:00:00', '23:59:59']"
                                 size="mini">
                </el-date-picker>
              </div>

              <el-button type="primary" size="mini" icon="el-icon-search" class="fl" @click="Search()"></el-button>
            </el-row>
            <!--<hr>-->
          </div>

          <!-- content -->
          <div class="mt20">
            <!-- 添加 -->
            <el-button type="primary" size="mini" @click="addOrEdit()">新增</el-button>

            <!-- 表格数据 -->
            <el-table :data="table.content" stripe border size="small" style="width: 100%;margin-top:10px;" header-cell-class-name="header_cell table_header_shadow" tooltip-effect="light">

              <el-table-column fixed type="index" width="60" label="序号" align="center" :index="(index) => this.$indexS(index, currentPage, size)"></el-table-column>

              <!-- circle -->
              <column :header="header"></column>

              <el-table-column fixed="right" label="项目详情" width="100" align="center">
                <template slot-scope="scope">
                  <span>
                    <el-button class="underline f12" @click="addOrEdit(scope.row)" type="text" align="center">编辑</el-button>
                  </span>
                </template>
              </el-table-column>

              <el-table-column fixed="right" label="注塑模具试模验收认可清单" width="180" align="center">
                <template slot-scope="scope">
                  <span>
                    <el-button class="underline f12" @click="edits(scope.row)" type="text" align="center">编辑</el-button>
                  </span>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页 -->
            <div class="pagination fr ovw-h mt20">
              <el-pagination @current-change="handleCurrentChange"
                             :current-page="currentPage" :page-size="size"
                             layout="total, prev, pager, next"
                             :total="table.totalCount" v-if="table.totalCount">
              </el-pagination>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

  </div>

</template>

<script>
/* eslint-disable */
  import { Message, MessageBox, Loading } from 'element-ui';
  /** 导入api.js */
  import { getMouldList, } from '../../axios/api.js'
  import column from '../../components/tableColumn'
  import breadcrumbList from '../../components/breadcrumbList'
  import mouldAddOrEdit from '../../components/mouldAddOrEdit'
  import detailListEdit from '../../components/detailListEdit'

  export default {
    name: "mouldList",
    components: {
      'breadcrumbList': breadcrumbList,
      'AddOrEdit': mouldAddOrEdit,
      'detailAddOrEdit': detailListEdit,
      'column': column,
    },
    created() {
      this.getList();
    },

    methods: {
      // get dataList of table
      async getList() {
        let params = {
          page: this.currentPage,
          size: this.size,
        };
        if(this.search.value1) {
          params.projectName = this.search.value1;
        }
        if(this.search.value2) {
          params.mouldNo = this.search.value2;
        }

        if(this.search.value3) {
          params.createStartTime = this.search.value3[0];
          params.createEndTime = this.search.value3[1];
        }

        let res = await getMouldList(params);
        if(res.status === 1) {
          this.table = res.msg;
        }
      },

      // search
      Search() {
        this.currentPage = 1;
        this.getList();
      },

      handleCurrentChange(val) {
        this.currentPage = val;
        this.getList();
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

      addOrEdit(row) {
        this.show = 1;
        if (row) {
          this.$store.dispatch('mould_list', row);
          this.breadcrumb.push({id: 'edit', name: '编辑项目'});
        } else {
          this.$store.dispatch('mould_list', {});
          this.breadcrumb.push({id: 'add', name: '新增项目'});
        }
      },

      edits(row) {
        this.show = 2;
        this.$store.dispatch('mould_list', row);
        this.breadcrumb.push({id: 'detailListEdit', name: '编辑清单', thing: 2});
      },

      // download Excel
      // async exportExcel() {
      //   let res = await downloadProjectList();
      // },

      // addBreadcrumb multilayer
      addBreadcrumb(obj) {
        this.breadcrumb.push(obj);
      },

      // show default module
      showDefault(val) {
        if (val) {
          if (val === 2) {
            this.show = -1;
            this.$nextTick(function () {
              this.show = 2;
            });
            this.showNo = 0;
            this.breadcrumb = this.breadcrumb.slice(0,3);
          } else if (val === '2-1') {
            this.show = -1;
            this.$nextTick(function () {
              this.show = 2;
            });
            this.showNo = 1;
            this.breadcrumb = this.breadcrumb.slice(0,4);
          } else {
            this.show = 0;
            this.showNo = 0;
            this.breadcrumb = this.breadcrumb.slice(0,2);
            this.getList();
          }
        }
      },
    },

    data() {
      return {
        // table
        table: {},
        currentPage: 1,
        size: 10,

        header: [
          { prop: 'customerName', label: '客户名称',},
          { prop: 'projectName', label: '项目名称', width: 'unset'},
          { prop: 'mouldNo', label: '模具编号',},

          { prop: 'partName', label: '零件名称', width: 'unset'},
          { prop: 'leader', label: '项目负责人',},
          { prop: 'vehicleType', label: '车型名称',},
          { prop: 'mainEngineFactory', label: '主机厂',},
          { prop: 'supplier', label: '模具供应商',},
          { prop: 'createTime', label: '创建时间',},
        ],

        // search
        search: {},
        options: {

        },

        show: 0,

        // breadcrumb
        breadcrumb: [
          { id: 'mould', name: '试模验收认可清单管理', path: '/mould',},
          { id: 'mouldList', name: '模具列表', path: '/mould/mouldList', thing: 'showDefault'},
        ],

        // detailListEdit SHOW NO
        showNo: 0,
      }
    },
  }
</script>

<style scoped>

</style>
