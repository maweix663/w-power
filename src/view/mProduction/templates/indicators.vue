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
            <p class="text-head">较上日<span class="colora">{{ arrs[0].complate }}</span></p>
            <p class="text-content colora">{{ arrs[0].value }}</p>
            <p class="text-title">{{ arrs[0].name }}</p>
          </div>

          <div class="content">
            <p class="text-head">较上日<span class="colorb">{{ arrs[1].complate }}</span></p>
            <p class="text-content colorb">{{ arrs[1].value }}</p>
            <p class="text-title">{{ arrs[1].name }}</p>
          </div>

          <div class="flex-column">
            <p class="text-head">较上日<span class="colorc">{{ arrs[2].complate }}</span></p>
            <p class="text-content colorc">{{ arrs[2].value }}</p>
            <p class="text-title">{{ arrs[2].name }}</p>
          </div>
        </div>

        <div class="flex" style="border-bottom: 0;">
          <div class="flex-column">
            <p class="text-head">较上日<span class="colord">{{ arrs[3].complate }}</span></p>
            <p class="text-content colord">{{ arrs[3].value }}</p>
            <p class="text-title">{{ arrs[3].name }}</p>
            <p class="colord" style="text-align: center;">（万千瓦时）</p>
          </div>

          <div class="content">
            <p class="text-head">较上日<span class="colore">{{ arrs[4].complate }}</span></p>
            <p class="text-content colore">{{ arrs[4].value }}</p>
            <p class="text-title">{{ arrs[4].name }}</p>
          </div>

          <div class="flex-column">
            <p class="text-head">较上日<span class="colorf">{{ arrs[5].complate }}</span></p>
            <p class="text-content colorf">{{ arrs[5].value }}</p>
            <p class="text-title">{{ arrs[5].name }}</p>
          </div>
        </div>

        <p class="data">统计日期：2020-04-22</p>
      </div>
    </div>
    
    <el-dialog
      title="指标说明"
      :visible.sync="dialogVisible"
      :modal-append-to-body="false"
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
    props: {
      indicatorsArr: {
        type: Array
      }
    },
    data() {
      return {
        dialogVisible: false,
        arrs: [
          {
            name: '',
            value: '',
            complate: ''
          },
          {
            name: '',
            value: '',
            complate: ''
          },
          {
            name: '',
            value: '',
            complate: ''
          },
          {
            name: '',
            value: '',
            complate: ''
          },
          {
            name: '',
            value: '',
            complate: ''
          },
          {
            name: '',
            value: '',
            complate: ''
          }
        ]
      }
    },
    created() {
      
    },
    watch: {
      indicatorsArr (val) {
        this.arrs = val
      }
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
  margin-bottom: 10px;
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
      position: relative;

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
