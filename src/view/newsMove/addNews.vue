<template>
  <div class="containerAddNewsMove">
    <!--标题头-->
    <div class="header">
      <div class="ret" @click="retNewsPage">
        <img src="../../../static/img/move/ret.png" alt="">
        <span>返回</span>
      </div>
      <div class="title">{{ type }}动态</div>
    </div>

    <div class="formBox">
      <el-input v-model="title" placeholder="请输入标题(20字以内)" maxlength="20"></el-input>
      <el-input
        type="textarea"
        :rows="10"
        placeholder="请输入内容(200字以内)"
        maxlength="200"
        v-model="detail">
      </el-input>
      <el-button class="login_btn" type="primary" @click="submit">保 存</el-button>

    </div>

  </div>
</template>

<script>
  export default {
    name: "addNews",
    data() {
      return {
        regionId: '',
        page: '',
        type: '',
        title: '',
        detail: '',
        id: '',
      }
    },
    created() {
      this.regionId = this.$route.query.regionId;
      this.type = this.$route.query.type;
      this.page = this.$route.query.page;
      this.id = this.$route.query.id;
      this.title = this.$route.query.title;
      this.detail = this.$route.query.detail;
    },
    mounted: function () {

    },
    methods: {
      // 返回
      retNewsPage() {
        this.$router.push({
          path: '/newsMove',
          query: {
            title: this.title,
            regionId: this.regionId,
            typeBtn: this.typeBtn,
            type: this.type,
            page: this.page
          }
        });
      },

      submit() {
        if(this.title == '') {
          this.$message({
            message: "标题不能为空",
            center: true
          })
          return
        }
        if(this.detail == '') {
          this.$message({
            message: "内容不能为空",
            center: true
          })
          return
        }

        let url;
        let params;
        if(this.type == '新建') {
          url = '/homePage/insertNotice'
          params = {
            showLoading: false,
            regionId: this.regionId,
            title: this.title,
            detail: this.detail
          };
        } else {
          url = '/homePage/updateNotice'
          params = {
            showLoading: false,
            regionId: this.regionId,
            id: this.id,
            title: this.title,
            detail: this.detail,
          };
        }

        this.http.post(url, params)
          .then(res => {
            this.$message({
              type: 'success',
              message: "保存成功",
              center: true
            })
            this.title = '';
            this.detail = '';
          })
          .catch(err => {
            this.$message({
              type: 'error',
              message: "保存失败",
              center: true
            })
          })
      }

    },
  }
</script>

<style lang="scss" scoped>
  .containerAddNewsMove {
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
      width: 80%;
      height: calc(100% - 6rem);
      margin-left: 10%;
      margin-top: 2rem;
      position: relative;
      .el-textarea {
        margin-top: 2rem;
      }
      .login_btn {
        width: 100%;
        height: 4rem;
        margin-top: 4rem;
        background: #00706B;
        border-radius: 4rem;
        position: absolute;
        bottom: 4rem;
        left: 0;
      }
    }
  }
</style>
