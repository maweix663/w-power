<template>
  <div class="selectContainer">
    <div class="back">
      <img src="../../../static/img/fanhui.png" alt="" style="font-size: 16px;font-weight: 800;cursor: pointer" @click="back">
    </div>
    <div class="table">
      <div class="tableSearch">
        <el-row>
          <el-col :span="4" >
            <div class="grid-content bg-purple">类型</div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple-light">
              <el-select v-model="searchList.searchComment" @change = "changeSearchType" placeholder="请选择">
                <el-option
                  key=""
                  label="全部"
                  value="">
                </el-option>
                <el-option
                  v-for="item in searchTypeList"
                  :key="item.name"
                  :label="item.comment"
                  :value="item.name">
                </el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="grid-content bg-purple">内容</div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple-light">
              <el-input v-model="searchList.searchName" placeholder="请输入搜索内容"></el-input>
            </div>
          </el-col>
          <el-col :span="4" >
            <div class="grid-content bg-purple">
              <el-button title="搜索" type="primary" icon="el-icon-search" size="small"
                         @click="searchListInput()"></el-button>
              <el-button title="清除所有条件" type="primary" icon="el-icon-delete" size="small"
                         @click="clearListInput"></el-button>
              <!-- <el-button type="primary" icon="el-icon-date" size="small"></el-button> -->
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="tableContent">
        <el-table
          :data="tableData"
          stripe
          height="100%"
          style="width: 100%;background: #f2f4e7;color: #536844;border-radius:15px;border:1px solid #b9b9aa;">
          <el-table-column prop="departmentName" label="营业所" sortable align="center" width="120"></el-table-column>
          <el-table-column prop="railNo" label="抄表段" sortable align="center" width="100"></el-table-column>
          <el-table-column prop="railHuman" label="抄表员" sortable align="center" width="90"></el-table-column>
          <el-table-column prop="accountNo" label="户号" sortable align="center" width="100"></el-table-column>
          <el-table-column prop="accountName" label="户名" sortable align="center" width="100"></el-table-column>
          <el-table-column prop="address" label="用电地址" sortable align="center" min-width="200"></el-table-column>
          <el-table-column prop="accountType" label="用户类别" sortable align="center" width="120"></el-table-column>
          <el-table-column prop="industrySort" label="行业分类" sortable align="center" width="120"></el-table-column>
          <el-table-column prop="cardNo" label="证件号码" sortable align="center" width="180"></el-table-column>
          <el-table-column prop="tel" label="手机号" sortable align="center" width="150"></el-table-column>

          <el-table-column prop="powerType" label="停电方式" sortable align="center" width="120"></el-table-column>
          <el-table-column prop="limitFee" label="是否费控" sortable align="center" width="120"></el-table-column>
          <el-table-column prop="madeNo" label="made_no" sortable align="center" width="120"></el-table-column>
          <el-table-column prop="manufacturer" label="厂商" sortable align="center" width="100"></el-table-column>
          <el-table-column prop="comRules" label="通信规则" sortable align="center" width="120"></el-table-column>
          <el-table-column prop="powerNo" label="电量" sortable align="center" min-width="200"></el-table-column>
          <el-table-column prop="powerRate" label="电费" sortable align="center" width="100"></el-table-column>
          <el-table-column prop="areaName" label="台区名称" sortable align="center" width="120"></el-table-column>
          <el-table-column prop="areaNo" label="台区编号" sortable align="center" width="180"></el-table-column>
          <el-table-column prop="billInf" label="账单订阅信息" sortable align="center" width="150"></el-table-column>

          <el-table-column prop="convertingStation" label="变电站" sortable align="center" width="120"></el-table-column>
          <el-table-column prop="createId" label="创建人id" sortable align="center" width="100"></el-table-column>
          <el-table-column prop="createTime" label="创建时间" sortable align="center" width="120"></el-table-column>
          <el-table-column prop="creditRating" label="信用等级" sortable align="center" width="120"></el-table-column>
          <el-table-column prop="energyMeterType" label="电能表类型" sortable align="center" width="120"></el-table-column>
          <el-table-column prop="line" label="线路" sortable align="center" min-width="200"></el-table-column>
          <el-table-column prop="magnification" label="倍率" sortable align="center" width="100"></el-table-column>
          <el-table-column prop="payTime" label="缴费时间" sortable align="center" width="120"></el-table-column>
          <el-table-column prop="payType" label="缴费方式" sortable align="center" width="180"></el-table-column>
          <el-table-column prop="serviceTimes" label="服务需求次数" sortable align="center" width="150"></el-table-column>


          <el-table-column prop="stairShift" label="阶梯档位使用情况" sortable align="center" width="180"></el-table-column>
          <el-table-column prop="updateId" label="修改人id" sortable align="center" width="100"></el-table-column>
          <el-table-column prop="updateTime" label="修改时间" sortable align="center" width="120"></el-table-column>
        </el-table>
      </div>
      <paging class="pagingChild" ref="pageChildData" :total="total" @pageFinish="pageGroup"
              style="margin-left:10%;float: left;margin-top: 10px;"></paging>
    </div>

  </div>
</template>

