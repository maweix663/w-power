<template>
  <div class="containerNewsMove">
    <!--标题头-->
    <div class="header">
      <div class="ret" @click="retPage">
        <img src="../../../static/img/move/ret.png" alt="">
        <span>返回</span>
      </div>
      <div class="title">用户信息</div>
    </div>

    <!--搜素-->
    <div class="searchUser">
      <el-select v-model="searchComment" @change = "changeSearchType" placeholder="请选择">
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
      <el-input v-model="searchName" placeholder="请输入内容进行搜索"></el-input>
      <div class="railSearch" @click="getNews">
        <img src="../../../static/img/move/railSearch.png" alt="">
      </div>
    </div>

    <!--表头-->
    <!--<div class="listTitle">-->
      <!--<p>供电所</p>-->
      <!--<p>抄表段</p>-->
      <!--<p>抄表员</p>-->
      <!--<p>户号</p>-->
      <!--<p>户名</p>-->
    <!--</div>-->

    <!--动态列表-->
    <div class="newsListBox" id="newsListBox" ref="element">
      <ul>
        <li class="list-item" data-type="0">
          <div class="itemTitle">
            <div class="item-desc">
              <p v-for="(item,index) in useListTitle">{{ item }}</p>
            </div>
          </div>
        </li>
        <li class="list-item" data-type="0" v-for="(item,index) in newsList">
          <div class="itemTitle">
            <div class="item-desc">
              <p>{{ item.departmentName }}</p>
              <p>{{ item.railNo }}</p>
              <p>{{ item.railHuman }}</p>
              <p>{{ item.accountNo }}</p>
              <p>{{ item.accountName }}</p>

              <p>{{ item.address }}</p>
              <p>{{ item.accountType }}</p>
              <p>{{ item.industrySort }}</p>
              <p>{{ item.cardNo }}</p>
              <p><a :href="'tel: '+ item.tel">{{ item.tel }}</a></p>

              <p>{{ item.powerType }}</p>
              <p>{{ item.limitFee }}</p>
              <p>{{ item.madeNo }}</p>
              <p>{{ item.manufacturer }}</p>
              <p>{{ item.comRules }}</p>

              <p>{{ item.powerNo }}</p>
              <p>{{ item.powerRate }}</p>
              <p>{{ item.areaName }}</p>
              <p>{{ item.areaNo }}</p>
              <p>{{ item.billInf }}</p>

              <p>{{ item.convertingStation }}</p>
              <p>{{ item.createId }}</p>
              <p>{{ item.createTime }}</p>
              <p>{{ item.creditRating }}</p>
              <p>{{ item.energyMeterType }}</p>

              <p>{{ item.line }}</p>
              <p>{{ item.magnification }}</p>
              <p>{{ item.payTime }}</p>
              <p>{{ item.payType }}</p>
              <p>{{ item.serviceTimes }}</p>

              <p>{{ item.stairShift }}</p>
              <p>{{ item.updateId }}</p>
              <p>{{ item.updateTime }}</p>
            </div>
          </div>
        </li>
      </ul>
    </div>


  </div>
</template>

