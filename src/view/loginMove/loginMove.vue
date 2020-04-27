<template>
  <!--登录界面-->
  <div class="contain">
    <div class="loginWindow">
      <div class="login_fields">
        <div class="login_fields__user">
          <div class="icon">
            <img alt="" src="../../../static/img/move/user.png">
          </div>
          <input v-model="account" @input="verUser" id="username" name="login" maxlength="16" type="text" autocomplete="off"
                 placeholder="请输入用户名">
        </div>
        <div class="login_fields__password">
          <div class="icon">
            <img alt="" src="../../../static/img/move/pwd.png">
          </div>
          <input v-model="pwd" id="password" name="pwd" maxlength="16" type="password" autocomplete="off"
                 placeholder="请输入用户密码">
        </div>

        <!--<div class="login_fields__type" v-show="account == 'wuhan'">-->
        <div class="login_fields__type" v-show="showType">
          <div class="icon">
            <img alt="" src="../../../static/img/work/loginType.png">
          </div>
          <div class="typeSelect">
            <div class="typeSelectBody">
              <span>{{ type }}</span>
              <img @click="showSelect = !showSelect;" v-show="showSelect == false" alt="" src="../../../static/img/work/down.png">
              <img @click="showSelect = !showSelect;" v-show="showSelect == true" alt="" src="../../../static/img/work/down.png">
            </div>
            <div class="typeSelectList" v-show="showSelect">
              <ul>
                <li v-for="(item,index) in options" :key="index" @click="type = item;showSelect = false;" :style="type == item?'color: #00706B;':''">{{ item }}</li>
              </ul>
            </div>
          </div>
        </div>
        <el-button class="login_btn" type="primary" @click="login">登&nbsp;录</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    Base64
  } from 'js-base64';
  export default {
    name: "login",
    data() {
      return {
        account: null,
        pwd: null,
        showType: false,
        accountList: [],
        type: '复工复产',
        showSelect: false,
        options: ['复工复产', '防疫保电'],
        checked: false,
      }
    },
    created() {
      // 判断账号类型
      // this.judgeAccount();
    },
    mounted() {
      this.getCookie();
      this.init(); //背景效果
    },
    methods: {
      init() {
        $(document).keypress(function (e) {
          // 回车键事件
          if (e.which == 13) {
            $('input[type="button"]').click();
          }
        });
      },
      handlePass: function () {

      },

      // 判断账号类型
      judgeAccount() {
        let params = {
          showLoading: true,
        };
        this.http.post('/resumeWork/listWuhanUser', params)
          .then(res => {
            this.accountList = res.data;
          })
          .catch(err => {})
      },

      verUser() {
        let num = 0;
        for(let i = 0; i < this.accountList.length; i++) {
          if(Base64.encode(this.account) == this.accountList[i]) {
            this.showType = true;
            return
          } else {
            num++;
          }
        }
        if(num == this.accountList.length) {
          this.showType = false;
        }
      },

      login: function () {
        let num = 0;
        for(let i = 0; i < this.accountList.length; i++) {
          if(Base64.encode(this.account) == this.accountList[i] && this.showType == false) {
            this.$message({
              type: 'warning',
              message: "请选择类型",
              center: true
            });
            this.showType = true;
            return
          } else {
            num++;
          }
        }
        if(num == this.accountList.length) {
          this.showType = false;
        }

        if (this.account == "") {
          this.$message.error({
            message: "用户名不能为空",
            center: true
          });
          return;
        }
        if (this.pwd == "") {
          this.$message.error({
            message: "密码不能为空",
            center: true
          });
          return;
        }
        localStorage.token = "";
        let params = {
          showLoading: true,
          username: this.account,
          password: Base64.encode(this.pwd)
        };
        // this.http.post('/login', params).then(res => {
        //   localStorage.token = res.date.token;
        //   this.clearCookie();
        //   this.getDate();
        // })
        // .catch(err => {
        //   localStorage.token = "";
        //   this.$message.error({
        //     message: err.msg,
        //     center: true
        //   });
        // })
        this.$router.push({
          path: '/mProduction'
        })

      },
      //设置cookie
      setCookie(c_name, c_pwd, exdays) {
        var exdate = new Date(); //获取时间
        exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays); //保存的天数
        //字符串拼接cookie
        window.document.cookie = "userName" + "=" + c_name + ";path=/;expires=" + exdate.toGMTString();
        let pass = "";
        if (c_pwd != "") {
          pass = Base64.encode(c_pwd)
        }
        window.document.cookie = "userPwd" + "=" + pass + ";path=/;expires=" + exdate.toGMTString();
      },
      //读取cookie
      getCookie: function () {
        if (document.cookie.length > 0) {
          var arr = document.cookie.split('; '); //这里显示的格式需要切割一下自己可输出看下
          for (var i = 0; i < arr.length; i++) {
            var arr2 = arr[i].split('='); //再次切割
            //判断查找相对应的值
            if (arr2[0] == 'userName') {
              this.account = arr2[1]; //保存到保存数据的地方
            } else if (arr2[0] == 'userPwd') {
              this.pwd = Base64.decode(arr2[1]);
            }
          }
        }
      },

      //清除cookie
      clearCookie: function () {
        this.setCookie("", "", -1); //修改2值都为空，天数为负1天就好了
      },

      // 判断区域跳转
      getDate() {
        let params = {
          showLoading: false,
        };
        this.http.post('/homePage/findTime', params)
          .then(res => {
            this.date = res.data.time;
            let arr = res.data.regionList;
            let area = ['东新区','沌口区', '江夏区', '蔡甸区', '汉南区', '黄陂区', '新洲区', '东西湖区'];
            for(let i = 0; i < arr.length; i++) {
              if(arr.length > 1 ) {
                if(this.type == '防疫保电') {
                  this.$router.push({
                    path: '/whHomeMove'
                  });
                } else {
                  this.$router.push({
                    path: '/workMove'
                  });
                }
                return
              } else {
                let num = 0;
                for(let j = 0; j < area.length; j++) {
                  if(arr[i].adminDivision == area[j]) {
                    this.$router.push({
                      path: '/areaHomeMove',
                      query:{
                        title: arr[i].adminDivision.replace("区",""),
                        regionId: arr[i].divisionId,
                        typeBtn: false
                      }
                    });
                  } else {
                    num++;
                    if(area.length == num) {
                      this.$router.push({
                        path: '/homeMove',
                        query:{
                          title: arr[i].adminDivision.replace("区",""),
                          regionId: arr[i].divisionId,
                          typeBtn: false
                        }
                      });
                    }
                  }
                }
              }

            }
          })
          .catch(err => {
          })
      },


    }
  }