<script>
  import Paging from '../../components/paging'
  export default {
    name: "selectCust",
    components: {
      Paging,
    },
    data() {
      return {
        // 区域
        titleText: '',
        regionId: '',
        typeBtn: null,
        page: '',

        list:{
          limit: this.GLOBAL.limit,
          page: 1,
        },
        total:0,
        searchTypeList: [],
        searchList:{
          searchComment:'',//户名
          searchName:'',//户号
          railNo:'',//抄表段
        },
        tableData:[],
        titleText:'',
        regionId:'',//存放传过来的地区id
        typeBtn:'',
      }
    },
    created() {
      this.searchList.railNo = this.$route.query.railNo;
      this.titleText = this.$route.query.area;
      this.regionId = this.$route.query.regionId;
      this.page = this.$route.query.page;
      this.typeBtn = this.$route.query.type;
      // 获取搜索字段
      this.getSearchTypeList();
      this.railList();
    },
    mounted() {
      this.$refs.pageChildData.pageChild.currentPage = 1;
      this.$refs.pageChildData.pageChild.pagesize = 20;
    },
    methods:{
      //返回上一界面
      back(){
        this.$router.push({
          path: '/rail',
          query:{
            area:this.titleText,
            regionId:this.regionId,
            type:this.typeBtn,
            page: this.page,
          },
        });
      },
      // 获取搜索字段
      getSearchTypeList() {
        this.http.post('/InfRail/allType', '')
          .then(res => {
            let data = res.data;
            this.searchTypeList = data;
            this.searchTypeList = [
              {"name": "departmentName","comment": "营业所",}, {"name": "railNo","comment": "抄表段",}, {"name": "railHuman","comment": "抄表员"}, {"name": "accountNo","comment": "户号"}, {"name": "accountName","comment": "户名"},
              {"name": "address","comment": "用电地址"}, {"name": "accountType","comment": "用户类别"}, {"name": "industrySort","comment": "行业分类"}, {"name": "cardNo","comment": "证件号码",}, {"name": "tel","comment": "手机号"},
              {"name": "powerType","comment": "停电方式",}, {"name": "limitFee","comment": "是否费控"}, {"name": "madeNo","comment": "made_no",}, {"name": "manufacturer","comment": "厂商",}, {"name": "comRules","comment": "通信规则",},
              {"name": "powerNo","comment": "电量"}, {"name": "powerRate","comment": "电费"}, {"name": "areaName","comment": "台区名称"}, {"name": "areaNo","comment": "台区编号"}, {"name": "billInf","comment": "账单订阅信息"},
              {"name": "convertingStation","comment": "变电站"}, {"name": "createId","comment": "创建人id"}, {"name": "createTime","comment": "创建时间"}, {"name": "creditRating","comment": "信用等级",}, {"name": "energyMeterType","comment": "电能表类型"},
              {"name": "line","comment": "线路"}, {"name": "magnification","comment": "倍率",}, {"name": "payTime","comment": "缴费时间"}, {"name": "payType","comment": "缴费方式"}, {"name": "serviceTimes","comment": "服务需求次数"},
              {"name": "stairShift","comment": "阶梯档位使用情况"}, {"name": "updateId","comment": "修改人id"}, {"name": "updateTime","comment": "修改时间"}
            ];
          })
          .catch(err => {})
      },
      // 改变搜索条件
      changeSearchType(val) {
        this.searchName = '';
      },
      //搜索
      searchListInput(){
        this.railList();
      },
      //清除
      clearListInput(){
        this.searchList.searchComment = ""
        this.searchList.searchName = ""
        this.railList();
      },
      //获取列表
      railList(){
        if(this.searchComment == "") {
          this.searchList.searchName = '';
        }
        let params = {
          showLoading: false,
          limit:this.list.limit,
          page :this.list.page,
          name: this.searchList.searchComment,
          comment: this.searchList.searchName,
          railNo:this.searchList.railNo
        };
        this.http.post('/InfRail/selectInfRailGrid', params)
          .then(res => {
            this.tableData = res.data.list;
            this.total = res.data.total;
          })
          .catch(err => {})
      },
      // 分页组件
      pageGroup: function (data) {
        this.list.limit = data.pagesize;
        this.list.page = data.currentPage;
        console.log(data)
        this.railList();
      },
    },
  }
</script>

<style lang="scss" scope>
  .selectContainer {
    background: #f2f4e7;
    height: 100%;
    width: 100%;
    .back{
      height: 20px;
      width: 100%;
    }
    .table {
      height: calc(100% - 25px);
      width: 100%;
    }
  }

  .table{
    .tableSearch{
      width: 80%;
      margin:auto;
      height:7%;
    }
    .tableContent{
      width: 85%;
      margin:auto;
      height: 87%;
    }
  }
  .back {
    color: #536844;
    margin-left: 10px;
    padding-top: 5px ;
  }

  .bg-purple {
    background: #cddabf;
    color: #536844;
    font-size: 16px;
    font-weight: 600;
  }

  .bg-purple-light {
    background: #f2f4e7;
  }

  .grid-content {
    border-radius: 4px;
    min-height: 40px;
    display: flex;
    justify-content: center;
    align-items: Center;
  }

  .tableContent .el-table thead tr{
    background-color: #dde7d2;
    color: #536844;
  }

  /*.tableContent ::-webkit-scrollbar {*/
    /*width: 0.5rem;*/
    /*height: 0.6rem;*/
    /*cursor: pointer;*/
    /*background-image: linear-gradient(135deg, #cad5ba 0%, #cad5ba 72%, #cad5ba 100%);*/
  /*}*/
  /*.tableContent ::-webkit-scrollbar-track {*/
    /*border-radius: 0;*/
  /*}*/
  /*.tableContent ::-webkit-scrollbar-thumb {*/
    /*border-radius: 0;*/
    /*background-image: linear-gradient(135deg, #aaa 0%, #aaa 72%, #aaa 100%);*/
    /*transition: all .2s;*/
    /*border-radius: 0.25rem;*/
  /*}*/
  /*.tableContent ::-webkit-scrollbar-thumb:hover {*/
    /*background-color: rgba(95, 95, 95, 0.7);*/
  /*}*/

</style>
