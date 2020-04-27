<template>
  <div class="mProduction" >
    <div class="header">
      <h3 class="title">复工复产</h3>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="全市高压企业" name="first"></el-tab-pane>
        <el-tab-pane label="规上工业企业" name="second"></el-tab-pane>
        <el-tab-pane label="行业重点企业" name="third"></el-tab-pane>
        <el-tab-pane label="定时任务补偿" name="fourth"></el-tab-pane>
      </el-tabs>
    </div>


    <!--展示区-->
    <div class="main">
      <!-- tab1 -->
      <div v-if="activeName == 'first'" class="stepOne">
        <indicators /> 
        <search />
        <search />

        <div style="height: 100px;"></div>
      </div>
    </div>

    <!--返回武汉按钮-->
    <div class="typeBtnBox" @click="returnBtn">
      <p>防疫保电 ></p>
    </div>

  </div>
</template>

<script>
// tab1
import indicators from './templates/indicators'
import search from './templates/search'
export default {
  name: "work",
  components: {
    indicators,
    search
  },
  data() {
    return {
      // 标题
      activeName: 'first',
    }
  },
  created() {

  },
  mounted: function () {

  },
  methods: {
    // 返回武汉按钮
    returnBtn() {
      this.$router.push({
        path: '/homeWuhan'
      });
    },

    // tabs 切换
    handleClick (tab, event) {

    }
  },
}
</script>

<style lang="scss" scoped>
  .mProduction {
    background: url("../../../static/img/bg.png") no-repeat;
    background-size: 100% 100%;
    width: 100%;
    height: 100%;

    /*标题区*/
    .header {
      width: 100%;
      padding: 0 10px;
      box-sizing: border-box;
      background: #4f8985;
      position: relative;
      h3 {
        width: 100%;
        text-align: center;
        color: #fff;
        font-size: 18px;
        line-height: 50px;
        margin: 0;
      }

      .upload {
        position: absolute;
        top: 5px;
        right: 10px;
        cursor: pointer;
        img {
          width: 20px;
          height: 20px;
        }
      }

    }

    /*展示区*/
    .main {
      width: calc(100% - 40px);
      height: calc(100% - 90px);
      overflow: auto;
      padding: 100px 20px 20px 20px;
    }

    /*返回武汉按钮*/
    .typeBtnBox {
      width: 100px;
      height: 28px;
      position: absolute;
      left: 20px;
      top: 12px;
      cursor: pointer;
      p {
        line-height: 28px;
        color: #fff;
      }
    }

  }
</style>
<style lang="scss">
.mProduction {
  .el-tabs__header {
    margin: 0;
  }

  .el-tabs__item {
    color: #fff;
  }

  .el-tabs__active-bar {
    background-color: #fff;
  }

  .el-tabs__nav-wrap::after {
    background-color: transparent;
  }

  .el-tabs__nav-next, .el-tabs__nav-prev{
    color: #fff;
  }
}
</style>
