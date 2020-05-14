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
    <div id="industry" style="width: 100%; height:200px;" v-loading="loading"></div>
    <div class="text">
      <span v-for="(item, index) in allIndustry" @click="toggleShow(item)" :key="item" :class="{active: isActive(item)}"><i :style="`background: ${color[index]};`"></i>{{ item }}</span>
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

      allIndustry: [],
      activeIndustry: [],
      showIndustry: [],

      allData: [], //所有处理好的数据

      color: ['#4e79a7', '#a0cbe8', '#f28e2b', '#ffbe7d', '#59a14f', '#8cd17d', '#b6992d', '#f1ce63', '#499894', '#86bcb6', '#e15759'],
      showColor: [],
      btnNum: 0,

    }
  },
  watch: {
    typeId (val) {
      this.enterpriseId = val;
      this.btnNum = 0;
      this.getAreaList();  //获取区域列表（复工复产情况区域参数）
      this.getListIndustry();
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
        this.areaList = ['全市'];

        data.forEach((item,i)=>{
          this.areaList.push(item);
        })
      })
      .catch(err => {})
    },

    // 获取企业类别
    getListIndustry () {
      this.http.post('/resumeWork/listIndustry', {
        enterpriseId: this.enterpriseId
      })
        .then(res => {
          this.allIndustry = res.data || [];       
          this.showIndustry = res.data || [];  
          this.activeIndustry = [];  

          this.getEchartData();  //获取
        })
        .catch(err => {})
    },

    getEchartData() {
      if (this.showIndustry.length == 0) {
        this.init([], []);
        return false
      }

      this.loading = true;

      let list = [];
      this.showIndustry.forEach(item => {
        list.push(this.getIndustryPowerCase(item));
      })  
      Promise.all(list).then(arr => {
        this.allData = arr
        this.handleData();
      })
    },

    //(新界面)各行业类别复工复产情况
    getIndustryPowerCase(str) {
      return new Promise(resolve => {
        let params = {
          division: this.selectValue == '全市' ? '' : this.selectValue,
          enterpriseId: this.enterpriseId,
          industryOne: str,
          status: this.btnNum
        };
        this.http.post('/resumeWork/industryPowerCase', params)
        .then(res => {
          let data = res.data || [];
          resolve(data)
        })
        .catch(err => {})
      })
    },

    //切换区域
    changeArea() {
      this.btnNum = 0;
      this.getListIndustry();
    },

    handleData() {
      //showIndustry   allData
      this.showColor = [];
      let legend = [];
      let x = [];
      let series = [];

      this.showIndustry.forEach(item=>{
        let num = this.allIndustry.indexOf(item);  // 获取当前展示项index
        this.showColor.push(this.color[num]);

        legend.push(this.allData[num][0].industryOne);

        x = [];
        let arr = [];

        this.allData[num][0].list.forEach(item1=>{
          let d = item1.date.slice(4,8);
          let d1 = d.slice(0,2);
          let d2 = d.slice(2,4);
          x.push(Number(d1)+'.'+Number(d2));
          arr.push(Number(item1.value));
        })
        
        series.push(          {
          name: item.industryOne,
          symbol: 'none',
          type: 'line',
          data:arr
        })
      })

      this.init(legend, x, series, this.showColor)
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
          top: '35',
          bottom: '10',
          containLabel: true
        },
        xAxis: {
          name: '日期',
          type: 'category',
          axisLabel: {
            interval: 0
          },
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
    },

    isActive(str){
      let num = this.activeIndustry.indexOf(str);
      if (num == -1) {
        return false
      }else{
        return true
      }
    },

    toggleShow(str) {
      let num = this.activeIndustry.indexOf(str);

      if (num == -1) {
        this.activeIndustry.push(str);
      }else{
        this.activeIndustry.splice(num,1);
      }

      this.showIndustry = [].concat(this.activeIndustry);

      this.handleData();
    },

    //切换底部按钮状态
    changeBtnNum(n){
      this.btnNum = n;
      this.getListIndustry();
    },

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
      background: #FAFAFA;
      margin-right: 3px;
      margin-bottom: 3px;

      &.active {
        background-color:#F4F9F8;

      }
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
