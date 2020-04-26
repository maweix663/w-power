<template>
  <div class="containerWorkSearchMove">
    <!--标题头-->
    <div class="header">
      <div class="ret" @click="retPage">
        <img src="../../../static/img/move/ret.png" alt="">
        <span>返回</span>
      </div>
      <div class="title">明细信息</div>
    </div>

    <!--明细-->
    <div class="searchDataListBox" v-loading="tableLoading">
      <el-table :data="searchDataList" stripe height="100%" style="width: 100%;">
        <el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
        <el-table-column prop="dateTime" label="日期" sortable align="center" width="120"></el-table-column>
        <el-table-column prop="city" label="市" sortable align="center" width="120"></el-table-column>
        <el-table-column prop="county" label="县" sortable align="center" width="120"></el-table-column>
        <el-table-column prop="powerStation" label="所" sortable align="center" width="180"></el-table-column>

        <el-table-column prop="accountNo" label="户号" sortable align="center" width="100"></el-table-column>
        <el-table-column prop="accountName" label="户名" sortable align="center" width="300"></el-table-column>
        <el-table-column prop="electricity" label="当日电量" sortable align="center" width="100"></el-table-column>
        <el-table-column prop="refElectricity" label="基准电量" sortable align="center" width="100"></el-table-column>
        <el-table-column prop="reElectricityPer" label="复工电量比例" sortable align="center" width="140"></el-table-column>

        <el-table-column prop="reWork" label="是否复工" sortable align="center" width="100"></el-table-column>
        <el-table-column prop="industry" label="行业分类" sortable align="center" width="260"></el-table-column>
        <el-table-column prop="industryOne" label="行业一级分类" sortable align="center" width="140"></el-table-column>
        <el-table-column prop="oneSort" label="行业一级分类排序" sortable align="center" width="160"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  export default {
    name: "workSearch",
    data() {
      return {
        tableLoading: true,
        enterpriseId: '',
        county: '',
        powerStation: '',
        time: '',
        industry: '',

        searchDataList: [],
      }
    },
    created() {
      // 条件
      this.enterpriseId = this.$route.query.enterpriseId;
      this.county = this.$route.query.county;
      this.powerStation = this.$route.query.powerStation;
      this.time = this.$route.query.time;
      this.industry = this.$route.query.industry;
      // 明细搜索
      this.searchData();
    },
    mounted: function () {

    },
    methods: {
      // 返回
      retPage() {
        this.$router.push({
          path: '/workMove',
        });
      },

      // 明细搜索
      searchData() {
        this.tableLoading = true;
        let params = {
          showLoading: false,
          enterpriseId: this.enterpriseId,
          county: this.county,
          powerStation: this.powerStation,
          time: this.time,
          industry: this.industry,
        };
        this.http.post('/resumeWork/reWorkDetails', params)
          .then(res => {
            if(res.code == 0) {
              let data = res.data;
              this.searchDataList = data;
            } else {
              this.searchDataList = [];
            }
            this.tableLoading = false;
          })
          .catch(err => {})
      },

    },
  }
</script>

<style lang="scss" scoped>
  .containerWorkSearchMove {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
    background-image: url("../../../static/img/move/midBg.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;

    /*标题头*/
    .header {
      width: 100%;
      height: 6rem;
      line-height: 6rem;
      text-align: center;
      background: #00706B;
      color: #FFFFFF;
      font-size: 1.8rem;
      position: relative;
      .ret {
        height: 6rem;
        display: flex;
        align-items: center;
        position: absolute;
        left: 1rem;
        top: 0;
        z-index: 100;
        img {
          width: 1.6rem;
          height: 1.6rem;
        }
        span {
          font-size: 1.6rem;
          margin-left: 0.4rem;
        }
      }
      .title {
        width: 100%;
        height: 6rem;
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        left: 0;
        top: 0;
      }
    }

    /*明细*/
    .searchDataListBox {
      width: calc(100% - 0rem);
      height: calc(100% - 7rem);
    }

  }

</style>
