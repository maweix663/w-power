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
      <!-- tab1 -->
      <div class="stepOne">
        <indicators :indicatorsArr="indicatorsArr" /> 
        <gongdian :typeId="typeId"></gongdian>
        <industry :typeId="typeId" style="margin-bottom:10px;"></industry>
        <cylinderx :typeId="typeId"/>
        <cylindery :typeId="typeId" />
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
            width: ''
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
            width: ''
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
        path: '/homeWuhan'
      });
    },

    // tabs 切换
    handleClick (tab, event) {
      this.typeId = tab.$attrs.value
      this.getVitalData()
      this.getTableWorksData()
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
      width: calc(100% - 40px);
      height: calc(100% - 223px);
      overflow: auto;
      padding: 100px 20px 20px 20px;
      overflow-y: auto;

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

  .el-tabs__active-bar {
    background-color: #fff;
  }

  .el-tabs__nav-wrap::after {
    background-color: transparent;
  }

  .el-tabs__nav-next, .el-tabs__nav-prev{
    color: #fff;
  }
}
</style>
