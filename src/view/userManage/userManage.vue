<template>
  <div class="containerUserManage">
    <!--返回上一页-->
    <div class="backHome">
      <img src="../../../static/img/fanhui.png" alt="" @click="back">
    </div>

    <!--标题区-->
    <div class="header">
      <div class="title">账号权限</div>
      <div class="rightBox">
        <div class="date">{{ time }}</div>
        <div>{{ userInfoId }}</div>
      </div>

    </div>

    <!--主体区-->
    <div class="main">
      <!--新建搜索区-->
      <div class="addSearchArea">
        <div class="addArea" @click="addData">
          <img src="../../../static/img/userManage/add.png" alt="">
          <span>添加账号</span>
        </div>
        <div class="searchArea">
          <div class="searchLabel">搜索内容</div>
          <div class="searchName">
            <el-input placeholder="请输入账号、账号名称、营业班" v-model="userList.searchName" clearable @clear="clearSearch"></el-input>
            <p @click="getUserList"><img src="../../../static/img/userManage/search.png" alt=""></p>
          </div>
        </div>
      </div>

      <!--账号列表区-->
      <div class="userListArea">
        <el-table :data="tableData" v-loading="tableDataLoading" height="calc(100% - 50px)" border style="width: calc(100% - 20px);margin-left: 10px;">
          <el-table-column prop="username" label="账号" align="center" sortable></el-table-column>
          <el-table-column prop="name" label="账号名称" align="center" sortable></el-table-column>
          <!--<el-table-column prop="division" label="归属区域" align="center" sortable></el-table-column>-->
          <el-table-column prop="teamName" label="营业班" align="center" sortable></el-table-column>
          <el-table-column prop="areaNum" label="台区数" align="center" sortable></el-table-column>
          <el-table-column prop="level" label="账号级别" align="center" sortable>
            <template slot-scope="scope">
      　　　　<span v-if="scope.row.level == 0">特级</span>
      　　　　<span v-if="scope.row.level == 1">一级</span>
              <span v-if="scope.row.level == 2">二级</span>
              <span v-if="scope.row.level == 3">三级</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" align="center" sortable>
            <template slot-scope="scope">
      　　　　<span v-if="scope.row.status == 0">正常</span>
      　　　　<span v-if="scope.row.status == 1">锁定</span>
            </template>
          </el-table-column>
          <el-table-column align="center" width="240" label="操作">
            <template slot-scope="scope">
              <el-button @click="showData(scope.row)" type="text" size="small" style="color: #526743;">查看</el-button>
              <el-button @click="editData(scope.row)" type="text" size="small" style="color: #526743;">编辑</el-button>
              <el-button @click="delData(scope.row)" type="text" size="small" style="color: #526743;">锁定</el-button>
            </template>
          </el-table-column>
        </el-table>
        <paging class="pagingChild" ref="pageChildData" :total="total" @pageFinish="pageGroup" style="margin-left:40px;float: left;margin-top: 10px;"></paging>
      </div>
    </div>

    <!-- 新建编辑 -->
    <el-dialog :title="addEditTitle" :visible.sync="dialogFormVisible" width="35%" :close-on-click-modal=false
               :before-close="closeWindow">
      <el-form :model="form" :rules="rules" :ref="form" style="height: 380px; width: 90%;">
        <el-form-item label="账号" prop="userNum" :label-width="formLabelWidth">
          <el-input style="position: fixed;bottom: -9999px;"></el-input>
          <el-input v-model="form.userNum" auto-complete="true" placeholder="请输入账号"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" :label-width="formLabelWidth">
          <el-input type="password" style="position: fixed;bottom: -9999px;"></el-input>
          <el-input type="password" v-model="form.password" auto-complete="true" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="账号名称" prop="userName" :label-width="formLabelWidth">
          <el-input v-model="form.userName" auto-complete="true" placeholder="请输入账号名称"></el-input>
        </el-form-item>
        <el-form-item label="营业班" prop="business" :label-width="formLabelWidth">
          <el-select v-model="form.business">
            <el-option v-for="item in businessArr" :key="item.id" :label="item.teamName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="台区数" prop="areaNum" :label-width="formLabelWidth">
          <el-input v-model="form.areaNum" auto-complete="true" placeholder="请输入台区数"></el-input>
        </el-form-item>
        <el-form-item label="账号级别" prop="userLevel" :label-width="formLabelWidth">
          <el-select v-model="form.userLevel">
            <el-option v-for="item in levelArr" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <!--<el-form-item label="状态" prop="" :label-width="formLabelWidth">-->
          <!--<el-select v-model="form.terModel">-->
            <!--<el-option v-for="item in terModelArr" :key="item.id" :label="item.name" :value="item.id">-->
            <!--</el-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
        <el-form-item v-show="isStatusShow" label="状态" prop="status" :label-width="formLabelWidth">
          <el-radio v-model="form.status" label="0">正常</el-radio>
          <el-radio v-model="form.status" label="1">锁定</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center;">
        <el-button class="submit" type="primary" @click="submitData(form)" size="small">提 交</el-button>
        <el-button class="close" @click="closeWindow" size="small">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="查看" :visible.sync="dialogShowVisible" width="30%" :close-on-click-modal=false
               :before-close="closeWindow">
      <ul>
        <li>
          <div class="showTitle">账号:</div>
          <div class="showCon">{{ showDataInfo.username }}</div>
        </li>
        <li>
          <div class="showTitle">账号名称:</div>
          <div class="showCon">{{ showDataInfo.name }}</div>
        </li>
        <li>
          <div class="showTitle">营业班:</div>
          <div class="showCon">{{ showDataInfo.teamName }}</div>
        </li>
        <li>
          <div class="showTitle">台区数:</div>
          <div class="showCon">{{ showDataInfo.areaNum }}</div>
        </li>
        <li>
          <div class="showTitle">账号级别:</div>
          <div class="showCon"  v-if="showDataInfo.level == 0">特级</div>
          <div class="showCon"  v-if="showDataInfo.level == 1">一级</div>
          <div class="showCon"  v-if="showDataInfo.level == 2">二级</div>
          <div class="showCon"  v-if="showDataInfo.level == 3">三级</div>
        </li>
        <li>
          <div class="showTitle">状态:</div>
          <div class="showCon"  v-if="showDataInfo.status == 0">正常</div>
          <div class="showCon"  v-if="showDataInfo.status == 1">锁定</div>
        </li>
      </ul>
      <div slot="footer" class="dialog-footer" style="text-align: center;">
        <el-button class="close" @click="closeWindow" size="small">关 闭</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import {Base64} from 'js-base64';
  import Paging from '../../components/paging'
  export default {
    name: "userManage",
    components: {
      Paging,
    },
    data() {
      const blurText = async(rule, value, callback) => {
        const boolean = new RegExp('^[1-9]d*|0$').test(value)
        if (!boolean) {
          callback(new Error('请输入非负整数'))
        } else {
          callback()
        }
      }
      return {
        // 上一页
        titleText: '',
        regionId: '',
        typeBtn: '',
        page: '',

        userInfoId: localStorage.userId2,
        // 时间-日期
        time: '',
        // 账号列表
        tableDataLoading: false,
        userList: {
          searchName: '',
          limit: this.GLOBAL.limit,
          page: this.GLOBAL.page,
        },
        tableData: [],
        total: 0,

        // 新建/编辑表单
        password: null,
        addEditTitle: '新建',
        addEditUrl: '',
        dialogFormVisible: false,
        formLabelWidth: '120px',
        isStatusShow: true,
        businessArr: [],
        levelArr: [{
          value: '0',
          label: '特级'
        }, {
          value: '1',
          label: '一级'
        }, {
          value: '2',
          label: '二级'
        }, {
          value: '3',
          label: '三级'
        }],
        form: {
          showLoading: true,
          userId: '',
          userNum: '',
          password: '',
          userName: '',
          business: '',
          areaNum: '',
          userLevel: '',
          status: '0',
        },
        // 校验规则
        rules: {
          userNum: [{
            required: true,
            message: '账号不能为空',
            trigger: 'blur'
          }],
          password: [{
            required: true,
            message: '密码不能为空',
            trigger: 'blur'
          }],
          userName: [{
            required: true,
            message: '账号名称不能为空',
            trigger: 'blur'
          }],
          business: [{
            required: true,
            message: '营业班不能为空',
            trigger: 'blur'
          }],
          areaNum: [{
            validator: blurText,
            trigger: 'blur'
          }],
          userLevel: [{
            required: true,
            message: '账号级别不能为空',
            trigger: 'blur'
          }],
        },

        // 查看
        dialogShowVisible: false,
        showDataInfo: Object,
      }
    },
    activated() {

    },
    deactivated() {

    },
    created() {
      this.titleText = this.$route.query.area;
      this.regionId = this.$route.query.regionId;
      this.typeBtn = this.$route.query.type;
      this.page = this.$route.query.page;
      // 获取账号列表
      this.getUserList();
      // 获取营业班
      this.getBusiness();
    },
    mounted() {
      let _this = this;
      let timer = setInterval(() => {
        let date = new Date(); // 修改数据date
        let dateYear = date.getFullYear();
        let dateMonth = date.getMonth() + 1;
        let dateDate = date.getDate();
        let dateHours = date.getHours();
        let dateMinutes = date.getMinutes();
        if (dateMonth < 10) {
          dateMonth = "0" + dateMonth;
        }
        if (dateDate < 10) {
          dateDate = "0" + dateDate;
        }
        if (dateHours < 10) {
          dateHours = "0" + dateHours;
        }
        if (dateMinutes < 10) {
          dateMinutes = "0" + dateMinutes;
        }
        _this.time = dateYear + "-" + dateMonth + "-" + dateDate + " " + dateHours + ":" + dateMinutes;
      }, 1000)
    },
    methods: {
      //返回上一界面
      back() {
        this.$router.push({
          path: this.page,
          query: {
            area: this.titleText,
            regionId: this.regionId,
            type: this.typeBtn
          }
        });
      },

      // 分页组件
      pageGroup: function (data) {
        this.userList.limit = data.pagesize;
        this.userList.page = data.currentPage;
        // 获取账号列表
        this.getUserList();
      },

      // 清空
      clearSearch() {
        this.userList.page = 1;
        this.getUserList();
      },

      // 获取账号列表
      getUserList() {
        this.tableDataLoading = true;
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
            this.tableDataLoading = false;
            if (res.code === 0) {
              _this.tableData = res.data.list;
              _this.total = res.data.total;
            } else {
              _this.tableData = [];
              _this.total = 0;
            }
          })
          .catch(err => {
            this.tableDataLoading = false;
            _this.tableData = [];
            _this.total = 0;
          })
      },

      // 获取营业班
      getBusiness() {
        let params = {
          showLoading: false,
          Authorization: localStorage.token,
        };
        let _this = this;
        this.http.post('/user/listTeam', params)
          .then(res => {
            if (res.code === 0) {
              _this.businessArr = res.data;
            } else {
              _this.businessArr = [];
            }
          })
          .catch(err => {
            _this.businessArr = [];
          })
      },

      // 添加数据
      addData() {
        // 获取级别列表
        this.getLevelList();
        this.form.areaNum = null;
        this.rules.password = [{
          required: true,
          message: '密码不能为空',
          trigger: 'blur'
        }];
        this.addEditTitle = '新建';
        this.addEditUrl = '/user/addUser';
        this.levelArr = [{
          value: '2',
          label: '二级'
        }, {
          value: '3',
          label: '三级'
        }];
        this.form.userNum = '';
        this.form.password = '';
        this.form.userName = '';
        this.form.business = '';
        this.form.areaNum = '';
        this.form.userLevel = '';
        this.isStatusShow = false;
        this.dialogFormVisible = true;
      },

      // 获取级别列表
      getLevelList() {
        let _this = this;
        let params = {
          Authorization: localStorage.token,
        };
        this.http.post('/user/listLevel', params)
          .then(res => {
            if (res.code == 0) {
              let data = res.data;
              if(data.length == 2) {
                _this.levelArr = [{
                  value: '2',
                  label: '二级'
                }, {
                  value: '3',
                  label: '三级'
                }];
              } else if (data.length == 1) {
                _this.levelArr = [{
                  value: '3',
                  label: '三级'
                }];

              }
            }
          })
          .catch(err => {
            this.$message.error({
              message: '操作失败',
              center: true
            });
          })
      },

      // 编辑数据
      editData(row) {
        this.rules.password = [];
        this.addEditTitle = '编辑';
        this.addEditUrl = '/user/editUser';
        this.isStatusShow = true;
        this.dialogFormVisible = true;
        this.form.userId = row.id;
        this.form.userNum = row.username;
        this.form.password = '';
        this.form.userName = row.name;
        this.form.business = row.teamId;
        this.form.areaNum = row.areaNum;
        this.form.userLevel = row.level + '';
        if(row.level == 1) {
          this.levelArr = [{
            value: '2',
            label: '二级'
          }, {
            value: '3',
            label: '三级'
          }];
        } else if (row.level == 2) {
          this.levelArr = [{
            value: '2',
            label: '二级'
          }, {
            value: '3',
            label: '三级'
          }];
        } else if (row.level == 3) {
          this.levelArr = [{
            value: '3',
            label: '三级'
          }];

        }
        this.form.status = row.status + '';
      },

      // 删除数据
      delData(row) {
        let params = {
          Authorization: localStorage.token,
          userId:row.id,
        };
        if(row.status == 1 ) {
          this.$message({
            type: 'info',
            message: '账号已经锁定',
            center: true
          });
          return
        }
        let _this = this;
        this.$confirm('您确认锁定吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _this.http.post('/user/delUsername', params)
            .then(res => {
              if (res.code == 0) {
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
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作',
            center: true
          });
        });
      },

      // 查看数据
      showData(row) {
        this.dialogShowVisible = true;
        this.showDataInfo  = row;
      },


      // 提交
      submitData: function (form) {
        this.$refs[form].validate(valid => {
          if (valid) {
            let params = {
              showLoading: true,
              Authorization: localStorage.token,
              userId: this.form.userId,
              username: this.form.userNum,
              password:  Base64.encode(this.form.password),
              name: this.form.userName,
              teamId: this.form.business,
              areaNum: this.form.areaNum,
              level: this.form.userLevel,
              status: this.form.status,
            };
            let _this = this;
            this.http.post(this.addEditUrl, params)
              .then(res => {
                let code = res.code;
                let data = res.data;
                let msg = res.msg;
                if (code == 0) {
                  this.$message({
                    message: '操作成功',
                    type: 'success',
                    center: true
                  });
                  _this.closeWindow();
                  // 获取账号列表
                  _this.getUserList();
                } else {
                  this.$message({
                    message: msg,
                    type: 'warning',
                    center: true
                  });
                }
              })
              .catch((err) => {
                this.$message.error({
                  message: err.msg,
                  center: true
                });
              })
          } else {
            return false
          }
        })
      },

      /*表单关闭时*/
      closeWindow() {
        this.dialogFormVisible = false;
        this.dialogShowVisible = false,
        this.$refs[this.form].clearValidate(); //清除验证
        this.$refs[this.form].resetFields();  //清空表单
      },

    },
  }
