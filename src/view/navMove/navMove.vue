<template>
  <div class="containerNavMove">
    <!--标题头-->
    <div class="header">
      <div class="ret" @click="retPage">
        <img src="../../../static/img/move/ret.png" alt="">
        <span>返回</span>
      </div>
      <div class="title">导航</div>
    </div>

    <div class="main">
      <frameset cols="100%">
      <frame :src="'https://uri.amap.com/marker?position='+windowModelInfo.lng+','+windowModelInfo.lat+'&name='+windowModelInfo.address">
      </frameset>
      <!--<a :href=-->
      <!--"'https://uri.amap.com/marker?position='+windowModelInfo.lng+','+windowModelInfo.lat+'&name='+windowModelInfo.address"-->
      <!--&gt;{{windowModelInfo.address}}</a>-->
    </div>

  </div>
</template>

<script>
  export default {
    name: "navMove",
    data() {
      return {
        // 区域
        title: '',
        regionId: '',
        typeBtn: null,
        page: '',

        windowModelInfo: null,
      }
    },
    created() {
      // 区域
      this.title = this.$route.query.title;
      this.regionId = this.$route.query.regionId;
      this.typeBtn = this.$route.query.typeBtn;
      this.page = this.$route.query.page;
      this.windowModelInfo = this.$route.query.data;
    },
    mounted: function () {

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
    },
  }
</script>

<style lang="scss" scoped>
  .containerNavMove {
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
    }

    .main {
      width: 100%;
      height: calc(100% - 5rem);
      overflow: auto;
      frameset {
        display: inline-block;
        width: 100%;
        height: 100%!important;
        frame {
          display: inline-block;
          width: 100%;
          height: 100%!important;
        }
      }
    }
  }

</style>
