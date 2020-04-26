<template>
  <div class="containerNewsMove">
    <!--标题头-->
    <div class="header">
      <div class="ret" @click="retPage">
        <img src="../../../static/img/move/ret.png" alt="">
        <span>返回</span>
      </div>
      <div class="title">战区动态</div>
      <div class="add" @click="addPage">
        <img src="../../../static/img/move/add.png" alt="">
      </div>
    </div>

    <!--表头-->
    <div class="newsTitle">
      <span>战区</span>
      <span>时间</span>
      <span>内容</span>
    </div>

    <!--动态列表-->
    <div class="newsListBox" id="newsListBox" ref="element">
      <ul>
        <li class="list-item" data-type="0" v-for="(item,index) in newsList">
          <div class="itemTitle" @touchstart.capture="touchStart" @touchend.capture="touchEnd" @click="toDetail(item)">
            <div class="item-desc">
              <span>【{{ item.divisionName }}】</span>
              <span>{{ item.time }}</span>
              <span>{{ item.detail }}</span>
            </div>
          </div>
          <div class="btn-box">
            <div class="btn edit" @click="editNews(item)">编辑</div>
            <div class="btn del" @click="delNews(item)">删除</div>
          </div>
        </li>
      </ul>
    </div>

    <!--详情-->
    <div class="model" v-if="showDetailModel">
      <div class="modelDetailMain">
        <p><span>战区：</span>{{detailNews.divisionName}}</p>
        <p><span>时间：</span>{{detailNews.time}}</p>
        <p><span>标题：</span>{{detailNews.title}}</p>
        <p><span>内容：</span>{{detailNews.detail}}</p>
        <div class="modelBtn">
          <button @click="closeDel">关 闭</button>
        </div>
      </div>
    </div>

    <!--提示框-删除-->
    <div class="model" v-if="showModel">
      <div class="modelMain">
        <div class="modelTitle">您确认删除吗?</div>
        <div class="modelBtn">
          <button @click="closeDel">取消</button>
          <button @click="deterDel">确定</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  export default {
    name: "newsMove",
    data() {
      return {
        // 区域
        title: '',
        regionId: '',
        typeBtn: null,
        page: '',
        // 动态列表
        refreData: false,
        newsList: [],
        pageSize: 1,
        startX: 0, // 初始位置
        endX: 0, // 结束位置

        // 详情
        showDetailModel: false,
        detailNews: null,

        // 删除-遮罩层
        delId: '',
        showModel: false,
      }
    },
    created() {
      // 区域
      this.title = this.$route.query.title;
      this.regionId = this.$route.query.regionId;
      this.typeBtn = this.$route.query.typeBtn;
      this.page = this.$route.query.page;

      // 获取战区动态
      this.refreData = false;
      this.getNews();
    },
    mounted: function () {
      // 监听滚动
      window.addEventListener('scroll', this.watchScroll, true);
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

      // 新建
      addPage() {
        this.$router.push({
          path: '/addNews',
          query: {
            title: this.title,
            regionId: this.regionId,
            typeBtn: this.typeBtn,
            type: '新建',
            page: this.page
          }
        });
      },

      // 监听滚动
      watchScroll () {
        let _this = this;
        this.$nextTick(() => {
          var bady = document.getElementById("newsListBox");
          bady.onscroll = () => {
            // 获取距离顶部的距离
            var scrollTop = bady.scrollTop;
            // 获取可视区的高度
            var windowHeight = bady.clientHeight;
            // 获取滚动条的总高度
            var scrollHeight = bady.scrollHeight;
            // console.log("距顶部"+scrollTop+"可视区高度"+windowHeight+"滚动条总高度"+scrollHeight);
            if(scrollTop+windowHeight + 4>=scrollHeight){
              _this.pageSize++;
              _this.refreData = true;
              _this.getNews();
            }
          }
        });

      },

      // 获取战区动态
      getNews() {
        let params = {
          showLoading: false,
          regionId: this.regionId,
          limit: 200,
          page: this.pageSize,
          time: ''
        };
        let _this = this;
        this.http.post('/homePage/selectNotice', params)
          .then(res => {
            let data = res.data;
            if(_this.refreData) {
              for(let i = 0; i < data.length; i++) {
                _this.newsList.push(data[i]);
              }
            } else {
              _this.newsList = data;
            }
          })
          .catch(err => {
          })
      },

      // 触摸开始
      touchStart(e) {
        // 记录初始位置
        this.startX = e.touches[0].clientX;
      },

      // 触摸结束
      touchEnd(e) {
        // 当前滑动的父级元素
        let parentElement = e.currentTarget.parentElement;
        console.log(parentElement)
        // 记录结束位置
        this.endX = e.changedTouches[0].clientX;
        // console.log('结束' + parentElement.dataset.type + '====' + (this.startX - this.endX));
        // 左滑
        if (parentElement.dataset.type == 0 && this.startX - this.endX > 80) {
          this.restSlide();
          parentElement.dataset.type = 1;
        }
        // 右滑
        if (parentElement.dataset.type == 1 && this.startX - this.endX < -30) {
          this.restSlide();
          parentElement.dataset.type = 0;
        }
        this.startX = 0;
        this.endX = 0;
      },

      // 判断当前是否有滑块处于滑动状态
      checkSlide() {
        let listItems = document.querySelectorAll('.list-item');
        for (let i = 0; i < listItems.length; i++) {
          if (listItems[i].dataset.type == 1) {
            return true;
          }
        }
        return false;
      },

      // 滑块复位
      restSlide() {
        let listItems = document.querySelectorAll('.list-item');
        // 复位
        for (let i = 0; i < listItems.length; i++) {
          listItems[i].dataset.type = 0;
        }
      },

      // 点击详情
      toDetail(data) {
       this.detailNews = data;
       this.showDetailModel = true;
      },

      // 编辑
      editNews(data) {
        this.$router.push({
          path: '/addNews',
          query: {
            regionId: this.regionId,
            type: '编辑',
            page: this.page,
            id: data.id,
            title: data.title,
            detail: data.title
          }
        });
      },

      // 删除
      delNews(data) {
        this.showModel = true;
        this.delId = data.id;
      },

      // 关闭
      closeDel() {
        this.showModel = false;
        this.showDetailModel = false;
      },

      // 确定
      deterDel() {
        let params = {
          showLoading: false,
          regionId: this.regionId,
          id:  this.delId
        };
        this.http.post('/homePage/deleteNotice', params)
          .then(res => {
            this.showModel = false;
            this.$message({
              type: 'success',
              message: "删除成功",
              center: true
            })
            this.restSlide();
            // 获取战区动态
            this.refreData = false;
            this.getNews();
          })
          .catch(err => {
            this.showModel = false;
            this.$message({
              type: 'error',
              message: "删除失败",
              center: true
            })
          })
      },


    },
  }
