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
      <span v-for="(item, index) in industryOneArr" @click="changeNum(item, index)" :key="item"><i :style="`background: ${color[index]};`"></i>{{ item | textFort(index) }}</span>
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

      color: ['#4e79a7', '#a0cbe8', '#f28e2b', '#ffbe7d', '#59a14f', '#8cd17d', '#b6992d', '#f1ce63', '#499894', '#86bcb6', '#e15759'],
      industryOneArr: [],
      industryOne: ''
    }
  },
  props: {
    typeId: {
      type: String
    }
  },
  filters: {
    textFort (val, index) {
      let str = ''
      if (index == 0) {
        str = '一、' + val
      } else if (index == 1) {
        str = '二、' + val
      }else if (index == 2) {
        str = '三、' + val
      }else if (index == 3) {
        str = '四、' + val
      }else if (index == 4) {
        str = '五、' + val
      }else if (index == 5) {
        str = '六、' + val
      }else if (index == 6) {
        str = '七、' + val
      }else if (index == 7) {
        str = '八、' + val
      }else if (index == 8) {
        str = '九、' + val
      }else if (index == 9) {
        str = '十、' + val
      }else if (index == 10) {
        str = '十一、' + val
      }


      return str
    }
  },
  watch: {
    typeId (val) {
      this.getListIndustry()
      this.getEchartsData({
        enterpriseId: val,
        industryOne: '',
        status: 0
      }, this.color)
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
    }, this.color)
  },
  methods: {
    init (xData, yData, color) {
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
                      var colorList = color
                      return colorList[params.dataIndex];
                  }
                }
              },
              barWidth : 10
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
          console.log(res.data)
          this.industryOneArr = res.data
          
        })
        .catch(err => {})
    },

    // 获取行业类型
    changeNum (str, index) {
      this.industryOne = str
      this.getEchartsData({
        enterpriseId: this.typeId,
        industryOne: this.industryOne,
        status: this.status
      }, [this.color[index]])
    },

    // 搜索
    searchData (num) {
      this.status = num
      this.getEchartsData({
        enterpriseId: this.typeId,
        industryOne: this.industryOne,
        status: this.status
      }, this.color)
    },

    // 获取企业级别
    getEchartsData (params, color) {
      this.http.post('/resumeWork/industryRanking', params)
        .then(res => {
          let data = res.data
          let x = ['一', '二','三','四','五','六','七','八','九','十', '十一']
          let y = []
          data.map(item => {
            y.push(item.value)
          })
          this.init(x, y, color)
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

    i {
      position: absolute;
      width: 4px;
      height: 4px;
      top: 13px;
      left: 0;
    }
  }
}
</style>
