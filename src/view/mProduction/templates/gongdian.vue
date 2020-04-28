<template>
  <div class="recoveryCondition itemBox">
		<div class="itemTitle">
			各供电区域复工复产情况
			<el-button round size="mini" class="titleBtn">&nbsp;重置&nbsp;</el-button>
		</div>
		<div class="recoveryCondition-area">
			<div class="btn-top" :class="{active: isActive(0)}" @click="toggleShow(0)" style="font-weight:bold;">全市></div>
			<div class="btn-top" :class="{active: isActive(1)}" @click="toggleShow(1)"><span style="background-color: #ffff00;"></span>蔡甸</div>
			<div class="btn-top" :class="{active: isActive(2)}" @click="toggleShow(2)"><span style="background-color: #f39800;"></span>东西湖</div>
			<div class="btn-top" :class="{active: isActive(3)}" @click="toggleShow(3)"><span style="background-color: #eb6100;"></span>东新</div>
			<div class="btn-top" :class="{active: isActive(4)}" @click="toggleShow(4)"><span style="background-color: #ff0014;"></span>汉口</div>
			<div class="btn-top" :class="{active: isActive(5)}" @click="toggleShow(5)"><span style="background-color: #e40071;"></span>汉南</div>
			<div class="btn-top" :class="{active: isActive(6)}" @click="toggleShow(6)"><span style="background-color: #601986;"></span>汉阳</div>
			<div class="btn-top" :class="{active: isActive(7)}" @click="toggleShow(7)"><span style="background-color: #1d2088;"></span>黄陂</div>
			<div class="btn-top" :class="{active: isActive(8)}" @click="toggleShow(8)"><span style="background-color: #00479d;"></span>江夏</div>
			<div class="btn-top" :class="{active: isActive(9)}" @click="toggleShow(9)"><span style="background-color: #00a0e9;"></span>开发区</div>
			<div class="btn-top" :class="{active: isActive(10)}" @click="toggleShow(10)"><span style="background-color: #71ff45;"></span>武昌</div>
			<div class="btn-top" :class="{active: isActive(11)}" @click="toggleShow(11)"><span style="background-color: #8fc31f;"></span>新洲</div>
		</div>
		<div id="recoveryCondition" style="width: 100%; height:200px;"></div>
		<div class="btn-bottom">
			<el-button round size="mini" @click="btnNum = 1" :class="{active: btnNum == 1}">&nbsp;复工电力指数&nbsp;</el-button>
			<el-button round size="mini" @click="btnNum = 2" :class="{active: btnNum == 2}">&nbsp;复工率&nbsp;</el-button>
			<el-button round size="mini" @click="btnNum = 3" :class="{active: btnNum == 3}">&nbsp;重置&nbsp;</el-button>
		</div>

  </div>
</template>

<script>
export default {
  name: 'recoveryCondition',
  data () {
    return {
    	mychart: '',
    	showArr: [0,1,2,3,4,5,6,7,8,9,10,11],
    	color: ['#000','#ffff00', '#f39800',  '#eb6100', '#ff0014', '#e40071', '#601986', '#1d2088', '#00479d', '#00a0e9', '#71ff45', '#8fc31f', '#22ac38', '#0c87ba', '#3a00ff', '#20c1d5', '#053549', '#ff353a', '#ff8b5c', '#ff105f', '#920783', '#ff9300','#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
    	btnNum: 1,

    }
  },
  created () {

  },
  mounted () {
    	this.init()
  },
  methods: {
  	toggleShow(n) {
  		let num = this.showArr.indexOf(n);

  		if (num == -1) {
  			this.showArr.push(n);
  		}else{
  			this.showArr.splice(num,1);
  		}
  	},
  	isActive(n){
  		let num = this.showArr.indexOf(n);

  		if (num == -1) {
				return false
	  	}else{
	  		return true
  		}
  	},

  	init () {
  		this.mychart = this.$echarts.init(document.getElementById('recoveryCondition'))
  		
  		let option = {
  			color: this.color,
        tooltip: {
          trigger: 'axis'
        },
        // legend: {
        // 	show: false,
        //   data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
        // },
        grid: {
          left: '3%',
          right: '4%',
          top: '30',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          axisTick: {
        		show: false
        	},
          boundaryGap: false,
          data: ['3.1', '3.2', '3.3', '3.4', '3.5', '3.6', '3.7']
        },
        yAxis: {
        	axisLine: {
        		show: false
        	},
        	axisTick: {
        		show: false
        	},
        	axisLabel:{
            formatter(val){
               return val+'%'
            }
        	},
          type: 'value'
        },
        series: [
          {
            name: '全市',
            symbol: 'none',
            type: 'line',
            lineStyle: {
            	width: 4,
            },
            z: 3,
            data: [20, 32, 10, 14, 90, 23, 20]
          },
          {
            name: '蔡甸',
            symbol: 'none',
            type: 'line',
            data: [22, 82, 11, 24, 90, 33, 10]
          },
         	{
            name: '东西湖',
            symbol: 'none',
            type: 'line',
            data: [12, 42, 17, 44, 9, 63, 10]
          },
          {
            name: '东新',
            symbol: 'none',
            type: 'line',
            data: [22, 32, 18, 24, 40, 33, 10]
          },
          {
            name: '汉口',
            symbol: 'none',
            type: 'line',
            data: [22, 82, 11, 24, 90, 33, 10]
          },
          {
            name: '汉南',
            symbol: 'none',
            type: 'line',
            data: [22, 82, 11, 24, 90, 33, 10]
          },
          {
            name: '汉阳',
            symbol: 'none',
            type: 'line',
            data: [22, 82, 11, 24, 90, 33, 10]
          },
          {
            name: '黄陂',
            symbol: 'none',
            type: 'line',
            data: [22, 82, 11, 24, 90, 33, 10]
          },
          {
            name: '江夏',
            symbol: 'none',
            type: 'line',
            data: [22, 82, 11, 24, 90, 33, 10]
          },
          {
            name: '开发区',
            symbol: 'none',
            type: 'line',
            data: [22, 82, 11, 24, 90, 33, 10]
          },
          {
            name: '武昌',
            symbol: 'none',
            type: 'line',
            data: [22, 82, 11, 24, 90, 33, 10]
          },
          {
            name: '新洲',
            symbol: 'none',
            type: 'line',
            data: [22, 82, 11, 24, 90, 33, 10]
          }
        ]
      }

      this.mychart.setOption(option)
  	}

  }
}
</script>

<style lang="scss" scoped>
.recoveryCondition {
	.titleBtn {
		float: right;
		margin-right: 10px;
		position: relative;
		top: -2px;
	}

	.recoveryCondition-area {
		margin-top: 10px;
		overflow: hidden;

		.btn-top {
			padding: 7px 13px;
			display: inline-block;
			background: #FAFAFA;
			margin-bottom: 2px;
			border-radius: 5px;
			width: calc(25% - 5px);
			text-align: center;
			box-sizing: border-box;

			&.active {
				background-color:#F4F9F8;
			}

			span {
				display: inline-block;
				width: 6px;
				height: 6px;
				margin-right: 3px;
			}

		}
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
