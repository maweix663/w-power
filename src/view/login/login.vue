<template>
  <!--登录界面-->
  <div class="contain">
    <div class="loginWindow">
      <div class="login_title">
        <span>用户登录</span>
      </div>
      <div class="login_fields">
        <div class="login_fields__user">
          <div class="icon">
            <img alt="" src="../../../static/img/user2.png">
          </div>
          <input v-model="account" id="username" name="login" maxlength="16" type="text" autocomplete="off"
                 placeholder="请输入用户名">
        </div>
        <div class="login_fields__password">
          <div class="icon">
            <img alt="" src="../../../static/img/pwd2.png">
          </div>
          <input v-model="pwd" id="password" name="pwd" maxlength="16" type="password" autocomplete="off"
                 placeholder="请输入用户密码">
        </div>
        <!--        <div class="login_fields__password passArea">-->
        <!--          <el-checkbox v-model="checked" class="keepPass">记住密码</el-checkbox>-->
        <!--          <span class="forgetPass" @click="handlePass" target="_blank">忘记密码？</span>-->
        <!--        </div>-->
        <el-button class="login_btn" type="success" @click="login">登&nbsp;录</el-button>
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
        checked: false,

      }
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
      login: function () {
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
        //   localStorage.userId = Base64.encode(this.account);
        //   localStorage.userId2 = this.account;
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
                this.$router.push({
                  path: '/homeWuhan'
                });
                return
              } else {
                let num = 0;
                for(let j = 0; j < area.length; j++) {
                  if(arr[i].adminDivision == area[j]) {
                    this.$router.push({
                      path: '/areaHome',
                      query:{
                        area: arr[i].adminDivision.replace("区",""),
                        regionId: arr[i].divisionId,
                        type: false
                      }
                    });
                  } else {
                    num++;
                    if(area.length == num) {
                      this.$router.push({
                        path: '/home',
                        query:{
                          area: arr[i].adminDivision.replace("区",""),
                          regionId: arr[i].divisionId,
                          type: false
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
    background-image: url("../../../static/img/bg_login4.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }

  .loginWindow {
    position: absolute;
    width: 400px;
    height: 320px;
    left: 0;
    right: 0;
    margin: auto;
    top: 0;
    bottom: 0;
    padding: 30px 40px 40px 40px;
  }

  .login_title {
    color: #89a67a;
    font-size: 32px;
    text-align: center;
  }

  .login_fields {
    height: 300px;
    position: absolute;
    left: calc(50% - 160px);
    margin-top: 50px;
  }

  .login_fields__user,
  .login_fields__password {
    position: relative;
    margin-bottom: 30px;
    border: 1px solid #89a67a;
    border-radius: 5px;
  }

  .login_fields__password {
    margin-top: 40px;
  }

  .login_fields .icon {
    position: absolute;
    border-right: 1px solid #89a67a;
    z-index: 1;
    color: #ffffff;
    left: 16px;
    top: 4px;
    padding-right: 5px;
    opacity: .5;
  }

  .login_fields input[type='text'],
  .login_fields input[type='password'] {
    /*color: #ffffff;*/
    width: 190px;
    margin-top: -2px;
    background: rgba(57, 61, 82, 0);
    left: 0;
    padding: 10px 65px;
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
    color: #89a67a !important;
  }

  input::-webkit-input-placeholder {
    color: #89a67a;
    font-size: 13px;
  }

  input::-moz-placeholder { /* Mozilla Firefox 19+ */
    color: #89a67a;
    font-size: 13px;
  }

  input:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
    color: #89a67a;
    font-size: 13px;
  }

  input:-ms-input-placeholder { /* Internet Explorer 10-11 */
    color: #89a67a;
    font-size: 13px;
  }

  .passArea {
    margin-top: 20px;
    overflow: hidden;
    border: none;
  }

  .passArea .keepPass {
    float: left;
    color: #f8f8f8;
    margin-left: 10px;
  }

  .forgetPass {
    float: right;
    margin-right: 10px;
    color: #f8f8f8;
    cursor: pointer;
    font-size: 14px;
  }

  .login_btn {
    width: 320px;
    margin-top: 40px;
  }

  .login_fields .el-button--success, .el-button--success {
    background: #89a67a;
    border-color: #89a67a;
  }

</style>
