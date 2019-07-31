<template>
  <div class="mouldList pl20 pr20 bg_f5 posr ovwa h100">
    <div class="bg_f p20 border_box min_height">
      <div class="mouldLayout">
        <!--面包屑-->
        <breadcrumbList :breadcrumb-list="breadcrumb" @showDefault="showDefault"></breadcrumbList>

        <AddOrEdit v-if="show === 1" @ifChange="showDefault"></AddOrEdit>

        <detailAddOrEdit v-else-if="show === 2" @ifChange="showDefault" @detailListEditTable="addBreadcrumb" :showNo="showNo"></detailAddOrEdit>

        <Tool v-else-if="show === 3" @ifChange="showDefault"></Tool>

        <designList v-else-if="show === 4" @ifChange="showDefault" @designListTable="addBreadcrumb" :showNo="showNo"></designList>

        <el-row v-else-if="show === 0">
          <el-col>
            <div class="mouldLists">
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
                <el-button type="primary" size="mini" @click="addOrEdit()" v-if="$store.getters.userLoginVO.role !== 2">新增</el-button>

                <!-- 表格数据 -->
                <el-table
                  :data="table.content"
                  stripe
                  border
                  v-loading="loading"
                  element-loading-text="拼命加载中"
                  element-loading-spinner="el-icon-loading"
                  element-loading-background="rgba(0, 0, 0, 0.9)"
                  size="small"
                  style="width: 100%;margin-top:10px;"
                  header-cell-class-name="header_cell table_header_shadow"
                  tooltip-effect="light"
                >

                  <el-table-column fixed type="index" width="60" label="序号" align="center" :index="(index) => this.$indexS(index, currentPage, size)"></el-table-column>

                  <!-- circle -->
                  <column :header="header" @edits="addOrEdit" @changeStatus="changeStatus"></column>

                  <el-table-column fixed="right" label="设计评审清单" width="100" align="center">
                    <template slot-scope="scope">
                  <span>
                    <el-button class="underline f12" @click="edits(scope.row, 4)" type="text" align="center">编辑</el-button>
                  </span>
                    </template>
                  </el-table-column>

                  <el-table-column fixed="right" label="试模验收认可清单" width="120" align="center">
                    <template slot-scope="scope">
                  <span>
                    <el-button class="underline f12" @click="edits(scope.row, 2)" type="text" align="center">编辑</el-button>
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
    </div>
  </div>
</template>

