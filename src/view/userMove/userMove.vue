<template>
  <div class="containerUserMove">
    <!--标题头-->
    <div class="header">
      <div class="ret" @click="retPage">
        <img src="../../../static/img/move/ret.png" alt="">
        <span>返回</span>
      </div>
      <div class="title">账号权限</div>
      <div class="add" @click="addPage">
        <img src="../../../static/img/move/add.png" alt="">
      </div>
    </div>

    <!--账号列表-->
    <div class="module">
      <!--搜素-->
      <div class="searchUser">
        <el-input v-model="userList.searchName" clearable placeholder="请输入账号、账号名称、营业班" clearable @clear="clearSearch"></el-input>
        <div class="railSearch" @click="getUserList('search')">
          <img src="../../../static/img/move/railSearch.png" alt="">
        </div>
      </div>

      <!--账号列表区-->
      <div class="userListArea">
        <el-table :data="tableData" v-loading="tableDataLoading" v-el-table-infinite-scroll="load"  height="calc(100% - 50px)" border style="width: calc(100% - 40px);margin-left: 20px;">
          <el-table-column prop="username" label="账号"  width="120" align="center" sortable></el-table-column>
          <el-table-column prop="name" label="账号名称"  width="120" align="center" sortable></el-table-column>
          <!--<el-table-column prop="division" label="归属区域" align="center" sortable></el-table-column>-->
          <el-table-column prop="teamName" label="营业班"  width="180" align="center" sortable></el-table-column>
          <el-table-column prop="areaNum" label="台区数"  width="100" align="center" sortable></el-table-column>
          <el-table-column prop="level" label="账号级别"  width="120" align="center" sortable>
            <template slot-scope="scope">
              　　　　<span v-if="scope.row.level == 0">特级</span>
              　　　　<span v-if="scope.row.level == 1">一级</span>
              <span v-if="scope.row.level == 2">二级</span>
              <span v-if="scope.row.level == 3">三级</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态"  width="80" align="center" sortable>
            <template slot-scope="scope">
              　　　　<span v-if="scope.row.status == 0">正常</span>
              　　　　<span v-if="scope.row.status == 1">锁定</span>
            </template>
          </el-table-column>
          <el-table-column align="center" width="200" label="操作">
            <template slot-scope="scope">
              <el-button @click="editData(scope.row)" type="text" size="small" style="color: #526743;">编辑</el-button>
              <el-button @click="delData(scope.row)" type="text" size="small" style="color: #526743;">锁定</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!--提示框-删除-->
    <div class="model" v-if="showModel">
      <div class="modelMain">
        <div class="modelTitle">您确认锁定吗?</div>
        <div class="modelBtn">
          <button @click="closeDel">取消</button>
          <button @click="deterDel">确定</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import elTableInfiniteScroll from 'el-table-infinite-scroll';
  export default {
    name: "userMove",
    data() {
      return {
        // 区域
        title: '',
        regionId: '',
        typeBtn: null,
        page: '',

        // 账号列表
        tableDataLoading: false,
        userList: {
          searchName: '',
          limit: this.GLOBAL.limit,
          page: this.GLOBAL.page,
        },
        tableData: [],
        total: 0,

        // 删除
        showModel: false,
        delRow: '',
      }
    },
    activated() {

    },
    deactivated() {

    },
    directives: {
      'el-table-infinite-scroll': elTableInfiniteScroll
    },
    created() {
      // 区域
      this.title = this.$route.query.title;
      this.regionId = this.$route.query.regionId;
      this.typeBtn = this.$route.query.typeBtn;
      this.page = this.$route.query.page;
      // 获取账号列表
      this.getUserList();
    },
    mounted() {

    },
    methods: {
      // 返回
      retPage() {
        this.$router.push({
          path: this.page,
          query: {
            title: this.title,
            regionId: this.regionId,
            typeBtn: this.typeBtn,
          }
        });
      },

      // 无线滚动
      load() {
        if(Math.ceil(this.total/this.userList.limit) < this.userList.page) {
          return
        }
        this.userList.page += 1;
        // 获取账号列表
        let params = {
          showLoading: false,
          Authorization: localStorage.token,
          page: this.userList.page,
          search: this.userList.searchName,
          size: this.userList.limit
        };
        let _this = this;
        this.http.post('/user/listUser', params)
          .then(res => {
            if (res.code === 0) {
              for (let i = 0; i < res.data.list.length; i++) {
                _this.tableData.push(res.data.list[i]);
              }
              _this.total = res.data.total;
            }
          })
          .catch(err => {})
      },

      // 清空
      clearSearch() {
        this.userList.page = 1;
        this.getUserList();
      },

      // 获取账号列表
      getUserList(type) {
        this.tableDataLoading = true;
        let params = {
          showLoading: false,
          Authorization: localStorage.token,
          page: 1,
          search: this.userList.searchName,
          size: this.userList.limit
        };
        let _this = this;
        this.http.post('/user/listUser', params)
          .then(res => {
            this.tableDataLoading = false;
            if (res.code === 0) {
              _this.tableData = res.data.list;
              _this.total = res.data.total;
            } else {
              _this.tableData = [];
              _this.total = 0;
            }
            if(type == 'search') {
              this.$message({
                type: 'success',
                message: '搜索成功',
                center: true,
              })
            }
          })
          .catch(err => {
            this.tableDataLoading = false;
            _this.tableData = [];
            _this.total = 0;
          })
      },

      // 添加
      addPage() {
        this.$router.push({
          path: '/addUser',
          query: {
            title: this.title,
            regionId: this.regionId,
            typeBtn: this.typeBtn,
            type: '新建',
            page: this.page
          }
        });
      },

      // 编辑
      editData(row) {
        this.$router.push({
          path: '/addUser',
          query: {
            title: this.title,
            regionId: this.regionId,
            typeBtn: this.typeBtn,
            type: '编辑',
            detail: row,
            page: this.page
          }
        });
      },

      // 删除
      delData(row) {
        this.delRow = row;
        if(this.delRow.status == 1 ) {
          this.$message({
            type: 'info',
            message: '账号已经锁定',
            center: true
          });
          return
        }
        this.showModel = true;
      },

      // 关闭
      closeDel() {
        this.showModel = false;
      },

      // 确定
      deterDel() {
        let params = {
          Authorization: localStorage.token,
          userId: this.delRow.id
        };
        let _this = this;
        this.http.post('/user/delUsername', params)
          .then(res => {
            if (res.code == 0) {
              // 关闭
              _this.closeDel();
              this.$message({
                message: '操作成功',
                type: 'success',
                center: true,
              });
              // 获取账号列表
              _this.getUserList();
            }
          })
          .catch(err => {
            this.$message.error({
              message: '操作失败',
              center: true
            });
          })
      },

    },
  }