</script>

<style lang="scss" scoped>
  .containerNewsMove {
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

    /*表头*/
    .newsTitle {
      width: calc(100% - 2rem);
      height: 4rem;
      margin-left: 1rem;
      span {
        float: left;
        display: inline-block;
        height: 4rem;
        line-height: 4rem;
        font-size: 1.4rem;
        font-weight: bold;
      }
      span:nth-child(1) {
        width: 6rem;
        text-indent: 0.6rem;
      }
      span:nth-child(2) {
        width: 13rem;
        text-indent: 0.6rem;
      }
      span:nth-child(3) {
        width: calc(100% - 19rem);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    /*动态列表*/
    .newsListBox {
      width: calc(100% - 2rem);
      height: calc(100% - 10rem);
      margin-left: 1rem;
      overflow-y: auto;
      ul {
        width: 100%;
        margin-top: 0rem;
        overflow: hidden;
        .list-item[data-type='0'] {
          transform: translate3d(0, 0, 0);
        }

        .list-item[data-type="1"] {
          transform: translate3d(-11rem, 0, 0);
        }

        .list-item {
          display: block;
          height: 3.2rem;
          line-height: 3.2rem;
          margin-top: 1rem;
          position: relative;
          /*-webkit-transition: all 0.2s;*/
          /*transition: all 0.2s;*/
          .itemTitle {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            font-size: 1.4rem;
            .item-desc {
              width: 100%;
              height: 100%;
              span {
                float: left;
                display: inline-block;
                height: 3rem;
                line-height: 3rem;
                font-size: 1.4rem;
              }
              span:nth-child(1) {
                width: 6rem;
              }
              span:nth-child(2) {
                width: 13rem;
                text-align: center;
              }
              span:nth-child(3) {
                width: calc(100% - 19rem);
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
            }
          }
          .btn-box {
            position: absolute;
            top: 0;
            right: -11rem;
            .btn {
              display: inline-block;
              width: 5rem;
              height: 3.2rem;
              font-size: 1.6rem;
              text-align: center;
              line-height: 3.2rem;
              color: #fff;
            }
            .edit {
              background: #00706A;
            }
            .del {
              background: #e7535e;
            }
          }

        }
      }

    }

    /*提示框-详情-删除*/
    .model {
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.6);
      z-index: 99999;
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      .modelDetailMain {
        width: 80%;
        background: #fff;
        border-radius: 1rem;
        padding: 1rem 0;
        p {
          display:block;
          word-break: break-all;
          word-wrap: break-word;
          width: calc(100% - 2rem);
          padding: 0 1rem;
          color: #000;
          line-height: 2.8rem;
          font-size: 1.4rem;
          span {
            font-weight: bold;
          }
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
        }
      }
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
