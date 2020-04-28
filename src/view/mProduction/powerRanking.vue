<template>
  <div class="powerRanking itemBox">
    <div class="itemTitle">
      当日各供电区域指标排名
    </div>
    <div id="powerRanking" style="width: 100%; height:250px; margin-top: 10px"></div>
    <div class="btn-bottom">
      <el-button round size="mini" @click="btnNum = 1" :class="{active: btnNum == 1}">&nbsp;复工电力指数&nbsp;</el-button>
      <el-button round size="mini" @click="btnNum = 2" :class="{active: btnNum == 2}">&nbsp;复工率&nbsp;</el-button>
      <el-button round size="mini" @click="btnNum = 3" :class="{active: btnNum == 3}">&nbsp;重置&nbsp;</el-button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'powerRanking',
  data() {
    return {
      mychart: '',
      btnNum: 1,

    }
  },
  created() {

  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.mychart = this.$echarts.init(document.getElementById('powerRanking'))

      // 指定图表的配置项和数据
      let option = {
        backgroundColor: '#FFFFFF',

        color: ['#3f6f6b'],
        tooltip: { // 提示框组件
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '3%',
          bottom: '3%',
          top: 30,
          containLabel: true,
          show: false // 网格边框是否显示，上和右边框 
        },
        yAxis: {
          type: 'category',
          boundaryGap: true, // 坐标轴两边留白
          axisTick: {
            show: false
          },
          splitLine: { // 网格线 x轴对应的是否显示
            show: false
          },
          data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
        },

        xAxis: [ // 双y坐标轴
          {
            type: 'value',
            splitLine: { // 网格线 y轴对应的是否显示
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              formatter: '{value}'
            }
          }
        ],

        series: [{
          type: 'bar',
          markLine: {
            data: [
              { 
                type: 'average',
                name: '平均值',
                label: {
                  formatter: function(val){
                    return val.name + ':' + val.value
                  }                  
                }
              }
            ]
          },
          data: [1741.9, 977, 1742.2, 1431.1, 1636.2, 1447, 1711.7, 1921.2, 2609.6, 3332.6, 3647.3, 2498.1]
        }]
      }

      this.mychart.setOption(option)
    }

  }
}

</script>
<style lang="scss" scoped>
.powerRanking {

  .btn-bottom {
    display: flex;
    justify-content: space-around;
    padding: 0 20px;

    .active {
      color: #fff;
      background: #3f6f6b;
    }
  }
}

</style>