</script>

<style lang="scss" scoped>
  .containerUserMove {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
    background-image: url("../../../static/img/move/midBg.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;

    /*标题头*/
    .header {
      width: 100%;
      height: 6rem;
      line-height: 6rem;
      text-align: center;
      background: #00706B;
      color: #FFFFFF;
      font-size: 1.8rem;
      position: relative;
      .ret {
        height: 6rem;
        display: flex;
        align-items: center;
        position: absolute;
        left: 1rem;
        top: 0;
        z-index: 100;
        img {
          width: 1.6rem;
          height: 1.6rem;
        }
        span {
          font-size: 1.6rem;
          margin-left: 0.4rem;
        }
      }
      .title {
        width: 100%;
        height: 6rem;
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        left: 0;
        top: 0;
      }
      .add {
        height: 6rem;
        display: flex;
        align-items: center;
        position: absolute;
        right: 1rem;
        top: 0;
        z-index: 100;
        img {
          width: 2.2rem;
          height: 2.2rem;
        }
      }
    }

    /*地理围栏*/
    .module {
      width: calc(100% - 0rem);
      height: calc(100% - 7rem);
      margin: 0rem;
      border-radius: 1rem;
      background: #FFFFFF;
      position: relative;
      /*搜索*/
      .searchUser {
        width: calc(100% - 2rem);
        overflow: hidden;
        margin: 1rem;
        position: relative;
        .el-input {
          width: calc(100% - 40px);
          float: left;
          input {
            border: 1px solid #b9c9aa;
          }
        }
        .railSearch {
          width: 40px;
          height: 40px;
          background: #cddabf;
          display: flex;
          justify-content: center;
          align-items: center;
          position: absolute;
          right: 0rem;
          top: 0rem;
        }
      }

      .userListArea {
        width: 100%;
        height: 100%;
        overflow: auto;
      }
    }

    /*提示框-详情-删除*/
    .model {
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.6);
      z-index: 999;
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      .modelMain {
        width: 80%;
        height: 16rem;
        background: #fff;
        border-radius: 1rem;
        .modelTitle {
          width: 100%;
          height: 10rem;
          font-size: 2rem;
          font-weight: 400;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .modelBtn {
          width: 100%;
          display: flex;
          justify-content: center;
          button {
            width: 7.2rem;
            height: 3.4rem;
            border-radius: 0.4rem;
            border: none;
            font-size: 1.6rem;
          }
          button:nth-child(1) {
            background: #eee;
            color: rgba(0, 0, 0, 0.73);
          }
          button:nth-child(2) {
            background: #00706B;
            color: #fff;
            margin-left: 2rem;
          }
        }
      }

    }

  }

</style>
