<template>
  <div class="mProduction" >
    <div class="header">
      <h3 class="title">复工复产</h3>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane v-for="(item, index) in lists.types" :label="item.enterpriseType" :value="item.id" :name="item.name" :key="index"></el-tab-pane>
      </el-tabs>
    </div>

    <!--展示区-->
    <div class="main">
      <img class="banner" src="/static/img/work/headBg.png">
      <!-- tab1 -->
      <div class="stepOne">
        <indicators :indicatorsArr="indicatorsArr" :headTime="headTime" /> 
        <gongdian :typeId="typeId"></gongdian>
        <industry :typeId="typeId" style="margin-bottom:10px;" v-show="typeId != 'c075abf09b2a475fa3451d2916d1a78f' && typeId != '019afc55f0354470b2413b4992050b1c'"></industry>
        <cylinderx :typeId="typeId"/>
        <cylindery :typeId="typeId" v-show="typeId != 'c075abf09b2a475fa3451d2916d1a78f' && typeId != '019afc55f0354470b2413b4992050b1c'"/>
        <tableTop10  :typeId="typeId" v-show="typeId != '8890d5f9f3324bd89dfc0213c6b4a7fd'"/>
        <tables :objDetail="works" :tableData="tableWorksData" />
        <!-- <tables :objDetail="works" :typeId="typeId" /> -->
        <tables :objDetail="workPro" :typeId="typeId" />
        <search :typeId="typeId" />
      </div>
    </div>

    <!--返回武汉按钮-->
    <div class="typeBtnBox" @click="returnBtn">
      <p>防疫保电 ></p>
    </div>

  </div>
</template>

<script>
// tab1
import indicators from './templates/indicators'
import gongdian from './templates/gongdian.vue'
import industry from './templates/industry.vue'
import cylinderx from './templates/cylinderx'
import cylindery from './templates/cylindery'
import tableTop10 from './templates/tableTop10'
import tables from './templates/table'
import search from './templates/search'
export default {
  name: "work",
  components: {
    indicators,
    gongdian,
    industry,
    cylinderx,
    cylindery,
    search,
    tableTop10,
    tables,
  },
  data() {
    return {
      // 标题
      activeName: '0',

      lists: {
        types: []
      },

      typeId: '',

      // 关键指标
      indicatorsArr: [],
      headTime: '',
      works: {
        name: '复工电力指数周增幅',
        columns: [
          {
            prop: 'date',
            label: '日期',
            width: ''
          },
          {
            prop: 'powerIndex',
            label: '复工电力指数',
            width: ''
          },
          {
            prop: 'weekRise',
            label: '周增长值',
            width: ''
          },
          {
            prop: 'weekRiseRate',
            label: '周增幅',
            width: ''
          },
        ]
      },
      tableWorksData: [],
      workPro: {
        name: '复工复产情况',
        columns: [
          {
            prop: 'name',
            label: '供电区域',
            width: '',
            fixed: 'left'
          },
          {
            prop: 'count',
            label: '户数',
            width: ''
          },
          {
            prop: 'reWork',
            label: '已复工企业户数',
            width: ''
          },
          {
            prop: 'reWorkRate',
            label: '复工率',
            width: ''
          },
          {
            prop: 'electricitySum',
            label: '当日电量',
            width: '150'
          },
          {
            prop: 'refRate',
            label: '复产率',
            width: ''
          },
          {
            prop: 'powerIndex',
            label: '复工电力指数',
            width: ''
          }
        ],
        search: true
      }
    }
  },
  created() {
  },
  mounted: function () {
    this.getTabsData()
  },
  methods: {
    // 返回武汉按钮
    returnBtn() {
      this.$router.push({
        path: '/whHomeMove'
      });
    },

    // tabs 切换
    handleClick (tab, event) {
      this.typeId = tab.$attrs.value
      this.getVitalData()
      this.getTableWorksData()
      this.getHeadData()
    },

    // 获取企业tabs
    getTabsData () {
      let params = {}
      this.http.post('/resumeWork/listEnterprise', params)
        .then(res => {
          this.lists.types = [].concat(res.data)

          this.lists.types.map((item, index) => {
            item.name = index + ''
          })
          
          this.typeId = this.lists.types[0].id

          this.getVitalData()
          this.getTableWorksData()
          this.getHeadData()
        })
        .catch(err => {})
    },

    // 关键指标数据
    getVitalData () {
      this.http.post('/resumeWork/getVitalData', {
        enterpriseId: this.typeId
      })
        .then(res => {
          this.indicatorsArr = res.data
        })
        .catch(err => {})
    },

    // 关键指标-时间
    getHeadData () {
      this.http.post('/resumeWork/getDate', {
        enterpriseId: this.typeId
      })
        .then(res => {
          this.headTime = res.data
        })
        .catch(err => {})
    },

    // 获取 复工电力周增幅 数据
    getTableWorksData (params) {
      this.http.post('/resumeWork/reWorkPowerRise', {
        enterpriseId: this.typeId
      })
        .then(res => {
          this.tableWorksData = res.data
          
        })
        .catch(err => {})
    },
  },
}
</script>


<style lang="scss" scoped>
  .mProduction {
    background: url("../../../static/img/bg.png") no-repeat;
    background-size: 100% 100%;
    width: 100%;
    height: 100%;
    

    

    /*标题区*/
    .header {
      width: 100%;
      padding: 0 10px;
      box-sizing: border-box;
      background: #4f8985;
      position: relative;
      h3 {
        width: 100%;
        text-align: center;
        color: #fff;
        font-size: 18px;
        line-height: 50px;
        margin: 0;
      }

      .upload {
        position: absolute;
        top: 5px;
        right: 10px;
        cursor: pointer;
        img {
          width: 20px;
          height: 20px;
        }
      }

    }

    /*展示区*/
    .main {
      z-index: 10;
      width: calc(100% - 40px);
      height: calc(100% - 273px);
      overflow: auto;
      padding: 150px 20px 20px 20px;
      overflow-y: auto;
      position: relative;

      .banner {
        position: absolute;
        width: 100%;
        top: 0;
        left: 0;
      }

      /deep/ .itemBox {
        margin-top: 10px;
        padding: 20px 10px;
        background-color: #fff;
        border-radius: 5px;
        position: relative;

        .itemTitle {
          color: #3f6f6b;
          font-weight: bold;
          font-size: 16px;
          border-left: 4px solid #3f6f6b;
          padding-left: 10px;
        }
      }
    }

    /*返回武汉按钮*/
    .typeBtnBox {
      width: 100px;
      height: 28px;
      position: absolute;
      left: 20px;
      top: 12px;
      cursor: pointer;
      p {
        line-height: 28px;
        color: #fff;
        font-size: 14px;
      }
    }

  }
</style>
<style lang="scss">
.mProduction {
  .el-tabs__header {
    margin: 0;
  }

  .el-tabs__item {
    color: #fff;
  }

  .el-tabs__item.is-active {
    color: #fff;
  }

  .el-tabs__active-bar {
    background-color: #fff;
    height: 4px;
  }
  .el-tabs__nav-scroll {
    flex-grow: 1;
    overflow-x: auto;
  }

  .el-tabs__nav-next,.el-tabs__nav-prev {
    display: none;
  }

  .el-tabs__nav-wrap::after {
    background-color: transparent;
  }

  .el-tabs__nav-next, .el-tabs__nav-prev{
    color: #fff;
  }

  .el-table__header {
    th>.cell {
      font-size: 10px;
      padding: 0 2px;
    }
  }

  .el-table__body {
    .cell {
      font-size: 10px;
    }
  }
}
</style>
