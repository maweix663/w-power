<template>
  <div class="industry itemBox">
    <div class="itemTitle">
      各行业类别复工复产情况
      <el-select v-model="selectValue" placeholder="请选择" class="top-select" @change="changeArea">
        <el-option
          v-for="(item, index) in areaList"
          :key="index"
          :label="item"
          :value="item">
        </el-option>
      </el-select>
    </div>

    <div id="industry" style="width: 100%; height:250px; margin-top: 10px" v-loading="loading"></div>
    <div class="text">
      <span v-for="(item, index) in industryOneArr" @click="changeNum(item, index)" :key="item"><i :style="`background: ${color[index]};`"></i>{{ item }}</span>
    </div>
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

      industryOne: '',
      industryOneArr: [],

      color: ['#4e79a7', '#a0cbe8', '#f28e2b', '#ffbe7d', '#59a14f', '#8cd17d', '#b6992d', '#f1ce63', '#499894', '#86bcb6', '#e15759'],
      btnNum: 0,
    }
  },
  watch: {
    typeId (val) {
      this.enterpriseId = val;
      this.btnNum = 0;
      this.industryOne = '';
      this.getAreaList();  //获取区域列表（复工复产情况区域参数）
      this.getIndustryPowerCase('全市', this.color);  //获取行业分类    
    }
  },
  created () {
    this.getListIndustry()
  },
  mounted () {

  },
  methods: {
    // 获取企业类别
    getListIndustry () {
      this.http.post('/resumeWork/listIndustry', {
        enterpriseId: this.typeId
      })
        .then(res => {
          this.industryOneArr = res.data        
        })
        .catch(err => {})
    },

    //获取区域列表
    getAreaList() {
      let params = {
        enterpriseId: this.enterpriseId
      };
      this.http.post('/resumeWork/listDivision', params)
      .then(res => {
        let data = res.data || [];
        this.areaList = ['全市'];

        data.forEach((item,i)=>{
          this.areaList.push(item);
        })
      })
      .catch(err => {})
    },

    //切换区域
    changeArea() {
      this.industryOne = '';
      this.getIndustryPowerCase(this.selectValue, this.color);
    },

    // 获取行业类型
    changeNum (str, index) {
      this.industryOne = str;
      this.getIndustryPowerCase(this.selectValue, [this.color[index]]);  
    },

    //切换底部按钮状态
    changeBtnNum(n){
      this.btnNum = n;
      this.industryOne = '';
      this.getIndustryPowerCase('全市', this.color); 
    },

    //(新界面)各行业类别复工复产情况
    getIndustryPowerCase(str, color) {
      this.loading = true;

      let params = {
        division: str == '全市' ? '' : str,
        enterpriseId: this.enterpriseId,
        industryOne: this.industryOne,
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

        this.init(legend, x, series, color)

      })
      .catch(err => {})
    },

    init(legend, x, series, color) {
      this.mychart = this.$echarts.init(document.getElementById('industry'))
      
      let option = {
        color: color,
        tooltip: {
          trigger: 'axis'
        },
        // legend: {
        //   bottom: 0,
        //   icon: 'circle',
        //   itemWidth: 12,
        //   itemHeight: 12,
        //   textStyle: {
        //     fontSize: 12,
        //   },
        //   data: legend,
        // },
        grid: {
          left: '3%',
          right: '40',
          top: '30',
          bottom: '10',
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