</script>

<style lang="scss" scoped>
  .containerUserManage {
    background: #f2f4e7;
    width: 100%;
    height: 100%;

    /*返回上一页*/
    .backHome {
      position: absolute;
      left: 15px;
      color: #536844;
      top: 5px;
      z-index: 10;
      cursor: pointer;
      img {
        font-size: 16px;
        font-weight: 800;
        cursor: pointer
      }
    }

    /*标题区*/
    .header {
      width: 100%;
      height: 50px;
      line-height: 50px;
      position: relative;
      font-size: 20px;

      .title {
        width: 100%;
        text-align: center;
        color: #508799;
        font-weight: bold;
      }

      .rightBox {
        height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        top: 0;
        right: 20px;
        overflow: hidden;
        font-size: 18px;
        .date {
          color: #6F7696;
          font-family: dig;
          margin-right: 10px;
        }
      }
    }

    /*主体区*/
    .main {
      width: calc(100% - 40px);
      height: calc(100% - 50px);
      margin: 0px 20px 0px 20px;
      background: url("../../../static/img/bg.png") no-repeat;
      background-size: 100% 100%;

      /*新建搜索区*/
      .addSearchArea {
        width: 100%;
        height: 40px;
        padding: 20px 0;
        background: #E1E7D4;
        overflow: hidden;

        .addArea {
          float: left;
          width: 140px;
          height: 40px;
          background: #D2DCC5;
          margin-left: 10px;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          img {
            width: 16px;
            height: 16px;
          }
          span {
            display: inline-block;
            width: 80px;
            margin-left: 10px;
            font-size: 16px;
            color: #607351;
          }
        }

        .searchArea {
          float: right;
          width: 420px;
          height: 40px;
          margin-right: 10px;
          .searchLabel {
            float: left;
            width: 100px;
            height: 40px;
            text-align: center;
            line-height: 40px;
            background: #D2DCC5;
          }
          .searchName {
            float: left;
            width: 320px;
            height: 40px;
            position: relative;
            p {
              display: inline-block;
              width: 60px;
              height: 40px;
              display: flex;
              justify-content: center;
              align-items: center;
              background: #CDDABF;
              position: absolute;
              right: 0;
              top: 0;
              cursor: pointer;
              img {
                width: 16px;
                height: 16px;
              }
            }
          }
        }
      }

      /*账号列表区*/
      .userListArea {
        width: 100%;
        height: calc(100% - 140px);

      }
    }


  }
</style>