<script>
  export default {
    name: "userInfo",
    data() {
      return {
        // 区域
        title: '',
        regionId: '',
        typeBtn: null,
        page: '',
        railNo: '',
        // 动态列表
        useListTitle: [
          "营业所","抄表段", "抄表员","户号","户名","用电地址","用户类别","行业分类","证件号码","手机号",
          "停电方式","是否费控","made_no","厂商","通信规则","电量","电费","台区名称","台区编号","账单订阅信息",
          "变电站","创建人id","创建时间","信用等级","电能表类型","线路","倍率","缴费时间","缴费方式", "服务需求次数",
          "阶梯档位使用情况","修改人id","修改时间"
        ],
        refreData: false,
        searchTypeList: [],
        searchComment:  '',
        searchName: '',
        newsList: [],
        pageSize: 1,
        // 搜索
        accountNo: null,
      }
    },
    beforeRouteLeave (to, from, next) {
      window.removeEventListener('scroll', this.watchScroll, true)
      next()
    },
    created() {
      // 区域
      this.title = this.$route.query.title;
      this.regionId = this.$route.query.regionId;
      this.typeBtn = this.$route.query.typeBtn;
      this.page = this.$route.query.page;
      this.railNo = this.$route.query.railNo;

      // 获取搜索字段
      this.getSearchTypeList();
      // 获取用户信息
      this.refreData = false;
      this.getNews();
    },
    mounted: function () {
      // 监听滚动
      window.addEventListener('scroll', this.watchScroll, true);
    },
    methods: {
      // 返回
      retPage() {
        this.$router.push({
          path: '/railMove',
          query: {
            title: this.title,
            regionId: this.regionId,
            page: this.page,
            typeBtn: this.typeBtn
          }
        });
      },

      // 监听滚动
      watchScroll () {
        this.$nextTick(() => {
          var bady = document.getElementById("newsListBox");
          bady.onscroll = () => {
            // 获取距离顶部的距离
            var scrollTop = bady.scrollTop;
            // 获取可视区的高度
            var windowHeight = bady.clientHeight;
            // 获取滚动条的总高度
            var scrollHeight = bady.scrollHeight;
            console.log("距顶部"+scrollTop+"可视区高度"+windowHeight+"滚动条总高度"+scrollHeight);
            if(scrollTop+windowHeight + 4 >=scrollHeight){
              this.pageSize++;
              this.refreData = true;
              if(this.newsList.length > 0) {
                this.getNews();
              }
            }
          }
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

      // 获取用户信息
      getNews() {
        if(this.searchComment == "") {
          this.searchName = '';
        }
        let params = {
          showLoading: false,
          name: this.searchComment,
          comment: this.searchName,
          railNo: this.railNo,
          limit: 100,
          page: this.pageSize,
        };
        let _this = this;
        this.http.post('/InfRail/selectInfRailGrid', params)
          .then(res => {
            let data = res.data.list;
            if(_this.refreData) {
              for(let i = 0; i < data.length; i++) {
                _this.newsList.push(data[i]);
              }
            } else {
              _this.newsList = data;
            }
            this.$message({
              message: '加载完成',
              type: 'success',
              center: true
            })
          })
          .catch(err => {
          })
      },

      // 点击详情
      toDetail(data) {
        this.$router.push({
          path: '/userDetail',
          query: {
            title: this.title,
            regionId: this.regionId,
            page: this.page,
            typeBtn: this.typeBtn,
            item: data,
            railNo: this.railNo,
          }
        });
      },


    },
  }
</script>

<style lang="scss" scoped>
  .containerNewsMove {
    width: 100%;
    height: 100%;
    overflow-y: auto;
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

    /*搜索*/
    .searchUser {
      width: calc(100% - 2rem);
      margin: 1rem;
      position: relative;
      .el-select {
        width: 12rem;
        float: left;
      }
      .el-input {
        width: calc(100% - 12rem);
        float: left;
        input {
          border: 1px solid #b9c9aa;
        }
      }
      .railSearch {
        width: 4rem;
        height: 4rem;
        background: #cddabf;
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        right: 0rem;
        top: 0rem;
      }
    }

    /*表头*/
    .listTitle {
      width: 100%;
      height: 3.2rem;
      background: #f8f8f8;
      margin-top: 0.8rem;
      p {
        display: inline-block;
        height: 3.2rem;
        line-height: 3.2rem;
        text-align: center;
        font-size: 1.4rem;
        color: #536844;
        float: left;
      }
      p:nth-child(1) {
        width: calc(20% + 0.4rem);
      }
      p:nth-child(2) {
        width: 6rem;
      }
      p:nth-child(3) {
        width: calc(15% + 0.4rem);
      }
      p:nth-child(4) {
        width: 8.4rem;
      }
      p:nth-child(5) {
        width: calc(65% - 16rem);
      }
      p:nth-child(6) {
        width: 1rem;
      }
    }

    /*动态列表*/
    .newsListBox {
      width: calc(100% - 2rem);
      height: calc(100% - 13rem);
      margin-left: 1rem;
      overflow: auto;
      ul {
        width: 415rem;
        .list-item:nth-child(1) {
          background: #f8f8f8;
        }
        .list-item {
          height: 3.2rem;
          line-height: 3.2rem;
          margin-bottom: 1rem;
          position: relative;
          -webkit-transition: all 0.2s;
          transition: all 0.2s;
          .itemTitle {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            font-size: 1.2rem;
            .item-desc {
              width: 100%;
              height: 100%;
              p {
                padding: 0 0.2rem;
                width: 10rem;
                display: inline-block;
                height: 100%;
                color: #536844;
                text-align: center;
                float: left;
                /*overflow:hidden;*/
                /*text-overflow:ellipsis;*/
                /*white-space:nowrap;*/
              }
              p:nth-child(1) {

              }
              p:nth-child(2),
              p:nth-child(3) {
                width: 6rem;
              }
              p:nth-child(5) {
                width: 14rem;
              }
              p:nth-child(6) {
                width: 45rem;
              }
              p:nth-child(9) {
                width: 14rem;
              }
              p:nth-child(10),
              p:nth-child(11) {
                width: 8rem;
              }
              p:nth-child(12),
              p:nth-child(15),
              p:nth-child(16) {
                width: 6rem;
              }
              p:nth-child(14),
              p:nth-child(23),
              p:nth-child(35) {
                width: 14rem;
              }
              p:nth-child(15) {
                width: 16rem;
              }
              p:nth-child(22),
              p:nth-child(32) {
                width: 22rem;
              }
            }
          }
        }
      }

    }

  }
</style>
