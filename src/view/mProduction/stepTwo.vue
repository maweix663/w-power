<template>
  <div class="step" >

    <div class="box">
      <div class="head">
        关键指标
        <p><i class="el-icon-warning-outline"></i>指标说明</p>
      </div>

      <div class="body"></div>
    </div>

    <gongdian></gongdian>
    <industry></industry>
    <powerRanking></powerRanking>
  </div>
</template>

<script>
import gongdian from './gongdian.vue'
import industry from './industry.vue'
import powerRanking from './powerRanking.vue'
export default {
  name: 'step',
  components: {
    gongdian,
    industry,
    powerRanking,
  },
  data () {
    return {

    }
  },
  created () {

  },
  mounted: function () {

  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
.step {
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
  }
}


</style>
