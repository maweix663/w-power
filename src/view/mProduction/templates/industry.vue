<template>
  <div class="industry itemBox">
		<div class="itemTitle">
			各行业类别复工复产情况
      <el-select v-model="selectValue" placeholder="请选择" class="top-select" @change="getIndustryPowerCase(selectValue)">
        <el-option
          v-for="item in areaList"
          :key="item"
          :label="item"
          :value="item">
        </el-option>
      </el-select>
		</div>

		<div id="industry" style="width: 100%; height:300px; margin-top: 10px" v-loading="loading"></div>
		<div class="btn-bottom">
			<el-button round size="mini"  @click="changeBtnNum(0)" :class="{active: btnNum == 0}">&nbsp;复工电力指数&nbsp;</el-button>
			<el-button round size="mini"  @click="changeBtnNum(1)" :class="{active: btnNum == 1}">&nbsp;复工率&nbsp;</el-button>
			<el-button round size="mini"  @click="changeBtnNum(2)" :class="{active: btnNum == 2}">&nbsp;复产率&nbsp;</el-button>
		</div>

  </div>
</template>

<script>
export default {
  name: 'industry',
  props: {     
    typeId: {
      type: String
    }
  },
  data () {
    return {
      loading: false,
      enterpriseId: '',

    	mychart: '',
      areaList: ['全市'],
      selectValue: '全市',

    	color: ['#ffff00', '#f39800',  '#eb6100', '#ff0014', '#e40071', '#601986', '#1d2088', '#00479d', '#00a0e9', '#71ff45', '#8fc31f', '#22ac38', '#0c87ba', '#3a00ff', '#20c1d5', '#053549', '#ff353a', '#ff8b5c', '#ff105f', '#920783', '#ff9300','#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
    	btnNum: 0,
    }
  },
  watch: {
    typeId (val) {
      this.enterpriseId = val;
      this.getAreaList();  //获取区域列表（复工复产情况区域参数）
      this.getIndustryPowerCase('全市');  //获取行业分类    
    }
  },
  created () {

  },
  mounted () {

  },
  methods: {
    //获取区域列表
    getAreaList() {
      let params = {
        enterpriseId: this.enterpriseId
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

    //切换底部按钮状态
    changeBtnNum(n){
      this.btnNum = n;
      this.getIndustryPowerCase('全市');  //获取行业分类
    },

    //(新界面)各行业类别复工复产情况
    getIndustryPowerCase(str) {
      this.loading = true;

      let params = {
        division: str == '全市' ? '' : str,
        enterpriseId: this.enterpriseId,
        industryOne: '',
        status: this.btnNum
      };
      this.http.post('/resumeWork/industryPowerCase', params)
      .then(res => {
        let data = res.data || [];

        let legend = [];
        let x = [];
        let series = [];

        data.forEach(item=>{
          legend.push(item.industryOne);

          x = [];
          let arr = [];
          item.list.forEach(item1=>{
            x.push(item1.date);
            arr.push(Number(item1.value));
          })

          series.push(          {
            name: item.industryOne,
            symbol: 'none',
            type: 'line',
            data:arr
          })
        })

        this.init(legend, x, series)

      })
      .catch(err => {})
    },

  	init (legend, x, series) {
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
          data: legend,
        },
        grid: {
          left: '3%',
          right: '40',
          top: '30',
          bottom: '110',
          containLabel: true
        },
        xAxis: {
          name: '日期',
          type: 'category',
          axisTick: {
        		show: false
        	},
          boundaryGap: false,
          data: x        },
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
        series: series
      }

      this.mychart.setOption(option,true)

      this.loading = false;
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
		padding: 10px 20px 0;

		.active {
			color: #fff;
			background: #3f6f6b;
		}
	}
}
</style>
