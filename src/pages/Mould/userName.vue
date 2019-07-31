<template>
  <div class="userName pl20 pr20 bg_f5 posr ovwa h100">
    <div class="bg_f p20 border_box min_height">
      <div class="mouldLayout">
        <!--面包屑-->
        <breadcrumbList :breadcrumb-list="breadcrumb" @showDefault="showDefault"></breadcrumbList>

        <AddOrEdit v-if="show" @ifChange="showDefault"></AddOrEdit>

        <el-row v-else>
          <el-col>
            <div class="userNames">
              <!--  search -->
              <div class="section-search mb20 mt20">
                <el-row class="boxShadow_head p20">
                  <div class="fl mr20 mb20">
                    <span class="c6">账户名称：</span>
                    <el-input v-model="search.accountName" size="mini" clearable style="width:calc(100% - 100px);"></el-input>
                  </div>

                  <div class="fl mr20 mb20">
                    <span class="c6">姓名：</span>
                    <el-input v-model="search.name" size="mini" clearable style="width:calc(100% - 100px);"></el-input>
                  </div>

                  <el-button type="primary" size="mini" icon="el-icon-search" class="fl" @click="Search()"></el-button>
                </el-row>
              </div>

              <!-- content -->
              <div class="mt20">
                <!-- 添加 -->
                <el-button type="primary" size="mini" @click="addOrEdit()">新增</el-button>

                <!-- 表格数据 -->
                <el-table
                  :data="table.content"
                  stripe
                  border
                  size="small"
                  style="width: 100%;margin-top:10px;"
                  header-cell-class-name="header_cell table_header_shadow"
                  tooltip-effect="light">

                  <el-table-column fixed type="index" width="60" label="序号" align="center"></el-table-column>

                  <!-- circle -->
                  <column :header="header"></column>

                  <el-table-column fixed="right" label="操作" width="180" align="center">
                    <template slot-scope="scope">
                  <span v-if="scope.row.userId !== 1">
                    <el-button class="underline f12" @click="addOrEdit(scope.row)" type="text" align="center">编辑</el-button>
                    <el-button class="underline f12" @click="resets(scope.row)" type="text" align="center">重置密码</el-button>
                    <el-button class="underline f12" @click="deletes(scope.row)" type="text" align="center">删除</el-button>
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
  import { getUserList, deleteUser, resetPwd, } from '../../axios/api.js'
  import column from '../../components/tableColumn'
  import breadcrumbList from '../../components/breadcrumbList'
  import UserNameAddOrEdit from '../../components/UserNameAddOrEdit'

  export default {
    name: "userName",
    components: {
      'breadcrumbList': breadcrumbList,
      'AddOrEdit': UserNameAddOrEdit,
      'column': column,
    },
    created() {
      console.log(this.$route);
      this.getList();
    },

    methods: {
      // get dataList of table
      async getList() {
        let params = {
          page: this.currentPage,
          size: this.size,
        };
        if(this.search.accountName) {
          params.accountName = this.search.accountName;
        }
        if(this.search.name) {
          params.name = this.search.name;
        }
        let res = await getUserList(params);
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

      deletes(row) {
        this.$confirm(`此操作将删除"${row.name}", 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let res = await deleteUser({userId: row.userId});
          if(res.status === 1) {
            this.getList();
            Message({showClose: true, type: 'success', message: '删除成功！'});
          }
        }).catch(() => {
          this.$message({type: 'info', message: '已取消删除'});
        });
      },

      resets(row) {
        this.$confirm(`此操作将重置用户"${row.name}"密码为"Ybsx#123", 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let res = await resetPwd({userId: row.userId});
          if(res.status === 1) {
            this.getList();
            Message({showClose: true, type: 'success', message: '重置成功！'});
          }
        }).catch(() => {
          this.$message({type: 'info', message: '已取消重置'});
        });
      },

      addOrEdit(row) {
        this.show = !this.show;
        if (row) {
          this.$store.dispatch('auth_userName', row);
          this.breadcrumb.push({id: 'edit', name: '编辑用户'});
        } else {
          this.$store.dispatch('auth_userName', {});
          this.breadcrumb.push({id: 'add', name: '新增用户'});
        }
      },

      // show default module
      showDefault(val) {
        if (val) {
          this.show = false;
          this.breadcrumb = this.breadcrumb.slice(0,2);
          this.getList();
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

        header: [
          { prop: 'accountName', label: '账户名称',},
          { prop: 'role', label: '用户角色', change: ['', '内部用户', '客户']},
          { prop: 'status', label: '账户状态', change: ['关闭', '启用']},
          { prop: 'name', label: '姓名', eachWidth: 40,},
          { prop: 'companyName', label: '公司名称', eachWidth: 50,},
          { prop: 'position', label: '职位', eachWidth: 50,},
          { prop: 'createTime', label: '创建时间',},
          { prop: 'mobile', label: '手机号', eachWidth: 50,},
          { prop: 'mail', label: '邮箱', width: 'unset', minWidth: '200px'},
        ],

        show: false,

        // breadcrumb
        breadcrumb: [
          { id: 'mould', name: 'YFPO', path: '/mould',},
          { id: 'userName', name: '用户管理', path: '/mould/userName', thing: 'showDefault'},
        ],
      }
    },
  }
</script>

<style lang="scss" scoped>
  .el-form-item {
    margin-bottom: 20px !important;
  }
</style>

