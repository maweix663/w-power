<template>
  <div style="margin: 0 0 10px 0" class="industry itemBox">
    <div class="changeBtn">
      <el-select v-model="value" size="mini" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </div>
		<div class="itemTitle">
			当日各供电区域指标排名
		</div>

		<div id="tindustry" style="width: 100%; height:250px; margin-top: 10px"></div>
		<div class="btn-bottom">
			<el-button round size="mini" @click="btnNum = 1" :class="{active: btnNum == 1}">&nbsp;复工电力指数&nbsp;</el-button>
			<el-button round size="mini" @click="btnNum = 2" :class="{active: btnNum == 2}">&nbsp;复工率&nbsp;</el-button>
			<el-button round size="mini" @click="btnNum = 3" :class="{active: btnNum == 3}">&nbsp;复产率&nbsp;</el-button>
		</div>

  </div>
</template>

<script>
export default {
  name: 'industry',
  data () {
    return {
    	mychart: '',
    	btnNum: 1,

      value: '',
      options: [
        {
          value: '选项2',
          label: '双皮奶'
        }, 
        {
          value: '选项3',
          label: '蚵仔煎'
        }
      ]
    }
  },
  created () {

  },
  mounted () {
    this.init()
  },
  methods: {
  	init () {
  		this.mychart = this.$echarts.init(document.getElementById('tindustry'))
  		
  		let option = {
          color: '#4f8985',
          xAxis: {
            type: 'value'
          },
          yAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          },
          series: [
            {
              data: [120, 200, 150, 80, 70, 110, 130],
              type: 'bar',
              markLine: {
                data: [
                  {
                    type: 'average',
                    name: '平均数',
                    label: {
                      normal: {
                        position: 'end',
                        formatter: '{b}: {c}'
                      }
                    }
                  }
                ]
              }
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
