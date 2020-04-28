<template>
  <div style="margin: 0 0 10px 0" class="industry itemBox">
		<div class="itemTitle">
			当日各行业类别指标排名
		</div>

		<div id="yindustry" style="width: 100%; height:350px; margin-top: 10px"></div>
		<div class="btn-bottom">
			<el-button round size="mini" @click="btnNum = 2" :class="{active: btnNum == 2}">&nbsp;复工率&nbsp;</el-button>
			<el-button round size="mini" @click="btnNum = 3" :class="{active: btnNum == 3}">&nbsp;复产率&nbsp;</el-button>
      <el-button round size="mini" @click="btnNum = 1" :class="{active: btnNum == 1}">&nbsp;复工电力指数&nbsp;</el-button>
		</div>

  </div>
</template>

<script>
export default {
  name: 'industry',
  data () {
    return {
    	mychart: '',
    	btnNum: 2,
      color: ['#000','#ffff00', '#f39800',  '#eb6100', '#ff0014', '#e40071', '#601986', '#1d2088', '#00479d', '#00a0e9', '#71ff45', '#8fc31f', '#22ac38', '#0c87ba', '#3a00ff', '#20c1d5', '#053549', '#ff353a', '#ff8b5c', '#ff105f', '#920783', '#ff9300','#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
    }
  },
  created () {

  },
  mounted () {
    this.init()
  },
  methods: {
  	init () {
  		this.mychart = this.$echarts.init(document.getElementById('yindustry'))
  		
      let x = ['全市','蔡蔡甸蔡甸蔡甸蔡甸甸','东东西湖东西湖东西湖西湖','东新','汉口','汉南','汉阳','黄陂','江夏','开发区','武昌']

      let y = [213, 231, 89, 321, 74, 238, 129, 21, 31, 83, 123]
      let arr = []

      x.map((item, index) => {
        arr.push({
          name: item,
            data: [y[index]] || [0],
            type: 'bar',
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  position: 'top',
                  formatter: '{c}'
                }
              }
            }
        })
      })

  		let option = {
        color: this.color,
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          bottom: 0,
          icon: 'circle',
          itemWidth: 12,
          itemHeight: 12,
          textStyle: {
            fontSize: 12,
          },
          data: x
        },
        grid: {
          left: '3%',
          right: '40',
          top: '30',
          bottom: '70',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: ['']
        },
        yAxis: {
          type: 'value'
        },
        series: arr
      }

      this.mychart.setOption(option)
  	}

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
}
</style>
