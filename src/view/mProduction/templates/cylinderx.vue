<template>
  <div style="margin: 10px 0 10px 0" class="cylinderx itemBox">
    <el-select v-model="value" size="small" class="top-select" placeholder="请选择" @change="getCountyRanking">
      <el-option
        v-for="item in options"
        :key="item"
        :label="item"
        :value="item">
      </el-option>
    </el-select>
		<div class="itemTitle">
			当日各供电区域指标排名
		</div>

		<div id="tindustry" style="width: 100%; height:300px; margin-top: 10px" v-loading="loading"></div>
		<div class="btn-bottom">
			<el-button round size="mini" @click="changeBtnNum(0)" :class="{active: btnNum == 0}">&nbsp;复工电力指数&nbsp;</el-button>
			<el-button round size="mini" @click="changeBtnNum(1)" :class="{active: btnNum == 1}">&nbsp;复工率&nbsp;</el-button>
			<el-button round size="mini" @click="changeBtnNum(2)" :class="{active: btnNum == 2}">&nbsp;复产率&nbsp;</el-button>
		</div>

  </div>
</template>

<script>
export default {
  name: 'cylinderx',
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
    	btnNum: 0,

      value: '',
      options: []
    }
  },
  watch: {
    typeId (val) {
      this.enterpriseId = val;
      this.btnNum = 0;
      this.getListCounty();
    }
  },
  created () {

  },
  mounted () {
    // this.init()
  },
  methods: {
    //供电公司列表（指标排名参数）
    getListCounty() {
      let params = {
        enterpriseId: this.enterpriseId
      };
      this.http.post('/resumeWork/listCounty', params)
      .then(res => {
        let data = res.data || [];
        this.options = ['武汉供电公司'].concat(data);
        this.value = '武汉供电公司';

        this.getCountyRanking();
      })
      .catch(err => {})
    },

    //切换底部按钮状态
    changeBtnNum(n){
      this.btnNum = n;
      this.getCountyRanking();
    },

    //(新界面)当日各供电区域指标排名
    getCountyRanking() {
      this.loading = true;

      let params = {
        county: this.value=='武汉供电公司'?'' : this.value,
        enterpriseId: this.enterpriseId,
        status: this.btnNum
      };
      this.http.post('/resumeWork/countyRanking', params)
      .then(res => {
        let data = res.data || [];

        let x = [];
        let data1 = [];
        data.data.forEach(item=>{
          x.push(item.name);
          data1.push(Number(item.percent));
        })

        this.init(x, data1, data.avg);
      })
      .catch(err => {})
    },


  	init(x, data, avg) {
  		this.mychart = this.$echarts.init(document.getElementById('tindustry'))
  		
  		let option = {
          color: '#4f8985',
          tooltip: { // 提示框组件
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
              type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          grid: {
            left: '3%',
            right: 10,
            bottom: 10,
            top: 30,
            containLabel: true,
            show: false // 网格边框是否显示，上和右边框 
          },
          xAxis: {
            type: 'value',
            axisTick: {
              show: false
            },
          },
          yAxis: {
            type: 'category',
            axisTick: {
              show: false
            },
            data: x
          },
          series: [
            {
              data: data,
              type: 'bar',
              markLine: {
                symbol: 'none',
                data: [
                  {
                    type: 'average',
                    name: '平均值',
                    symbol: 'none',
                    label: {
                      normal: {
                        position: 'end',
                        // formatter: '{b}: {c}'
                        formatter: '{b}: ' + avg
                      }
                    }
                  }
                ]
              }
            }
          ]
      }

      this.mychart.setOption(option, true);

      this.loading = true;
  	}

  }
}
</script>

<style lang="scss" scoped>
.cylinderx {
  .top-select {
    position: absolute;
    top: 12px;
    right: 10px;

    /deep/ .el-input__inner {
      text-align: right;
      padding-left: 0;
      border: none;
      outline: none;
      width: 120px;
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
