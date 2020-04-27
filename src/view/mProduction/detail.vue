<template>
  <div class="mProduction" >
    <div class="header">
      <h3 class="title">明细信息</h3>
    </div>

    <!--展示区-->
    <div class="main">
      <el-table
        :data="tableData"
        style="width: 100%"
        :default-sort = "{prop: 'date', order: 'descending'}"
        >
        <el-table-column
          v-for="(v, i) in columns"
          :key="i" 
          :label="v.label" 
          :prop="v.prop" 
          :width="v.width" 
          :min-width="v.minWidth" 
          :align="v.align || 'center'" 
          :show-overflow-tooltip="!v.noTooltip"
          :sortable="v.sortable"
          width="180">
          <template scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!--返回武汉按钮-->
    <div class="typeBtnBox" @click="returnBtn">
      <p><i class="el-icon-arrow-left"></i>返回</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "work",
  components: {
  },
  data() {
    return {
      // 标题
      columns: [
        {
          prop: 'index',
          label: '序号',
          width: 60
        },
        {
          prop: 'data',
          label: '日期',
          sortable: true,
          width: 60
        },
        {
          prop: 'a',
          label: '市',
          sortable: true,
          width: 60
        },
        {
          prop: 'b',
          label: '县',
          sortable: true,
          width: 60
        },
        {
          prop: 'data',
          label: '供电所',
          width: 60
        },
        {
          prop: 'data',
          label: '户号',
          width: 100
        },
        {
          prop: 'data',
          label: '户名',
          width: 100
        },
        {
          prop: 'data',
          label: '当日电量',
          width: 60
        },
        {
          prop: 'data',
          label: '基准电量',
          width: 60
        },
        {
          prop: 'data',
          label: '复工电量比例',
          width: 60
        },
        {
          prop: 'data',
          label: '是否复工',
          width: 60
        },
        {
          prop: 'data',
          label: '行业分类',
          width: 60
        }
      ],

      tableData: [
        {
          data: '111'
        },
        {
          data: '222'
        }
      ]
    }
  },
  created() {

  },
  mounted: function () {

  },
  methods: {
    // 返回武汉按钮
    returnBtn() {
      this.$router.push({
        path: '/mProduction'
      });
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

    }

    /*展示区*/
    .main {
      height: calc(100% - 90px);
      overflow: auto;
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
