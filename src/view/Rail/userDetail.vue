<template>
  <div class="containerNewsMove">
    <!--标题头-->
    <div class="header">
      <div class="ret" @click="retPage">
        <img src="../../../static/img/move/ret.png" alt="">
        <span>返回</span>
      </div>
      <div class="title">用户详情</div>
    </div>

    <!--详情-->
    <div class="itemDeail">
      <ul>
        <li>
          <span>营业所</span><p>{{ item.departmentName }}</p>
          <span>抄表段</span><p>{{ item.railNo }}</p>
          <span>抄表员</span><p>{{ item.railHuman }}</p>
          <span>户号</span><p>{{ item.accountNo }}</p>
          <span>户名</span><p>{{ item.accountName }}</p>

          <span>用电地址</span><p>{{ item.address }}</p>
          <span>用户类别</span><p>{{ item.accountType }}</p>
          <span>行业分类</span><p>{{ item.industrySort }}</p>
          <span>证件号码</span><p>{{ item.cardNo }}</p>
          <span>手机号</span><p>{{ item.tel }}</p>

          <span>停电方式</span><p>{{ item.powerType }}</p>
          <span>是否费控</span><p>{{ item.limitFee }}</p>
          <span>MADE_NO</span><p>{{ item.madeNo }}</p>
          <span>厂商</span><p>{{ item.manufacturer }}</p>
          <span>通信规约</span><p>{{ item.comRules }}</p>

          <span>电量</span><p>{{ item.powerNo }}</p>
          <span>电费</span><p>{{ item.powerRate }}</p>

          <!--<span>阶梯档位使用情况</span><p>{{ item.stairShift }}</p>-->
          <!--<span>缴费方式</span><p>{{ item.payType }}</p>-->
          <!--<span>缴费时间</span><p>{{ item.payTime }}</p>-->
          <!--<span>电能表类型</span><p>{{ item.energyMeterType }}</p>-->
          <!--<span>倍率</span><p>{{ item.magnification }}</p>-->
          <!--<span>台区编号</span><p>{{ item.areaNo }}</p>-->
          <!--<span>台区名称</span><p>{{ item.areaName }}</p>-->
          <!--<span>线路</span><p>{{ item.line }}</p>-->
          <!--<span>变电站</span><p>{{ item.energyMeterType }}</p>-->
          <!--<span>服务需求的次数</span><p>{{ item.magnification }}</p>-->
          <!--<span>账单订阅信息</span><p>{{ item.areaNo }}</p>-->
          <!--<span>信用等级</span><p>{{ item.areaName }}</p>-->
        </li>
      </ul>

    </div>
  </div>
</template>

<script>
  export default {
    name: "userDetail",
    data() {
      return {
        // 区域
        title: '',
        regionId: '',
        typeBtn: null,
        page: '',
        item: null,
        itemNull: null,
        railNo: '',
      }
    },
    created() {
      // 区域
      this.title = this.$route.query.title;
      this.regionId = this.$route.query.regionId;
      this.typeBtn = this.$route.query.typeBtn;
      this.page = this.$route.query.page;
      this.itemNull = this.$route.query.item;
      this.railNo = this.$route.query.railNo;
      this.handleData();
    },
    mounted: function () {

    },
    methods: {
      // 返回
      retPage() {
        this.$router.push({
          path: '/userInfo',
          query: {
            title: this.title,
            regionId: this.regionId,
            page: this.page,
            typeBtn: this.typeBtn,
            railNo: this.railNo
          }
        });
      },

      // 处理数据
      handleData() {
        this.item = {};
        for(let key in this.itemNull) {
          this.item[key] = this.itemNull[key];
          if(this.itemNull[key] == null) {
            this.item[key] = '暂无信息'
          }
        }
      },

    },
  }
</script>

<style lang="scss" scoped>
  .containerNewsMove {
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

    /*详情*/
    .itemDeail {
      width: calc(100% - 4rem);
      height: calc(100% - 8rem);
      margin: 1rem 2rem;
      overflow-y: auto;
      ul {
        width: 100%;
        li {
          width: 100%;
          span {
            line-height: 3.2rem;
            display: block;
            font-size: 1.4rem;
            color: #AEADAD;
          }
          p {
            line-height: 3.2rem;
            display: block;
            font-size: 1.4rem;
            color: #626262;
          }
        }
      }
    }

  }
</style>
