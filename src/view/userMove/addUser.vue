<template>
  <div class="containerAddUserMove">
    <!--标题头-->
    <div class="header">
      <div class="ret" @click="retNewsPage">
        <img src="../../../static/img/move/ret.png" alt="">
        <span>返回</span>
      </div>
      <div class="title">{{ type }}账号</div>
    </div>

    <div class="formBox">
      <el-form :model="form" :rules="rules" :ref="form">
        <el-form-item label="账号" prop="userNum" :label-width="formLabelWidth">
          <el-input type="text" style="position: fixed;bottom: -9999px;"></el-input>
          <el-input type="text" v-model="form.userNum" auto-complete="true" placeholder="请输入账号"></el-input>
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
          <el-input v-model="form.areaNum" min="0" auto-complete="true" placeholder="请输入台区数"></el-input>
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
      <div slot="footer" class="dialog-footer">
        <el-button class="submit" type="primary" @click="submitData(form)" size="small">提 交</el-button>
      </div>
    </div>

  </div>
</template>

<script>
  export default {
    name: "addUser",
    data() {
      const blurText = async(rule, value, callback) => {
        const boolean = new RegExp('^[1-9]\d*|0$').test(value)
        if (!boolean) {
          callback(new Error('请输入非负整数'))
        } else {
          callback()
        }
      }
      return {
        regionId: '',
        page: '',
        type: '',
        title: '',
        detail: '',

        // 新建编辑
        addEditUrl: '',
        formLabelWidth: '100px',
        isStatusShow: true,
        businessArr: [],
        levelArr: [{
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
      }
    },
    activated() {

    },
    deactivated() {

    },
    created() {
      this.regionId = this.$route.query.regionId;
      this.type = this.$route.query.type;
      this.typeBtn = this.$route.query.typeBtn;
      this.page = this.$route.query.page;
      this.title = this.$route.query.title;
      this.detail = this.$route.query.detail;

      if(this.type == '新建') {
        this.addData();
      } else {
        this.editData(this.detail);
      }

      // 获取营业班
      this.getBusiness();
    },
    mounted() {

    },
    methods: {
      // 返回
      retNewsPage() {
        this.$router.push({
          path: '/userMove',
          query: {
            title: this.title,
            regionId: this.regionId,
            typeBtn: this.typeBtn,
            page: this.page
          }
        });
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
        this.addEditUrl = '/user/editUser';
        this.isStatusShow = true;
        this.form.userId = row.id;
        this.form.userNum = row.username;
        this.form.password = '';
        this.form.userName = row.name;
        this.form.business = row.teamId;
        this.form.areaNum = row.areaNum;
        this.form.userLevel = row.level + '';
        if(row.level == 1) {
          this.levelArr = [{
            value: '1',
            label: '一级'
          }, {
            value: '2',
            label: '二级'
          }, {
            value: '3',
            label: '三级'
          }];
        } else {
          this.levelArr = [{
            value: '2',
            label: '二级'
          }, {
            value: '3',
            label: '三级'
          }];
        }
        this.form.status = row.status + '';
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
                  if(this.type == '新建') {
                    _this.addData();
                  } else {
                    // 返回
                    _this.retNewsPage();
                  }
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


    },
  }
</script>

<style lang="scss" scoped>
  .containerAddUserMove {
    width: 100%;
    height: 100%;
    overflow-y: auto;
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

    }

    .formBox {
      width: 100%;
      height: calc(100% - 7rem);
      .el-form {
        width: 90%;
        margin-left: 2%;
        .el-form-item {
          margin-bottom: 2rem;
        }
        .el-form-item:nth-child(1) {
          padding-top: 2rem;
        }
      }
      .dialog-footer {
        text-align: center;
        .submit {
          background: #00706B;
        }
      }
    }
  }

</style>
