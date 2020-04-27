<template>
  <div class="step" >
    <div class="box">
      <div class="head">
        关键指标
        <p @click="detai"><i class="el-icon-warning-outline"></i>指标说明</p>
      </div>

      <div class="body">
        <div class="flex">
          <div class="flex-column">
            <p class="text-head">较上日<span class="colora">-135</span></p>
            <p class="text-content colora">1217</p>
            <p class="text-title">监测总户数</p>
          </div>

          <div class="content">
            <p class="text-head">较上日<span class="colorb">-135</span></p>
            <p class="text-content colorb">1217</p>
            <p class="text-title">监测总户数</p>
          </div>

          <div class="flex-column">
            <p class="text-head">较上日<span class="colorc">-135</span></p>
            <p class="text-content colorc">1217</p>
            <p class="text-title">监测总户数</p>
          </div>
        </div>

        <div class="flex" style="border-bottom: 0;">
          <div class="flex-column">
            <p class="text-head">较上日<span class="colord">-135</span></p>
            <p class="text-content colord">1217</p>
            <p class="text-title">当日用电量</p>
            <p class="colord" style="text-align: center;">（万千瓦时）</p>
          </div>

          <div class="content">
            <p class="text-head">较上日<span class="colore">-135</span></p>
            <p class="text-content colore">1217</p>
            <p class="text-title">监测总户数</p>
          </div>

          <div class="flex-column">
            <p class="text-head">较上日<span class="colorf">-135</span></p>
            <p class="text-content colorf">1217</p>
            <p class="text-title">监测总户数</p>
          </div>
        </div>

        <p class="data">统计日期：2020-04-22</p>
      </div>
    </div>
    
    <el-dialog
      title="指标说明"
      :visible.sync="dialogVisible"
      width="80%">
      <div class="diaBox">
        <div class="text">
          <p>企业复工电力指数</p>
          <span>（复工率x0.5 + 复产率x0.5）x 100</span>
        </div>

        <div class="text">
          <p>复工率</p>
          <span>复工企业（日电量≥30%日均电量基准值的企业户数占所有企业总户数的百分比</span>
        </div>

        <div class="text">
          <p>复产率</p>
          <span>所有企业当日合计电量占所有企业合计日均电量基准值的百分比</span>
        </div>

        <div class="text">
          <p>已复工企业复产率</p>
          <span>已复工企业当日合计电量占已复工企业合计日均电量基准值的百分比</span>
        </div>

        <div class="text">
          <p>日均电量基准值</p>
          <span>各企业2019年上半年平均日用电量</span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "step",
    data() {
      return {
        dialogVisible: false
      }
    },
    created() {

    },
    mounted: function () {

    },
    methods: {
      detai () {
        this.dialogVisible = true
      }
    },
  }
</script>

<style lang="scss" scoped>
.step {
  
  .colora {
    color: #3d67b7;
  }

  .colorb {
    color: #8b0d1a;
  }

  .colorc {
    color: #32635f;
  }

  .colord {
    color: #6b9f7c;
  }

  .colore {
    color: #c7344a;
  }

  .colorf {
    color: #dea171;
  }

  .box {
    overflow: hidden;
    border-radius: 5px;

    .head {
      position: relative;
      line-height: 40px;
      font-size: 16px;
      background: #4f8985;
      color: #fff;
      padding-left: 10px;

      p {
        cursor: pointer;
        top: 0;
        font-size: 12px;
        position: absolute;
        right: 10px;
      }
    }

    .body {
      background: #fff;
      padding: 10px;
      box-sizing: border-box;

      .flex {
        display: flex;
        height: 80px;
        padding: 5px;
        box-sizing: border-box;
        border-bottom: 1px solid #e3e3e3;

        .flex-column {
          flex: 1;
        }
        .content {
          border-left: 1px solid #e3e3e3; 
          border-right: 1px solid #e3e3e3;
          box-sizing: border-box;
          width: 40%;
        }

        .text-head {
          font-size: 12px;
          color: #999;
          text-align: center;
        }

        .text-content {
          font-size: 16px;
          line-height: 30px;
          text-align: center;
        }

        .text-title {
          text-align: center;
        }
      }

      .data {
        text-align: right;
        color: #999;
      }
    }
  }
}
</style>
<style lang="scss">
.step {
  .el-dialog__header {
    text-align: center;
    background: #c1f8de;
  }

  .el-dialog__body {
    padding: 10px;
  }

  .diaBox {
    .text {
      padding: 5px 0;

      p {
        position: relative;
        padding-left: 20px;
        line-height: 20px;
      }
      p:before {
        position: absolute;
        content: '';
        width: 6px;
        height: 6px;
        top: 6px;
        left: 7px;
        background: #2fbb7a;
        border-radius: 5px;
      }
    }
  }
  
}
</style>