<script>
/* eslint-disable */
  import { Message, MessageBox, Loading } from 'element-ui';
  /** 导入api.js */
  import { getMouldList, getUserListByRole, updateMould, } from '../../axios/api.js'
  import column from '../../components/tableColumn'
  import breadcrumbList from '../../components/breadcrumbList'
  import mouldAddOrEdit from '../../components/mouldAddOrEdit'
  import detailListEdit from '../../components/detailListEdit'
  import Tool from '../../components/detailListEdit_tool'
  import designList from '../../components/designList'

  export default {
    name: "mouldList",
    components: {
      'breadcrumbList': breadcrumbList,
      'AddOrEdit': mouldAddOrEdit,
      'detailAddOrEdit': detailListEdit,
      'column': column,
      'Tool': Tool,
      'designList': designList,
    },
    async created() {
      this.getList();
      let res1 = await getUserListByRole({role: 1});
      let res2 = await getUserListByRole({role: 2});
      if (res1.status === 1) {
        this.options.role1 = [...res1.msg];
      }
      if (res2.status === 1) {
        this.options.role2 = [...res2.msg];
      }

      this.header.forEach(item => {
        if (item.selectOrSpan) {
          if (item.key === 1) {
            let role1 = this.options.role1;
            item.selectOrSpan = role1.map(r => {r.label = r.name; r.id = r.userId; return r;});
          } else if (item.key === 2) {
            let role2 = this.options.role2;
            item.selectOrSpan = role2.map(r => {r.label = r.name; r.id = r.userId; return r;});
            // console.log(item.selectOrSpan)
          }
        }
      })
    },

    methods: {
      // get dataList of table
      async getList() {
        this.loading = true;
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
          this.loading = false;
        }
      },

      // search
      Search() {
        this.currentPage = 1;
        this.getList();
      },

      handleCurrentChange(val) {
        this.loading = true;
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

      // tap edit button
      addOrEdit(obj) {
        // console.log(obj);
        if (obj) {
          this.$store.dispatch('mould_list', obj.row);
          if (obj.key === 1) {
            this.show = 1;
            this.breadcrumb.push({id: 'edit', name: '编辑项目'});
          } else if (obj.key === 2) {
            this.show = 3;
            this.breadcrumb.push({id: 'editTool', name: 'TOOL INFORMATION'});
          }
        } else {
          this.show = 1;
          this.$store.dispatch('mould_list', {});
          this.breadcrumb.push({id: 'add', name: '新增项目'});
        }
      },


      // tap '试模验收清单'
      edits(row, index) {
        this.show = index;
        this.$store.dispatch('mould_list', row);
        if (index === 2) {
          this.breadcrumb.push({id: 'detailListEdit', name: '试模验收认可清单', thing: 2});
        } else if (index === 4) {
          this.breadcrumb.push({id: 'designList', name: '设计评审清单', thing: 4});
        }
      },

      // change the value of select
      async changeStatus(obj, prop) {
        let res = await updateMould(obj);
        if (res.status === 1) {
          Message({showClose: true, type: 'success', message: '更新成功！'});
          this.getList();
        }
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
          } else if (val === 4) {
            this.show = -1;
            this.$nextTick(function () {
              this.show = 4;
            });
            this.showNo = 0;
            this.breadcrumb = this.breadcrumb.slice(0,3);
          } else if (val === '4-1') {
            this.show = -1;
            this.$nextTick(function () {
              this.show = 4;
              this.showNo = 1;
            });

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

        // search
        search: {},
        options: {
          role1: [],
          role2: [],
        },

        header: [
          { prop: 'customerName', label: '客户名称',},
          { prop: 'projectName', label: '项目名称', width: 'unset'},
          { prop: 'mouldNo', label: '模具编号',},

          { prop: 'partName', label: '零件名称', width: 'unset'},
          { prop: 'status', label: '状态', select: [ { id: 0, label: '已暂停'}, { id: 1, label: '进行中'}, { id: -1, label: '已取消'}, { id: 2, label: '已走模'},], disabled: true, width: 120,},
          { prop: 'projectEngineer', label: '项目工程师', selectOrSpan: [], key: 1, disabled: true, width: 120, childProp: 'userId'},
          { prop: 'designEngineer', label: '设计工程师', selectOrSpan: [], key: 1, disabled: true, width: 120, childProp: 'userId'},
          { prop: 'qualityManager', label: '质量经理', selectOrSpan: [], key: 1, disabled: true, width: 120, childProp: 'userId'},
          { prop: 'yfpoTc', label: 'YFPO TC', selectOrSpan: [], key: 2, disabled: true, width: 120, childProp: 'userId'},
          { prop: 'yfpoFactory', label: 'YFPO 工厂', selectOrSpan: [], key: 2, disabled: true, width: 120, childProp: 'userId'},

          { prop: 'createTime', label: '创建时间',},
          { prop: 'projectDetail', label: '项目详情', button: {value: '编辑', key: 1, }},
          { prop: 'mouldDetail', label: '模具基本信息', button: {value: '编辑', key: 2, }, width: 120,},
        ],


        show: 0,

        // breadcrumb
        breadcrumb: [
          { id: 'mould', name: 'YFPO', path: '/mould',},
          { id: 'mouldList', name: '模具列表', path: '/mould/mouldList', thing: 'showDefault'},
        ],

        // detailListEdit SHOW NO
        showNo: 0,

        loading: true,
      }
    },
  }
</script>

<style scoped>

</style>