</script>

<style scoped>
  .contain {
    height: 100%;
    width: 100%;
    background: #F4F7F7;
  }

  .loginWindow {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .login_title {
    width: 100%;
    padding-top: calc(100% - 300px);
  }

  .login_title img {
    width: 50%;
    margin-left: 25%;
  }

  .login_fields {
    width: 80%;
  }

  .login_fields__user,
  .login_fields__password {
    position: relative;
    margin-bottom: 3rem;
    border-bottom: 1px solid #40928F;
    color: #89A67A;
    border-radius: 0.5rem;
    font-size: 1.6rem;
  }

  .login_fields__password {
    margin-top: 4rem;
  }

  /*类型选择*/
  .login_fields__type {
    height: 4.7rem;
    position: relative;
    margin-bottom: 3rem;
    border-bottom: 1px solid #40928F;
    color: #89A67A;
    font-size: 1.6rem;
  }

  .typeSelect {
    width: calc(100% - 7rem);
    height: 4.7rem;
    margin-left: 7rem;
  }

  .typeSelectBody {
    width: 100%;
    height: 4.7rem;
    display: flex;
    align-items: center;
  }

  .typeSelectBody span {
    display: inline-block;
    width: calc(100% - 4rem);
    height: 4.7rem;
    line-height: 4.7rem;
    color: #5D714F;
  }

  .typeSelectBody img {
    width: 1.6rem;
  }

  .typeSelectBody img:nth-child(3) {
    /* Rotate div */
    transform:rotate(180deg);
    -ms-transform:rotate(180deg); /* Internet Explorer */
    -moz-transform:rotate(180deg); /* Firefox */
    -webkit-transform:rotate(180deg); /* Safari 和 Chrome */
    -o-transform:rotate(180deg); /* Opera */
  }

  .typeSelectList {
    width: 100%;
    height: 9.4rem;
    background: #fff;
    border-radius: 0.4rem;
    margin-left: -1rem;
    z-index: 10;
  }

  .typeSelectList ul {
    width: 100%;
    height: 9.4rem;
    margin: 0;
    padding: 0;
  }

  .typeSelectList ul li {
    list-style: none;
    height: 4.7rem;
    line-height: 4.7rem;
    padding-left: 1rem;
  }

  .typeSelectList ul li:nth-child(1) {
     border-bottom: 1px solid #ddd;
   }

  /*输入框内部样式*/
  .login_fields .icon {
    position: absolute;
    border-right: 1px solid #fff;
    z-index: 1;
    color: #89A67A;
    left: 1.6rem;
    top: 1rem;
  }

  .icon img {
    width: 2.4rem;
    height: 2.4rem;
  }

  .login_fields input[type='text'],
  .login_fields input[type='password'] {
    /*color: #ffffff;*/
    width: 19rem;
    margin-top: -2px;
    background: rgba(57, 61, 82, 0);
    left: 0;
    padding: 1rem 6.5rem;
    border-top: 2px solid rgba(57, 61, 82, 0);
    border-bottom: 2px solid rgba(57, 61, 82, 0);
    border-right: none;
    border-left: none;
    outline: none;
    font-family: 'Gudea', sans-serif;
    box-shadow: none;
  }

  .login_fields input[type='password'],
  .login_fields input[type='text'] {
    color: #87A478 !important;
    font-size: 1.8rem;
  }

  input::-webkit-input-placeholder {
    color: #87A478;
    font-size: 1.6rem;
  }

  input::-moz-placeholder { /* Mozilla Firefox 19+ */
    color: #87A478;
    font-size: 1.6rem;
  }

  input:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
    color: #87A478;
    font-size: 1.6rem;
  }

  input:-ms-input-placeholder { /* Internet Explorer 10-11 */
    color: #87A478;
    font-size: 1.6rem;
  }

  .passArea {
    margin-top: 2rem;
    overflow: hidden;
    border: none;
  }

  .passArea .keepPass {
    float: left;
    color: #87A478;
    margin-left: 1rem;
  }

  .forgetPass {
    float: right;
    margin-right: 1rem;
    color: #87A478;
    cursor: pointer;
    font-size: 1.6rem;
  }

  .login_btn {
    width: 100%;
    height: 4rem;
    margin-top: 4rem;
    background: #00706B;
    border-radius: 4rem;
  }


</style>
