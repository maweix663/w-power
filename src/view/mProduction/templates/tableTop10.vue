<template>
  <div class="tableTop10" >
    <div class="box">
      <div class="head">
        {{ objDetail.name }}
        <p></p>

        <el-select v-model="selectValue" placeholder="请选择" class="top-select" @change="changeArea">
          <el-option
            v-for="(item, index) in industryOneArr"
            :key="index"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </div>

      <div class="body">
        <el-table
        :data="tableDatas"
        style="width: 100%"
        max-height="300"
        v-loading="loading"
        >
        <el-table-column
          v-for="(v, i) in objDetail.columns"
          :key="i" 
          :label="v.label" 
          :prop="v.prop" 
          :width="v.width" 
          :min-width="v.minWidth" 
          :fixed="v.fixed"
          :align="v.align || 'center'" 
          :show-overflow-tooltip="!v.noTooltip"
          :sortable="v.sortable">
          <!-- <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template> -->
        </el-table-column>
      </el-table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "tableTop10",
  props: {
    typeId: {
      type: String
    }
  },
  data() {
    return {
      loading: false,
      selectValue: '',
      industryOneArr: [],

      objDetail: {
        name: '行业复工电力指数TOP10',
        columns: [
          {
            prop: 'accountName',
            label: '户名',
            width: ''
          },
          {
            prop: 'electricity',
            label: '当日电量',
            width: ''
          },
          {
            prop: 'refElectricity',
            label: '基准电量',
            width: ''
          },
          {
            prop: 'refRate',
            label: '复产率',
            width: ''
          },
        ]
      },

      tableDatas: [],
    }
  },
  watch: {
    typeId (val) {
      if(val != ''){
        this.loading = true;
        this.getListIndustry();
      }
    },
  },
  created() {
    
    
  },
  mounted() {

  },
  methods: {
    // 行业分类列表（各行业类别复工电力指数行业参数）
    getListIndustry () {
      this.http.post('/resumeWork/listIndustry', {
        enterpriseId: this.typeId
      })
        .then(res => {
          this.industryOneArr = res.data || [];
          if (this.industryOneArr.length > 0) {
            this.selectValue = this.industryOneArr[0];
            this.changeArea();            
          }
        })
        .catch(err => {})
    },

    //行业复工电力指数TOP10
    changeArea() {
      this.loading = true;
      this.tableDatas = [];
      this.http.post('/resumeWork/industryTOP10', {
        enterpriseId: this.typeId,
        industry: this.selectValue
      })
        .then(res => {
          this.tableDatas = res.data || [];
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        })
    }

  },
}
</script>

<style lang="scss" scoped>
.tableTop10 {
  margin-bottom: 10px;

  .box {
    overflow: hidden;
    border-radius: 5px;

    .head {
      position: relative;
      line-height: 23px;
      font-size: 16px;
      background: #fff;
      color: #3f6f6b;
      font-weight: bold;
      padding: 20px 0 0 30px;
      font-weight: bold;

      p {
        position: absolute;
        width: 4px;
        height: 23px;
        left: 12px;
        top: 20px;
        background: #3f6f6b;
      }
    }

    .body {
      background: #fff;
      padding: 10px;
      box-sizing: border-box;
    }
  }

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

}
</style>
