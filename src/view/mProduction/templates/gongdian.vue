<template>
  <div class="recoveryCondition itemBox">
    <div class="itemTitle">
      各供电区域复工复产情况
      <el-button round size="mini" class="titleBtn" @click="reset">&nbsp;重置&nbsp;</el-button>
    </div>
    <div class="recoveryCondition-area">
      <div class="btn-top" :class="{active: isActive('全市')}" @click="toggleShow('全市')" style="font-weight:bold;">全市></div>
      <div class="btn-top" v-for="(item,i) in areaList" v-if="i!=0" :class="{active: isActive(item)}" @click="toggleShow(item)"><span :style="{backgroundColor: colorList[i], fontWeight: (item=='全市'?'bold':'normal')}"></span>{{ item }}</div>
    </div>
    <div id="recoveryCondition" style="width: 100%; height:200px;" v-loading="loading"></div>
    <div class="btn-bottom">
      <el-button round size="mini" @click="changeBtnNum(2)" :class="{active: btnNum == 2}">&nbsp;复工电力指数&nbsp;</el-button>
      <el-button round size="mini" @click="changeBtnNum(0)" :class="{active: btnNum == 0}">&nbsp;复工率&nbsp;</el-button>
      <el-button round size="mini" @click="changeBtnNum(1)" :class="{active: btnNum == 1}">&nbsp;复产率&nbsp;</el-button>
    </div>

  </div>
</template>

<script>
export default {
  name: 'recoveryCondition',
  props: {
    typeId: {
      type: String
    }
  },
  data () {
    return {
      loading: false,
      areaList: [],
      enterpriseId: '',

      mychart: '',
      showArea: [],
      allData: [], //所有处理好的数据
      colorList: ['#000000','#ffff00', '#f39800',  '#eb6100', '#ff0014', '#e40071', '#601986', '#1d2088', '#00479d', '#00a0e9', '#71ff45', '#8fc31f', '#22ac38', '#0c87ba', '#3a00ff', '#20c1d5', '#053549', '#ff353a', '#ff8b5c', '#ff105f', '#920783', '#ff9300','#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
      showColor: [],
      btnNum: 2,  //复工类型 默认0(0=复工率，1=复产率，2=复工电力指数)

    }
  },
  watch: {
    typeId (val) {
      this.enterpriseId = val;
      this.getAreaList();  //获取区域列表（复工复产情况区域参数）
    }
  },
  created () {
    //this.getReWorkCaseData();  //复工复产情况
  },
  mounted () {
    //this.init()
  },
  methods: {
    //获取区域列表
    getAreaList() {
      let params = {
        enterpriseId: this.enterpriseId
      };
      this.http.post('/resumeWork/listDivision', params)
        .then(res => {
          this.areaList = ['全市'].concat(res.data || []);
          this.areaList.forEach((item,i)=>{
            this.showArea.push(item);
          })

          this.getEchartData()
        })
        .catch(err => {})
    },
    reset(){
      this.btnNum = 2;
      this.showArea = []
      this.areaList.forEach((item,i)=>{
        this.showArea.push(item);
      })

      this.getEchartData()
    },
    
    toggleShow(str) {
      let num = this.showArea.indexOf(str);

      if (num == -1) {
        this.showArea.push(str);
      }else{
        this.showArea.splice(num,1);
      }

      this.getEchartData1();
    },
    isActive(str){
      let num = this.showArea.indexOf(str);
      if (num == -1) {
        return false
      }else{
        return true
      }
    },
    changeBtnNum(n){
      this.btnNum = n;
      this.showArea = []
      this.areaList.forEach((item,i)=>{
        this.showArea.push(item);
      })
      this.getEchartData();
    },

    getEchartData() {
      if (this.showArea.length == 0) {
        this.init([], []);
        return false
      }

      this.loading = true;

      let list = [];
      this.showArea.forEach(item => {
        list.push(this.getReWorkCaseData(item));
      })  

      Promise.all(list).then(arr => {
        this.allData = arr
        this.handleData(arr)
      })
    },

    getEchartData1(){
      if (this.showArea.length == 0) {
        this.init([], []);
        return false
      }

      this.loading = true;

      let arr = [];
      this.showArea.forEach(item=>{
        let n = this.areaList.indexOf(item);

        arr.push(this.allData[n])
      })

      this.handleData(arr)
    },

    //复工复产情况
    getReWorkCaseData(str) {
      return new Promise(resolve => {
        let params = {
          division: str == '全市' ? '' : str,
          enterpriseId: this.enterpriseId,
          reWorkType: this.btnNum
        };
        this.http.post('/resumeWork/getReWorkCase', params)
          .then(res => {
            resolve(res.data)
          })
          .catch(err => {})
      })  
    },

    handleData(arr){
      console.log(1111,arr)
      let x = [];
      arr[0].forEach(item=>{
        x.push(item.date);
      })

      console.log(2222,x)

      this.showColor = [];

      let data = [];
      this.showArea.forEach((item,i)=>{
        let y = [];
        arr[i].map(item1=>{
          y.push(Number(item1.value));
        })

        let num = this.areaList.indexOf(item);
        this.showColor.push(this.colorList[num])

        if(item == '全市'){
          data.push({
            name: '全市',
            symbol: 'none',
            type: 'line',
            lineStyle: {
              width: 4,
            },
            z: 3,
            data: y
          })
        }else{
          data.push({
            name: item,
            symbol: 'none',
            type: 'line',
            data: y
          },)
        }
      })

      console.log(3333, data)
      this.init(x, data);
    },

    init(x, data) {
      this.mychart = this.$echarts.init(document.getElementById('recoveryCondition'))
      
      let option = {
        color: this.showColor,
        tooltip: {
          trigger: 'axis'
        },
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
          data: x
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
        series: data
      }

      this.mychart.setOption(option, true);
      this.loading = false;
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
    padding: 10px 20px 0;

    .active {
      color: #fff;
      background: #3f6f6b;
    }
  }
}
</style>
