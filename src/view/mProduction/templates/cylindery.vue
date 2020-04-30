<template>
  <div style="margin: 10px 0 10px 0" class="industry itemBox">
    <div class="itemTitle">
      当日各供电区域指标排名
    </div>

    <div id="ytindustry" style="width: 100%; height:250px; margin-top: 10px"></div>
    <div class="btn-bottom">
      <el-button round size="mini" @click="searchData(1)" :class="{active: status == 1}">&nbsp;复工率&nbsp;</el-button>
      <el-button round size="mini" @click="searchData(2)" :class="{active: status == 2}">&nbsp;复产率&nbsp;</el-button>
      <el-button round size="mini" @click="searchData(0)" :class="{active: status == 0}">&nbsp;复工电力指数&nbsp;</el-button>
    </div>

    <div class="text">
      <span v-for="item in industryOneArr" @click="changeNum(item)" :key="item">{{ item }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'industry',
  data () {
    return {
      mychart: '',
      status: 0,

      color: ['#00a0e9', '#f39800',  '#eb6100', '#ff0014', '#e40071', '#601986', '#1d2088', '#00479d', '#ffff00', '#71ff45', '#8fc31f', '#22ac38', '#0c87ba', '#3a00ff', '#20c1d5', '#053549', '#ff353a', '#ff8b5c', '#ff105f', '#920783', '#ff9300','#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
      industryOneArr: [],
      industryOne: ''
    }
  },
  props: {
    typeId: {
      type: String
    }
  },
  watch: {
    typeId (val) {
      this.getListIndustry()
      this.getEchartsData({
        enterpriseId: val,
        industryOne: '',
        status: 0
      })
    }
  },
  created () {
    this.getListIndustry()
  },
  mounted () {
    this.getEchartsData({
      enterpriseId: this.typeId,
      industryOne: this.industryOne,
      status: this.status
    })
  },
  methods: {
    init (xData, yData) {
      this.mychart = this.$echarts.init(document.getElementById('ytindustry'))
      
      let option = {
          xAxis: {
            type: 'category',
            data: xData
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              data: yData,
              type: 'bar',
              itemStyle: {  
                normal: {  
                  color: (params) => {
                      var colorList = this.color
                      return colorList[params.dataIndex];
                  }
                }
              },
            }
          ]
      }

      this.mychart.setOption(option)
    },

    // 获取企业级别
    getListIndustry () {
      this.http.post('/resumeWork/listIndustry', {
        enterpriseId: this.typeId
      })
        .then(res => {
          this.industryOneArr = res.data
          
        })
        .catch(err => {})
    },

    // 获取行业类型
    changeNum (str) {
      this.industryOne = str
      this.getEchartsData({
        enterpriseId: this.typeId,
        industryOne: this.industryOne,
        status: this.status
      })
    },

    // 搜索
    searchData (num) {
      this.status = num
      this.getEchartsData({
        enterpriseId: this.typeId,
        industryOne: this.industryOne,
        status: this.status
      })
    },

    // 获取企业级别
    getEchartsData (params) {
      this.http.post('/resumeWork/industryRanking', params)
        .then(res => {
          let data = res.data
          let x = []
          let y = []
          data.map(item => {
            x.push(item.industryOne)
            y.push(item.value)
          })
          
          this.init(x, y)
        })
        .catch(err => {
          this.init([], [])
        })
    },
  }
}
</script>

<style lang="scss" scoped>
.industry {
  .changeBtn {
    position: absolute;
    width: 120px;
    right: 10px;
  }

  .btn-bottom {
    display: flex; 
    justify-content: space-around; 
    padding: 0 20px;

    .active {
      color: #fff;
      background: #3f6f6b;
    }
  }

  .text {
    padding-top: 10px;
    box-sizing: border-box;

    span {
      font-size: 14px;
      padding: 2px 10px;
      line-height: 30px;
      position: relative;
      margin-right: 2px;
      display: inline-block;
      cursor: pointer;
    }

    span:before {
      position: absolute;
      content: '';
      width: 4px;
      height: 4px;
      top: 13px;
      left: 0;
      background: #e3e3e3;
    }
  }
}
</style>
