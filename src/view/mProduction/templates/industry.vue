<template>
  <div class="industry itemBox">
		<div class="itemTitle">
			各行业类别复工复产情况
      <el-select v-model="selectValue" placeholder="请选择" class="top-select">
        <el-option
          v-for="item in areaList"
          :key="item"
          :label="item"
          :value="item">
        </el-option>
      </el-select>
		</div>

		<div id="industry" style="width: 100%; height:250px; margin-top: 10px"></div>
		<div class="btn-bottom">
			<el-button round size="mini" @click="btnNum = 1" :class="{active: btnNum == 1}">&nbsp;复工电力指数&nbsp;</el-button>
			<el-button round size="mini" @click="btnNum = 2" :class="{active: btnNum == 2}">&nbsp;复工率&nbsp;</el-button>
			<el-button round size="mini" @click="btnNum = 3" :class="{active: btnNum == 3}">&nbsp;重置&nbsp;</el-button>
		</div>

  </div>
</template>

<script>
export default {
  name: 'industry',
  data () {
    return {
    	mychart: '',
    	color: ['#000','#ffff00', '#f39800',  '#eb6100', '#ff0014', '#e40071', '#601986', '#1d2088', '#00479d', '#00a0e9', '#71ff45', '#8fc31f', '#22ac38', '#0c87ba', '#3a00ff', '#20c1d5', '#053549', '#ff353a', '#ff8b5c', '#ff105f', '#920783', '#ff9300','#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
    	btnNum: 1,

      areaList: ['全市'],
      selectValue: '全市'

    }
  },
  created () {
    this.getAreaList();  //获取区域列表（复工复产情况区域参数）


  },
  mounted () {
    this.init()
  },
  methods: {
    //获取区域列表
    getAreaList() {
      let params = {
        enterpriseId:'c725531a124043bc8127818a8f56d9e7'
      };
      this.http.post('/resumeWork/listDivision', params)
      .then(res => {
        let data = res.data || [];
        data.forEach((item,i)=>{
          this.areaList.push(item);
        })
      })
      .catch(err => {})
    },









  	init () {
  		this.mychart = this.$echarts.init(document.getElementById('industry'))
  		
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
          data: ['全市','蔡甸','东西湖','东新','汉口','汉南','汉阳','黄陂','江夏','开发区','武昌','新洲']
        },
        grid: {
          left: '3%',
          right: '40',
          top: '30',
          bottom: '70',
          containLabel: true
        },
        xAxis: {
          name: '日期',
          type: 'category',
          axisTick: {
        		show: false
        	},
          boundaryGap: false,
          data: ['3.1', '3.2', '3.3', '3.4', '3.5', '3.6', '3.7']
        },
        yAxis: {
          name: '指数',
        	axisLine: {
        		show: true
        	},
        	axisTick: {
        		show: false
        	},
        	axisLabel:{
            formatter(val){
               return val
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
.industry {
  .top-select {
    position: absolute;
    top: 12px;
    right: 10px;

    /deep/ .el-input__inner {
      text-align: right;
      padding-left: 0;
      border: none;
      outline: none;
      width: 100px;
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
