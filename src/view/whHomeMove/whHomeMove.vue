<template>
  <div class="containerMove">
    <div class="containerMoveMain" id="containerMove">
    <!--标题-->
    <div class="header" id="headLogo">
      <div class="title">{{title}}战区防疫保电监控平台</div>
      <div class="selectArea" @click="changeArea">
        <img src="../../../static/img/move/localtion.png" alt="">
        <span>{{title}}</span>
        <!--<img src="../../../static/img/move/next.png" alt="">-->
      </div>

      <!--目录-->
      <!--<div @click="menuEvent" class="railClick"><img src="../../../static/img/gis/mulu.png"></div>-->

      <!--复工复产-->
      <div @click="changeType" class="railClick">
        <img src="../../../static/img/work/type.png" alt="">
      </div>
    </div>
    <!--菜单列表-->
    <div class="headList" :class="navBarFixed == true ? 'navBarWrap' :''">
      <div class="listBox">
        <ul>
          <li :style="labelList == 0?selectLabel: ''" @click="labelList = 0"><a href="#headLogo">首页</a></li>
          <li :style="labelList == 2?selectLabel: ''" @click="labelList = 2"><a href="#listImport">监控数据</a></li>
          <li :style="labelList == 1?selectLabel: ''" @click="labelList = 1"><a href="#listNews">战区动态</a></li>
          <li :style="labelList == 3?selectLabel: ''" @click="labelList = 3"><a href="#listMap">作战指挥图</a></li>
          <li :style="labelList == 4?selectLabel: ''" @click="labelList = 4"><a href="#listCust">重要客户供电保障</a></li>
          <li :style="labelList == 5?selectLabel: ''" @click="labelList = 5"><a href="#listFunt">电网负荷情况</a></li>
          <li :style="labelList == 6?selectLabel: ''" @click="labelList = 6"><a href="#listSit">疫情情况</a></li>
          <li :style="labelList == 7?selectLabel: ''" @click="labelList = 7"><a href="#listAttend">保电出勤统计</a></li>
        </ul>
      </div>
    </div>
    <!--logo-->
    <div class="headLogo">
      <img src="../../../static/img/move/headBg.png" alt="">
    </div>
    <!--监控数据-->
    <div  class="importData">
      <div class="labelPosition"  id="listImport"></div>
      <div class="importLabel">监控数据</div>
      <!--<div class="importTime">-->
        <!--<img src="../../../static/img/move/time.png" alt="">-->
        <!--<span>{{importTime}}</span>-->
        <!--<vue-seamless-scroll :data="newsList" :class-option="optionLeft" class="seamless-warp2">-->
          <!--<ul class="item" :style="newsUlWidth">-->
            <!--<li v-for="item in newsList" v-text="item.title"></li>-->
          <!--</ul>-->
        <!--</vue-seamless-scroll>-->
      <!--</div>-->
      <div class="dataListOne">
        <ul>
          <li v-for="(item, index) in dataListOneArr">
            <p>
              <span><label>较上日</label>  {{item.complate}}</span>
              <span>{{item.value}}</span>
              <span>{{item.name}}</span>
            </p>
          </li>
        </ul>
      </div>
      <div class="dataListTwo">
        <ul>
          <li v-for="(item, index) in dataListTwoArr">
            <p>
              <span><label>较上日</label>  {{item.complate}}</span>
              <span>{{item.value}}</span>
              <span>{{item.name}}</span>
            </p>
          </li>
        </ul>
      </div>
    </div>

    <!--战区动态-->
    <div class="module newModule">
      <div class="labelPosition"  id="listNews"></div>
      <div class="moduleLabel"><span></span><span>战区动态</span><span @click="newsListPage" >更多></span></div>
      <div class="areaNews">
        <ul>
          <li v-for="item in newsList" @click="toDetail(item)">
            <span>【{{ item.divisionName }}】</span>
            <span>{{ item.time | newsTime }}</span>
            <span>{{ item.detail }}</span>
          </li>
        </ul>
      </div>
    </div>

    <!--作战指挥图-->
    <div class="module">
      <div class="labelPosition"  id="listMap"></div>
      <div  class="moduleLabel"><span></span><span>作战指挥图</span></div>
      <div class="mapMod">
        <div id="myMap" class="myMap"></div>
        <div class="list">
          <ul :style="ulWidth">
            <li :style="liWidth" v-for="(item,index) in list" :key="index" :class="flag==index?'choosedLi':''"
                @click="ponitClick(item, index)">
              <div class="localIcon">
                <a :href="'https://uri.amap.com/marker?position='+item.lng+','+item.lng+'&name='+item.address">
                  <img src="../../../static/img/icon2.png" alt="">
                </a>
              </div>
              <div class="alone">
                <span :style="listFont1">{{ item.customeName }}</span>
                <span :style="listFont2">{{ item.address }}</span>
                <!--<span :style="listFont2" >电话:<a :href="'tel:'+ item.customeTel | custTel2">{{ item.customeTel | custTel }} <img src="../../../static/img/phone.png" alt=""></a></span>-->
              </div>
            </li>
          </ul>
        </div>
        <!--搜索框-->
        <div class="searchArea" v-show="showSearch">
          <div class="searchFour">
            <el-select v-model="searchVal" placeholder="请选择" @change="changeSearch">
              <el-option v-for="item in searchType" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </div>
          <div class="searchOne">
            <el-input v-if="searchVal == '客户名称' || searchVal == '单位'" v-model="searchName" placeholder="请输入内容"></el-input>
            <el-input v-if="searchVal == '负荷阈值'" v-model="searchNum" placeholder="请输入内容"></el-input>
            <el-select v-if="searchVal == '级别'" v-model="searchName" placeholder="请选择">
              <el-option v-for="item in levelArr" :key="item" :label="item" :value="item"></el-option>
            </el-select>
            <el-select v-if="searchVal == '用户类别'" v-model="searchName" placeholder="请选择">
              <el-option v-for="item in userTypeSelect" :key="item" :label="item" :value="item"></el-option>
            </el-select>
            <el-select v-if="searchVal == '行政区域'" v-model="searchName" placeholder="请选择">
              <el-option v-for="item in administrationArr" :key="item" :label="item.adminDivision" :value="item.divisionId"></el-option>
            </el-select>
            <img class="img1" @click="searchData" src="../../../static/img/search.png" alt="">
            <img class="img2" @click="showSearch = false" src="../../../static/img/qingkong2.png" alt="">
          </div>
        </div>
        <img class="img3" @click="showSearch = true" v-show="!showSearch" src="../../../static/img/search.png" alt="">
        <img class="img4" @click="allListData" src="../../../static/img/all.png" alt="" title="所有客户">
        <img class="rail" v-show="title != '武汉'" @click="railPage" src="../../../static/img/move/rail.png" alt="" title="所有客户">
      </div>
    </div>

    <!--重要客户-->
    <div class="module">
      <div class="labelPosition"  id="listCust"></div>
      <div  class="moduleLabel"><span></span><span>重要客户供电保障</span></div>
      <div class="custMod" id="custMod"></div>
    </div>

    <!--电网负荷情况-->
    <div class="module">
      <div class="labelPosition"  id="listFunt"></div>
      <div  class="moduleLabel"><span></span><span>电网负荷情况</span></div>
      <div class="funtMod">
        <div class="funtLine" id="funtLine"></div>
        <div class="funtRing" id="funtRing"></div>
      </div>
    </div>

    <!--疫情情况-->
    <div class="module">
      <div class="labelPosition"  id="listSit"></div>
      <div  class="moduleLabel"><span></span><span>疫情情况</span></div>
      <div class="sitMod">
        <div class="sitList">
          <ul>
            <li v-for="(item, index) in peopleArr" @click="peopleClcik(item,index)" :style="peopleIndex == index?sitStyle:''">{{item}}</li>
          </ul>
        </div>
        <div class="sitPie" id="sitPie"></div>
      </div>
    </div>

    <!--保电出勤-->
    <div class="module">
      <div class="labelPosition"  id="listAttend"></div>
      <div  class="moduleLabel"><span></span><span>保电出勤统计</span></div>
      <div class="attendMod" id="attendMod"></div>
    </div>

    <!--区域/数据切换-->
    <div class="changeAreaBox" v-if="changeAreaShow1">
      <!--<el-collapse-transition>-->
        <div v-show="changeAreaShow2">
          <div class="changeArea">
            <p>指标速览</p>
            <ul>
              <li v-for="(item, index) in areaArr" @click="changeData(item)">{{ item.name }}</li>
            </ul>
            <p>战区切换</p>
            <ul>
              <li v-for="(item, index) in areaArr" v-show="index == 0?false:true" @click="skip(item)">{{ item.name }}</li>
            </ul>
          </div>
        </div>
      <!--</el-collapse-transition>-->
    </div>

    <!--目录-->
    <div class="menuList" v-show="ifMenuList">
      <ul>
        <li @click="menuList('patrolMove')">巡检GIS</li>
      </ul>
    </div>

    </div>

    <!--详情-->
    <div class="model" v-if="showDetailModel">
      <div class="modelDetailMain">
        <p><span>战区：</span>{{detailNews.divisionName}}</p>
        <p><span>时间：</span>{{detailNews.time}}</p>
        <p><span>标题：</span>{{detailNews.title}}</p>
        <p><span>内容：</span>{{detailNews.detail}}</p>
        <div class="modelBtn">
          <button @click="closeDel">关 闭</button>
        </div>
      </div>
    </div>

    <!--弹窗信息-->
    <div class="model" v-if="showWindowModel">
      <div class="modelWindowMain">
        <div class="modelWindowBody">
          <p><span>客户名称：</span>{{windowModelInfo.customeName}}</p>
          <p><span>客户编号：</span>{{windowModelInfo.customeNo}}</p>
          <!--<p><span>地址：</span><a target="_blank" style="color: #4747F3;" :href="'https://uri.amap.com/marker?position='+windowModelInfo.lng+','+windowModelInfo.lat+'&name='+windowModelInfo.address">{{windowModelInfo.address}}</a></p>-->
          <p><span>地址：</span><span style="color: #4747F3;" @click="navMove(windowModelInfo)">{{windowModelInfo.address}}</span></p>
          <p><span>客户电话(联系人)：</span><a :href="'tel: ' + tel1">{{windowModelInfo.customeTel}}</a></p>
          <p><span>用户类别：</span>{{windowModelInfo.type}}</p>
          <p><span>行政区域：</span>{{windowModelInfo.adminDivision}}</p>
          <p><span>防疫保电级别：</span>{{windowModelInfo.level}}</p>
          <p><span>保电人员：</span>{{windowModelInfo.electricityKeeper}}</p>
          <p><span>保电人员电话：</span><a :href="'tel: '+ tel2">{{windowModelInfo.electricityKeeperTel}}</a></p>

          <p><span>供电营业所：</span>{{windowModelInfo.electricityKeeperCompany}}</p>
          <p><span>运行容量：</span>{{windowModelInfo.capacity}}</p>
          <p><span>自备应急电源容量：</span>无</p>
          <p><span>UPS配备情况：</span>无</p>
          <p><span>第一路电源：</span>{{windowModelInfo.line1}}</p>
          <p><span>第二路电源：</span>{{windowModelInfo.line2}}</p>
          <p><span>第三路电源：</span>无</p>
          <p><span>供电类型：</span>无</p>
          <p><span>自备应急电源：</span>{{windowModelInfo.emergencySupply}}</p>
          <p><span>驻点运维公司：</span>无</p>
          <p><span>失压脱扣装置：</span>无</p>
          <p><span>安全隐患：</span>{{windowModelInfo.potentialSafety}}</p>
          <p><span>备注：</span>{{windowModelInfo.remarks}}</p>
          <p v-show="!showCustAttend"><span @click="lookCustAttend(windowModelInfo.customeNo)" style="color: #4747F3;">查看客户最近20天的负荷</span></p>
          <div v-show="showCustAttend" class="custAttendChart" id="custAttendChart"></div>
        </div>
        <div class="modelBtn">
          <button @click="closeDel">关 闭</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  export default {
    name: "whHomeMove",
    data() {
      return {
        // 宽高-屏幕尺寸
        screenWidth: document.body.clientWidth,
        screenHeight: document.body.clientHeight,
        // 目录
        ifMenuList: false,
        // 日期-数据
        date: '',
        // 防疫-时间
        epidemicTime: '',
        // 电网
        loadTime: '',
        // 出勤
        repairTime: '',
        // 区域
        title: '武汉',
        // 区域id
        regionId: '',
        whRegionId: '018b01f66d0fdw36bodsaodksaod',
        paths: '',
        // 区域列表
        // 区域
        area: ['武汉', '汉口', '武昌', '汉阳', '沌口', '东新'],
        areaArr: [
          {name: '武汉', regionId: ''},
          {name: '武昌', regionId: '018b01f66d0f4c36b785c0e45b959e0e'},
          {name: '汉口', regionId: '018b01f66d0f4c36b785c0e2ab959e0e'},
          {name: '汉阳', regionId: '018b01f66d0f4c36b785cfgab959e0e'},
          {name: '沌口', regionId: '018b01f66d0f4c36b785c0e2ab959los'},
          {name: '东新', regionId: '018b01f66d0fdw36b7fs0e2ab959los'},

          {name: '东西湖', regionId: '018b01f6310f4c36b785c0e2ab959los'},
          {name: '江夏', regionId: '018b01f66d0fdw36b785c0e2ab959los'},
          {name: '蔡甸', regionId: '018b01f66d0f4c36b785vdv2ab959los'},
          {name: '汉南', regionId: '018b01f66d0f4c36b785c0e2ab95fsg'},
          {name: '黄陂', regionId: '018b01f66d0f4c26b785c0e2ab959los'},
          {name: '新洲', regionId: '018b01f66d0f4c36b7d4c0e2ab959los'}
        ],
        // 区域/数据切换-显隐
        changeAreaShow1: false,
        changeAreaShow2: false,
        // 标签置顶
        navBarFixed: false,
        // 监控日期
        importTime: '',
        // 重要数据
        dataListOneArr: [],
        dataListTwoArr: [],

        // 战区动态
        showDetailModel: false,
        newsList: [],
        newsUlWidth: {
          width: '28rem'
        },

        // 地图
        map: null,
        zoom: 16,
        mapStyle: '',
        list: [],
        allPt: [],
        liWidth: {
          width: '',
          float: 'left'
        },
        ulWidth: {
          width: '',
        },
        flag: -1,
        ptInfo: null,
        ptInfoLabel: true,
        showAllListData: false,
        // 搜索
        showAlarm: false,
        searchName: '',
        searchNum: 80,
        showSearch: false,
        searchType: ['客户名称', '单位', '用户类别', '级别', '负荷阈值', '行政区域'],
        searchVal: '客户名称',
        userTypeSelect: [],
        levelArr: ['特级', '一级', '二级', '三级'],
        administrationArr: [],
        // 重点客户
        redFlagArr: [
          {customeNo: "6813368245",name: '光谷科技会展中心方舱医院定点医院', lnglat: [114.508811, 30.490224]},
          {customeNo: "6608307552",name: '武汉国际博览中心方舱医院定点医院', lnglat: [114.260066, 30.577000]},
          {customeNo: "0004041803",name: '华中科技大学同济医学院附属协和医院', lnglat: [114.274696, 30.58407]},
          {customeNo: "0025127812",name: '武汉体育中心方舱医院定点医院', lnglat: [114.260066, 30.577]},
          {customeNo: "0006026964",name: '省疫情防控指挥部', lnglat: [114.355801, 30.568398]}],
        levelIcon: ['特级', '一级', '二级', '三级'],

        // 弹窗
        showWindowModel: false,
        windowModelInfo: null,
        tel1: null,
        tel2: null,
        // 查看客户最近20天的负荷
        showCustAttend: false,
        custAttendX: [],
        custAttendY: [],

        // 重要客户
        custX: [],
        custY: [],
        allCust: null,

        // 电网负荷情况
        funtLineX: [],
        funtLineY1: [],
        funtLineY2: [],
        maxFun: [],
        minFun: [],

        // 疫情情况
        // 类别
        peopleArr: ['在职员工', '员工家属', '外委用工及家属', '退休职工'],
        peopleItem: '在职员工',
        peopleIndex: 0,
        sit1: [],
        sit2: [],
        sit3: [],
        sit4: [],
        sit5: [],
        // 选中类型
        sitStyle: {
          color: '#222B29',
          fontWeight: 'bold'
        },

        // 保电出勤统计
        attendX: [],
        attendY1: [],
        attendY2: [],
        attendY3: [],

        // 样式-选中标签
        selectLabel: {
          borderBottom: '3px solid #fff'
        },
        labelList: 0,
        // 指挥部
        listFont1: {
          fontSize: '1.4rem'
        },
        listFont2: {
          fontSize: '1.2rem'
        },
        // 图表legend
        legend: 12,
        // 坐标
        xyAxis: 10,
      }
    },
    computed: {
      // 战区动态滚动
      optionLeft () {
        return {
          direction: 2,
          limitMoveNum: 1,
          step:1,
          hoverStop: false
        }
      }
    },
    filters: {
      // 战区动态时间
      newsTime: function(val) {
        return parseInt(val.substring(5,7)) + '月' + val.substring(8,16)
      },

      // 客户电话
      custTel: function (val) {
        if (val) {
          return val.replace(/[^0-9]/ig, "")
        } else {
          return '无'
        }
      },
      // 客户拨打电话
      custTel2: function (val) {
        if (val) {
          return 'tel:' + val.replace(/[^0-9]/ig, "")
        } else {
          return 'tel:' + '无'
        }
      },
      // 负载率数据类型
      loadNum: function (val) {
        return parseFloat(val).toFixed(2)
      }
    },
    beforeRouteLeave (to, from, next) {
      window.removeEventListener('scroll', this.watchScroll, true)
      next()
    },
    created() {
      // 区域
      // this.title = this.$route.query.title;
      // this.regionId = this.$route.query.regionId;
      // this.infoSize();
      // 获取日期
      this.getDate();
      // 获取级别
      this.getLevel();
      // 获取用户类别
      this.getUserTypeSelect();
    },
    mounted() {
      // 监听滚动
      window.addEventListener('scroll', this.watchScroll, true);
      this.$nextTick(function () {
        // 地图
        this.loadmap();
        // 窗口大小
        const that = this;
        window.onresize = () => {
          return (() => {
            window.screenWidth = document.body.clientWidth;
            that.screenWidth = window.screenWidth;
            window.screenHeight = document.body.clientHeight;
            that.screenHeight = window.screenHeight;
          })()
        };
      })
    },
    methods: {
      /*目录*/
      menuEvent:function(){
        this.ifMenuList = !this.ifMenuList;
      },

      // 目录
      menuList(data) {
        this.ifMenuList = false;
        this.$router.push({
          path: '/' + data,
          query:{
            title:this.title,
            regionId:this.regionId,
            page: '/whHomeMove',
            typeBtn:true
          }
        });
      },

      infoSize() {
        let wd = this.screenWidth;
        let hg = this.screenHeight;
        // this.custHg.height = hg * 0.04 + 'rem';
        // this.attendHg.height = hg * 0.03 + 'rem';
      },

      // 区域显隐
      changeArea() {
        this.changeAreaShow1 = !this.changeAreaShow1;
        this.changeAreaShow2 = !this.changeAreaShow2;
      },

      // 区域改变数据
      changeData: function(item) {
        this.changeArea();
        this.title = item.name;
        this.regionId = item.regionId;
        if(this.regionId == '') {
          this.whRegionId = '018b01f66d0fdw36bodsaodksaod'
        } else {
          this.whRegionId = item.regionId;
        }
        // 获取时间
        this.getDate();
      },

      //跳转
      skip(item) {
        this.changeAreaShow1 = false;
        this.changeAreaShow2 = false;
        let _this = this;
        if (item.name == "汉口" || item.name == "汉阳" || item.name == "武昌") {
          _this.paths = "/homeMove";
        } else {
          _this.paths = "/areaHomeMove";
        }
        // setTimeout(() => {
          console.log(item);
          this.$router.push({
            path: _this.paths,
            query: {
              title: item.name,
              regionId: item.regionId,
              typeBtn: true
            }
          });
        // }, 500)
      },

      // 复工复产
      changeType() {
        this.$router.push({
          path: '/workMove'
        });
      },

      // 导航
      navMove(data) {
        this.$router.push({
          path: '/navMove',
          query: {
            title: this.title,
            regionId: this.regionId,
            page: '/whHomeMove',
            typeBtn: true,
            data: data
          }
        });
      },


      // 监听滚动
      watchScroll () {
        var read = document.querySelector('#containerMove').scrollTop
        if (read > 80) {
          this.navBarFixed = true
        } else {
          this.navBarFixed = false
        }
      },

      // 围栏页面
      railPage() {
        this.$router.push({
          path: "/railMove",
          query: {
            title: this.title,
            regionId: this.regionId,
            page: '/whHomeMove',
            typeBtn: true
          }
        });
      },

      // 获取日期
      getDate() {
        let params = {
          showLoading: false,
        };
        this.http.post('/homePage/findTime', params)
          .then(res => {
            this.date = res.data.time;
            // 防疫
            this.epidemicTime = res.data.epidemicTime;
            // 电网
            this.loadTime = res.data.loadTime;
            // 出勤
            this.repairTime = res.data.repairTime;
            // 行政区域
            this.administrationArr = res.data.regionList;

            // 获取战区动态
            this.getNews();
            // 监控数据
            this.getMonitorData();
            // 地图保障点
            this.getMapDot();
            // 重要客户
            this.getCust();
            // 电网负荷情况
            this.getFunt();
            //人员疫情
            this.getSit();
            // 保电出勤
            this.getAttend();
          })
          .catch(err => {
          })
      },

      // 获取战区动态
      getNews() {
        let params = {
          showLoading: false,
          regionId: this.regionId,
          limit: 5,
          page: 1,
          time: ''
        };
        this.http.post('/homePage/selectNotice', params)
          .then(res => {
            let data = res.data;
            let timeStr = res.data[0].time;
            // 监控数据时间
            this.importTime = parseInt(timeStr.substring(5,7))+ '月' + parseInt(timeStr.substring(8,10));
            this.newsList = [];
            let newStr = '';
            if(data.length > 0) {
              for (let i = 0; i < data.length; i++) {
                // let obj = {
                //   'title': data[i].title
                // };
                this.newsList.push(data[i]);
                // newStr+= data[i].title;
              }
              // this.newsUlWidth.width = 1.4*newStr.length + data.length + 'rem';
            }
          })
          .catch(err => {
          })
      },

      // 点击详情
      toDetail(data) {
        this.detailNews = data;
        this.showDetailModel = true;
      },

      // 关闭
      closeDel() {
        this.showDetailModel = false;
        this.showWindowModel = false;
        this.showCustAttend = false;
      },

      // 战区动态列表
      newsListPage() {
        this.$router.push({
          path: '/newsMove',
          query: {
            regionId: this.regionId,
            page: '/whHomeMove'
          }
        });
      },

      // 监控数据
      getMonitorData() {
        let params = {
          showLoading: false,
          regionId: this.regionId
        };
        this.http.post('/homePage/indexInfo', params)
          .then(res => {
            // 重要数据
            this.dataListOneArr = res.data.dateListOneArr;
            this.dataListTwoArr = res.data.dateListTwoArr;
          })
          .catch(err => {
          })

      },

      // 地图
      loadmap() {
        this.map = new AMap.Map('myMap', {
          resizeEnable: true,
          zoom: 10,
          center: [114.309277, 30.542268],
          mapStyle: 'amap://styles/normal',
        });
        // 绑定地图移动与缩放事件
        this.map.on('zoomend', this.logMapinfo);
      },

      // 地图事件
      logMapinfo() {
        this.zoom = this.map.getZoom();
        if(this.zoom >= 14) {
          if(this.ptInfoLabel == false) {
            this.ptInfoLabel = true;
            // 打点
            this.dotPoint(this.list);
          }
        }else if(this.zoom < 14) {
          if(this.ptInfoLabel == true) {
            this.ptInfoLabel = false;
            // 打点
            this.dotPoint(this.list);
          }
        }
      },

      /*获取用户类型--下拉框*/
      getUserTypeSelect(){
        let param = {
          showLoading: false,
        };
        this.http.post('/homePage/selectUserType', param)
          .then(res => {
            this.userTypeSelect = res.data;
          })
          .catch(err => {})
      },

      // 清除搜索
      changeSearch() {
        this.searchName = '';
        this.searchNum = 80;
      },

      // 保障点搜索
      searchData() {
        let params = {
          showLoading: false,
          time: this.date,
          customerName: '',
          workName: '',
          type: '',
          level: '',
          value: null,
          divisionId: '',
          regionId: this.regionId
        };
        if (this.searchVal == "客户名称") {
          params = {
            showLoading: false,
            time: this.date,
            customerName: this.searchName,
            workName: '',
            type: '',
            level: '',
            value: null,
            divisionId: '',
            regionId: this.regionId
          };
        } else if (this.searchVal == "单位") {
          params = {
            showLoading: false,
            time: this.date,
            customerName: '',
            workName: this.searchName,
            type: '',
            level: '',
            value: null,
            divisionId: '',
            regionId: this.regionId
          };
        } else if (this.searchVal == "用户类别") {
          params = {
            showLoading: false,
            time: this.date,
            customerName: '',
            workName: '',
            type: this.searchName,
            level: '',
            value: null,
            divisionId: '',
            regionId: this.regionId
          };
        } else if (this.searchVal == "级别") {
          params = {
            showLoading: false,
            time: this.date,
            customerName: '',
            workName: '',
            type: '',
            level: this.searchName,
            value: null,
            divisionId: '',
            regionId: this.regionId
          };
        } else if (this.searchVal == "负荷阈值") {
          if (this.searchNum < 30 || this.searchNum > 100) {
            this.$message({
              message: "请输入30~100之间的阀值",
              center: true
            });
            return
          }
          params = {
            showLoading: false,
            time: this.date,
            customerName: '',
            workName: '',
            type: '',
            level: '',
            value: this.searchNum,
            divisionId: '',
            regionId: this.regionId
          };
        } else if (this.searchVal == "行政区域") {
          params = {
            showLoading: false,
            time: this.date,
            customerName: '',
            workName: '',
            type: '',
            level: '',
            value: null,
            divisionId: this.searchName,
            regionId: this.regionId
          }
        }
        // 是否显示报警图标
        if (params.value != null) {
          this.showAlarm = true;
        } else {
          this.showAlarm = false;
        }
        let data;
        this.showAllListData = false;
        this.http.post('/homePage/mapShowLocation', params)
          .then(res => {
            data = res.data;
            this.list = data;
            this.guaList(data);
          })
          .catch(err => {
            data = [];
            this.list = [];
            this.guaList(data);
          })


      },

      // 地图保障点
      getMapDot() {
        this.showAlarm = false;
        let params = {
          showLoading: false,
          time: this.date,
          regionId: this.regionId,
        };
        let data;
        let _this = this;
        this.http.post('/homePage/mapShowLocation', params)
          .then(response => {
            if (response.code === 0) {
              data = response.data;
              _this.allPt = data;
              // 保障点列表
              this.$nextTick(function () {
                _this.showAllListData = false;
                _this.guaList(data);
              })
            }
          })
          .catch(err => {})
      },

      // 所有客户
      allListData() {
        this.showAlarm = false;
        let data = this.allPt;
        let _this = this;
        this.$nextTick(function () {
          _this.showAllListData = true;
          _this.guaList(data);
        })
      },

      // 保障点列表
      guaList(data) {
        let _this = this;
        this.$nextTick(function () {
          let wd = _this.screenWidth;
          _this.liWidth.width = (wd / 20) + 'rem';
          _this.ulWidth.width = (wd / 20 + 1.2) * data.length + 'rem';
          _this.liWidth.left = 'left';
          _this.list = data;
          // 打点
          _this.dotPoint(data);
        })
      },

      // 打点
      dotPoint(datas) {
        if (this.map != null) {
          this.map.clearMap();
        }
        let imgIcon;
        let iconSize=20;
        let _this = this;
        for (let i = 0; i < datas.length; i++) {
          let data = datas[i];
          if (data.lng == null || data.lat == null) {
            continue;
          }
          for(let n=0; n < _this.levelIcon.length; n++) {
            if (datas[i].level == _this.levelIcon[n]) {
              imgIcon = '../../../static/img/'+n+'.png';
              iconSize = 20;
            }
          }
          for(let j=0; j < _this.redFlagArr.length; j++) {
            if (datas[i].customeNo == _this.redFlagArr[j].customeNo) {
              imgIcon = '../../../static/img/redFlag.png';
              iconSize = 34;
            }
          }

          let lnglat = [parseFloat(data.lng), parseFloat(data.lat)];
          // 点定位
          let ptIcon = new AMap.Icon({
            // 图标尺寸
            size: new AMap.Size(iconSize, iconSize),
            // 图标的取图地址
            image: imgIcon,
            // 图标所用图片大小
            imageSize: new AMap.Size(iconSize, iconSize),
            // 图标取图偏移量
            imageOffset: new AMap.Pixel(0, 0)
          });


          this.ptInfo = new AMap.Marker({
            map: this.map,
            // icon: '../../../static/img/homePage2/infoPoint.gif',
            icon: ptIcon,
            anchor: 'bottom-left',
            offset: new AMap.Pixel(-10, -10),
            position: lnglat
          });

          if(this.ptInfoLabel) {
            this.ptInfo.setLabel({
              offset: new AMap.Pixel(-10, -6),  //设置文本标注偏移量
              content: "<div class='ptLabel'>" + data.customeName.substring(0, 5) + "...</div>", //设置文本标注内容
              direction: 'top' //设置文本标注方位
            });
          }

          this.ptInfo.on('click', function (param) {
            _this.windowInfo(data)
          })
        }
        this.redFlagDot();
      },

      // 重点客户打点
      redFlagDot() {
        let arr = this.redFlagArr;
        let _this = this;
        let nn;
        if(this.title == "武汉") {
          nn = 4;
        } else  if(this.title == "汉口") {
          nn = 2;
        } else  if(this.title == "武昌") {
          nn = 4;
        } else  if(this.title == "汉阳") {
          nn = 1;
        } else  if(this.title == "沌口") {
          nn = 3;
        } else  if(this.title == "东薪") {
          nn = 0;
        } else {
          nn = 4;
        }
        this.$nextTick(function () {
          if(_this.ptInfoLabel) {
            _this.map.setZoomAndCenter(_this.zoom, arr[nn].lnglat);
          }
        })

        if(this.showAllListData) {
          this.$message({
            type: 'success',
            message: "成功显示所有客户",
            center: true
          })
        }
      },

      // 保障点点击事件
      ponitClick(item, index) {
        this.flag = index;
        // 关闭弹窗
        this.map.clearInfoWindow();

        let lnglat = [parseFloat(item.lng), parseFloat(item.lat)];
        this.map.setZoomAndCenter(this.zoom, lnglat);
        // 点定位
        let imgIcon;
        if (this.showAlarm) {
          imgIcon = '../../../static/img/alarmIcon.png'
        } else {
          imgIcon = '../../../static/img/icon2.png'
        }
        let ptIcon = new AMap.Icon({
          // 图标尺寸
          size: new AMap.Size(20, 20),
          // 图标的取图地址
          image: imgIcon,
          // 图标所用图片大小
          imageSize: new AMap.Size(20, 20),
          // 图标取图偏移量
          imageOffset: new AMap.Pixel(0, 0)
        });


        this.ptInfo = new AMap.Marker({
          map: this.map,
          // icon: '../../../static/img/homePage2/infoPoint.gif',
          icon: ptIcon,
          anchor: 'bottom-left',
          offset: new AMap.Pixel(-15, -15),
          position: lnglat
        });
        // 弹窗事件-图标点击事件
        let _this = this;
        this.windowInfo(item);
        // this.ptInfo.on('click', function (param) {
        //   _this.windowInfo(item)
        // })
      },

      // 弹窗信息
      windowInfo: function (item) {
        let lnglat = [parseFloat(item.lng), parseFloat(item.lat)];
        let data = {};
        for (let i in item) {
          let m;
          if (item[i] == null) {
            m = '无'
          } else {
            m = item[i]
          }
          data[i] = m
        }
        let val = data.customeTel;
        let tel;
        if (val) {
          tel = val.replace(/[^0-9]/ig, "")
        } else {
          tel = '无'
        }
        let val2 = data.electricityKeeperTel;
        let tel2;
        if (val2) {
          tel2 = val2.replace(/[^0-9]/ig, "")
        } else {
          tel2 = '无'
        }
        this.tel1 = tel;
        this.tel2 = tel2;
        this.showWindowModel = true;
        this.windowModelInfo = data;

        let title = "";
        this.content = [];
        this.content.push('客户名称：' + data.customeName);
        this.content.push('客户编号：' + data.customeNo);
        this.content.push('地址：' + data.address);
        this.content.push('客户电话(联系人)：<a href="tel:' +tel + '">' + data.customeTel +'</a>>');
        this.content.push('用户类别：' + data.type);
        this.content.push('行政区域：' + data.adminDivision);
        this.content.push('防疫保电级别：' + data.level);
        this.content.push('保电人员：' + data.electricityKeeper);
        this.content.push('保电人员电话：<a href="tel:' +tel2 + '">' + data.electricityKeeperTel +'</a>>');
        this.content.push('供电营业所：' + data.electricityKeeperCompany);
        this.content.push('运行容量：' + data.capacity);
        this.content.push('自备应急电源容量：' + '无');
        this.content.push('UPS配备情况：' + '无');
        this.content.push('第一路电源：' + data.line1);
        this.content.push('第二路电源：' + data.line2);
        this.content.push('第三路电源：' + '无');
        this.content.push('供电类型：' + '无');
        this.content.push('自备应急电源：' + data.emergencySupply);
        this.content.push('驻点运维公司：' + '无');
        this.content.push('失压脱扣装置：' + '无');
        this.content.push('安全隐患：' + data.potentialSafety);
        this.content.push('备注：' + data.remarks);
        let _this = this;
        // this.infoWindow = new AMap.InfoWindow({
        //   isCustom: true, //使用自定义窗体
        //   content: _this.createInfoWindow(title, _this.content.join("<br/>")),
        //   offset: new AMap.Pixel(20, -60),
        //   anchor: 'middle-left'
        // });
        // this.infoWindow.open(this.map, lnglat);
        // $(".custom-info").find(".info-middle").css("overflow","auto");
        // this.$nextTick(function () {
        //   $(".custom-info").find(".info-middle").css("overflow","auto");
        // })
      },

      // 弹窗内容
      createInfoWindow: function (title, content) {
        let info = document.createElement("div");
        info.className = "custom-info input-card content-window-card";
        var top = document.createElement("div");
        var titleD = document.createElement("div");
        var closeX = document.createElement("img");
        top.className = "info-top";
        titleD.innerHTML = title;
        closeX.src = "../../../static/img/qingkong2.png";
        closeX.onclick = this.closeInfoWindow;
        top.appendChild(titleD);
        top.appendChild(closeX);
        info.appendChild(top);
        // 定义中部内容
        var middle = document.createElement("div");
        middle.className = "info-middle";
        middle.style = "overflow: scroll";
        middle.innerHTML = content;
        info.appendChild(middle);
        return info;
      },

      // 关闭信息窗体
      closeInfoWindow() {
        this.map.clearInfoWindow();
      },

      // 查看客户最近20天的负荷
      lookCustAttend(data) {
        let params = {
          showLoading: false,
          customNo : data
        };
        this.showCustAttend = true;
        let _this = this;
        this.custAttendX = [];
        this.custAttendY = [];
        this.http.post('/homePage/loadSituation', params)
          .then(res => {
            let data = res.data;
            for(let i = 0; i < data.length; i++) {
              let time = parseInt(data[i].dateTime.substring(4,6)) + '月' + parseInt(data[i].dateTime.substring(6,8));
              this.custAttendX.push(time);
              this.custAttendY.push(data[i].loadRate);
            }
            console.log(data);
            this.$nextTick(function () {
              _this.lookCustAttendChart();
            })
          })
          .catch(err => {})
      },

      // 客户最近20天的负荷柱柱状图
      lookCustAttendChart() {
        let _this = this;
        let custAttendChart = this.$echarts.init(document.getElementById('custAttendChart'));
        custAttendChart.resize();
        custAttendChart.setOption({
          grid: {
            left: '8%',
            right:'12%',
            top: '16%',
            bottom: '6%',
            containLabel: true
          },
          tooltip: {
            trigger: 'axis',
            formatter: '{b}<br /> {a}: {c}（万千瓦）',
          },
          dataZoom: [
            {
              show: true,
              realtime: true,
              start: 0,
              end: 100
            },
            {
              type: 'inside',
              realtime: true,
              start: 0,
              end: 100
            }
          ],
          xAxis: [
            {
              type: 'category',
              name:'日期',
              nameLocation: 'end',
              nameTextStyle: {
                fontSize: _this.xyAxis,
                color: '#2D2F2E'
              },
              boundaryGap: false,
              axisTick: { //y轴刻度线
                show: false
              },
              splitLine: { //网格线
                show: false
              },
              axisLine: {
                lineStyle: {
                  color: '#6D718A',
                  width: 1,
                }
              },
              axisLabel: {
                show: true,
                textStyle: {
                  fontSize: _this.xyAxis,
                  color: '#2D2F2E'
                },
              },
              data: _this.custAttendX
            }
          ],
          yAxis: [
            {
              type: 'value',
              name:'单位（万千瓦）',
              nameLocation: 'end',
              nameTextStyle: {
                fontSize: _this.xyAxis,
                color: '#2D2F2E'
              },
              axisTick: { //y轴刻度线
                show: false
              },
              splitLine: { //网格线
                show: false
              },
              axisLine: {
                lineStyle: {
                  color: '#6D718A',
                  width: 1,
                }
              },
              axisLabel: {
                show: true,
                formatter:'{value} ',
                textStyle: {
                  fontSize: _this.xyAxis,
                  color: '#2D2F2E'
                },
              },
            }
          ],
          series: [
            {
              name: '负荷',
              type: 'line',
              barWidth: '60%',
              itemStyle: {
                normal: {
                  color: '#199efd'
                },
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                },
              },
              data: _this.custAttendY
            }
          ]
        })
      },

      // 获取级别
      getLevel() {
        this.http.post('/homePage/findMapShowLocationInfo', '')
          .then(res => {
            // this.levelArr = res.data.levels;
          })
          .catch(err => {})
      },

      // 重要客户
      getCust() {
        let _this = this;
        let params = {
          showLoading: false,
          time: this.date,
          regionId: this.regionId
        };
        this.http.post('/homePage/customerSafeguard', params)
          .then(res => {
            this.allCust = res.data;
            let data = res.data.customerInfo;
            this.custX = [];
            this.custY = [];
            for (let i = 0; i < data.length; i++) {
              this.custX.push(data[i].name);
              this.custY.push(data[i].count);
            }
            let _this = this;
            this.$nextTick(function () {
              // 客户模块
              _this.custEchart();
            })
          })
          .catch(err => {})
      },

      // 客户模块
      custEchart() {
        let _this = this;
        let i = -1;
        let custModChart = _this.$echarts.init(document.getElementById('custMod'));
        custModChart.resize();
        custModChart.setOption({
          tooltip: {
            trigger: 'axis',
            formatter: '{b}<br /> {a}: {c}户',
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {
            data: ['保障点客户数'],
            icon: "rect",
            itemWidth: 6, // 设置宽度
            itemHeight: 6, // 设置高度
            itemGap: 20, // 设置间距
            textStyle: {
              fontSize: _this.legend,//字体大小
              color: '#7D7D7D'//字体颜色
            },
            x: 'right' //居右显示
          },
          grid: {
            left: '2%',
            right:'10%',
            top: '6%',
            bottom: '6%',
            containLabel: true
          },
          xAxis: [{
            type: 'value',
            axisTick: { //y轴刻度线
              show: false
            },
            splitLine: { //网格线
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#674f2a',
                width: 0,
              }
            },
            axisLabel: {
              show: false,
              textStyle: {
                fontSize:_this.xyAxis,
              },
            },
          }],
          yAxis: [{
            type: 'category',
            axisTick: { //y轴刻度线
              "show": false
            },
            splitLine: { //网格线
              "show": false
            },
            axisLine: {
              lineStyle: {
                color: '#674f2a',
                width: 0,
              }
            },
            axisLabel: {
              show: true,
              textStyle: {
                fontSize: _this.xyAxis,
                color: '#262827',
                fontWeight: 'bold'
              },
            },
            data: _this.custX
          }],
          series: [
            {
              name: '保障点客户数',
              type: 'bar',
              barWidth: 4,
              barGap: '160%', /*多个并排柱子设置柱子之间的间距*/
              barCategoryGap: '50%', /*多个并排柱子设置柱子之间的间距*/
              itemStyle: {
                normal: {
                  color: '#2B8C85',
                  label: {
                    show: true,
                    position: 'right',
                    textStyle: {
                      color: '#828282',
                      fontSize: _this.legend
                    },
                    formatter: function(param) {
                      return param.data + '户';
                    },
                  }
                },
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 10,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                },
              },
              data: _this.custY
            },
          ]
        }, true)
        custModChart.on('click', function (params) {
          let name = params.name;
          let arr = [];
          _this.showAlarm = false;
          for (let i = 0; i < _this.allPt.length; i++) {
            let typeLeve = _this.allPt[i].type+"("+ _this.allPt[i].level+")";
            if(name == typeLeve) {
              arr.push(_this.allPt[i])
            }
          }
          _this.list = arr;
          _this.guaList(arr);
        });

      },

      // 电网负荷情况
      getFunt() {
        let param = {
          showLoading: false,
          time: this.loadTime,
          regionId: this.whRegionId
        };
        this.http.post('/homePage/runningCondition', param)
          .then(res => {
            this.funtLineX = [];
            this.funtLineY1 = [];
            this.funtLineY2 = [];
            this.maxFun = [];
            this.minFun = [];
            let data = res.data;
            let arr = [];
            for (let i = 1; i < 8; i++) {
              let key = 'day' + i;
              arr.push(data[key]);
            }
            for (let j = 0; j < arr.length; j++) {
              if (arr[j] != null) {
                this.funtLineX.push(arr[j].dateTime.substring(6, 8) + '日');
                this.funtLineY1.push((arr[j].maxLoad).toFixed(1));
                this.funtLineY2.push((arr[j].minLoad).toFixed(1));
              } else {
                this.funtLineX.push(this.date.substring(6, 8) + '日');
                this.funtLineY1.push(0);
                this.funtLineY2.push(0);
              }
            }
            let maxStr = '';
            let maxRate;
            if (this.funtLineY1[6] > this.funtLineY1[5]) {
              if (this.funtLineY1[5] == 0) {
                maxRate = '100.00'
              } else {
                maxRate = (((this.funtLineY1[6] - this.funtLineY1[5]) / this.funtLineY1[5]) * 100);
                if (maxRate > 99.99) {
                  maxRate = '99.99';
                } else {
                  maxRate = maxRate.toFixed(2)
                }
              }
              maxStr += '增加';
            } else if (this.funtLineY1[6] == this.funtLineY1[5]) {
              maxRate = 0;
              maxStr += '不变';
            } else {
              maxRate = (((this.funtLineY1[5] - this.funtLineY1[6]) / this.funtLineY1[5]) * 100);
              if (maxRate < 0.01) {
                maxRate = '0.01';
              } else {
                maxRate = maxRate.toFixed(2)
              }
              maxStr += '减少';
            }
            this.maxFun.push(this.funtLineY1[6]);
            this.maxFun.push(maxRate);
            this.maxFun.push(maxStr);
            let minStr = '';
            let minRate;
            if (this.funtLineY2[6] > this.funtLineY2[5]) {
              if (this.funtLineY2[5] == 0) {
                minRate = '100.00'
              } else {
                minRate = (((this.funtLineY2[6] - this.funtLineY2[5]) / this.funtLineY2[5]) * 100);
                if (minRate > 99.99) {
                  minRate = '99.99';
                } else {
                  minRate = minRate.toFixed(2)
                }
              }
              minStr += '增加';
            } else if (this.funtLineY2[6] == this.funtLineY2[5]) {
              minRate = 0;
              minStr += '不变';
            } else {
              minRate = (((this.funtLineY2[5] - this.funtLineY2[6]) / this.funtLineY2[5]) * 100);
              if (minRate < 0.01) {
                minRate = '0.01';
              } else {
                minRate = minRate.toFixed(2)
              }
              minStr += '减少';
            }
            this.minFun.push(this.funtLineY2[6]);
            this.minFun.push(minRate);
            this.minFun.push(minStr);
            let _this = this;
            this.$nextTick(function () {
              // 电网运行
              _this.funtLineEchart();

              _this.funtRingEchart();
            })

          })
          .catch(err => {
            // this.funtLineX = [];
            // this.funtLineY1 = [];
            // this.funtLineY2 = [];
            //
            // this.maxFun = ['0', '0', '不变'];
            // this.minFun = ['0', '0', '不变'];
          })
      },

      // 电网运行模块
      funtLineEchart() {
        let _this = this;
        let funtLineChart = this.$echarts.init(document.getElementById('funtLine'));
        funtLineChart.resize();
        funtLineChart.setOption({
          legend: {
            data: ['日最大负荷', '日最小负荷'],
            icon: "circle",
            itemWidth: 6, // 设置宽度
            itemHeight: 6, // 设置高度
            itemGap: 20, // 设置间距
            textStyle: {
              fontSize: _this.legend,//字体大小
              color: '#674f2a'//字体颜色
            },
            x: 'right'
          },
          grid: {
            left: '8%',
            right:'12%',
            top: '16%',
            bottom: '6%',
            containLabel: true
          },
          tooltip: {
            trigger: 'axis'
          },
          xAxis: {
            type: 'category',
            name:'日期',
            nameLocation: 'end',
            nameTextStyle: {
              fontSize: _this.xyAxis,
              color: '#2D2F2E'
            },
            boundaryGap: false,
            axisTick: { //y轴刻度线
              show: false
            },
            splitLine: { //网格线
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#6D718A',
                width: 1,
              }
            },
            axisLabel: {
              show: true,
              textStyle: {
                fontSize: _this.xyAxis,
                color: '#2D2F2E'
              },
            },
            data: _this.funtLineX
          },
          yAxis: {
            type: 'value',
            name:'单位（万千瓦）',
            nameLocation: 'end',
            nameTextStyle: {
              fontSize: _this.xyAxis,
              color: '#2D2F2E'
            },
            axisTick: { //y轴刻度线
              show: false
            },
            splitLine: { //网格线
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#6D718A',
                width: 1,
              }
            },
            axisLabel: {
              show: true,
              formatter:'{value} ',
              textStyle: {
                fontSize: _this.xyAxis,
                color: '#2D2F2E'
              },
            },
          },
          series: [
            {
              name: '日最大负荷',
              type: 'line',
              // stack: '总量',
              smooth: true,
              itemStyle: {
                normal: {
                  color: '#ee6f64'
                },
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                },
              },
              data: _this.funtLineY1
            },
            {
              name: '日最小负荷',
              type: 'line',
              // stack: '总量',
              smooth: true,
              itemStyle: {
                normal: {
                  color: '#199efd'
                },
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                },
              },
              data: _this.funtLineY2
            },
          ]
        }, true)
      },

      funtRingEchart() {
        let funtRingChart = this.$echarts.init(document.getElementById('funtRing'));
        funtRingChart.resize();
        let _this = this;
        funtRingChart.setOption({
          legend: {
            orient: 'vertical',
            show: true,
            right: '8%',
            y: 'center',
            itemWidth: 3,
            itemHeight: 24,
            itemGap: 20,
            textStyle: {
              color: '#2F3030',
              fontSize: _this.xyAxis,
              fontWeight: 'normal',
              lineHeight: 14,
              rich: {
                percent11: {
                  color: '#009d85',
                  fontSize: _this.xyAxis + 2,
                },
                percent22: {
                  color: '#00cdae',
                  fontSize: _this.xyAxis + 2,
                },
                percent1: {
                  color: '#ee6f64',
                  fontSize: _this.xyAxis + 2,
                }, percent2: {
                  color: '#ee6f64',
                  fontSize: _this.xyAxis + 2,
                },
              },
            },
            formatter: name => {
              switch (name) {
                case '昨日最大负荷':
                  return (
                    '昨日最大负荷{percent11|' + _this.maxFun[0] + '}万千瓦\n\n 比前一天' + _this.maxFun[2] + '{percent2|' + _this.maxFun[1] + '%\n}'
                  );
                case '昨日最小负荷':
                  return (
                    '昨日最小负荷{percent22|' + _this.minFun[0] + '}万千瓦\n\n 比前一天' + _this.minFun[2] + '{percent2|' + _this.minFun[1] + '%} '
                  );

                default:
                  break;
              }
            },
          },
          tooltip: {
            show: true,
          },
          series: [
            {
              type: 'pie',
              radius: ['55%', '72%'],
              center: ['22%', '50%'],
              itemStyle:{
                normal: {
                  borderWidth: 3,
                  borderColor: '#FFFFFF',
                }
              },
              hoverAnimation: false,
              z: 10,
              label: {
                position: 'center',
                formatter: () => {
                  // return '作业总数\r\n{total|100} 个';
                  return '';
                },
                rich: {
                  total: {
                    fontSize: 0,
                    color: '#fff',
                  },
                },
                color: '#7a8c9f',
                fontSize: 14,
                lineHeight: 30,
              },
              data: [
                {
                  value: _this.maxFun[0],
                  name: '昨日最大负荷',
                  itemStyle: {
                    // color: '#0286ff',
                    color: {
                      type: '\'radial\'',
                      x: 0,
                      y: 0,
                      x2: 0,
                      y2: 1,
                      colorStops: [{
                        offset: 0, color: '#009d85', // 0% 处的颜色
                      }, {
                        offset: 1, color: '#009d85', // 100% 处的颜色
                      }],
                      global: false // 缺省为 false
                    }
                  },
                },
                {
                  value: _this.minFun[0],
                  name: '昨日最小负荷',
                  itemStyle: {
                    color: {
                      type: '\'radial\'',
                      x: 0,
                      y: 0,
                      x2: 0,
                      y2: 1,
                      colorStops: [{
                        offset: 1, color: '#00cdae',
                      }, {
                        offset: 0, color: '#00cdae',
                      }],
                      global: false
                    }
                  },
                },

              ],
              labelLine: {
                show: false,
              },
            },
          ],
        }, true)
      },

      //疫情情况
      peopleClcik(item, index) {
        this.peopleIndex = index;
        if (item == '在职员工') {
          this.sit5 = this.sit1;
          this.peopleItem = '在职员工'
        } else if (item == '外委用工及家属') {
          this.sit5 = this.sit2;
          this.peopleItem = '外委用工及家属'
        } else if (item == '员工家属') {
          this.sit5 = this.sit3;
          this.peopleItem = '员工家属'
        } else {
          this.sit5 = this.sit4;
          this.peopleItem = '退休员工'
        }
        this.funtPieEchart();
      },

      //获取疫情数据
      getSit() {
        if(this.regionId != "" || this.epidemicTime == null) {
          this.sit1 = [{all: '0', now: '0', retire: '0', die: '0',},{all: '0', now: '0', retire: '0', die: '0',},{all: '0', now: '0', retire: '0', die: '0',}];
          this.sit2 = [{all: '0', now: '0', retire: '0', die: '0',},{all: '0', now: '0', retire: '0', die: '0',},{all: '0', now: '0', retire: '0', die: '0',}];
          this.sit3 = [{all: '0', now: '0', retire: '0', die: '0',},{all: '0', now: '0', retire: '0', die: '0',},{all: '0', now: '0', retire: '0', die: '0',}];
          this.sit4 = [{all: '0', now: '0', retire: '0', die: '0',},{all: '0', now: '0', retire: '0', die: '0',},{all: '0', now: '0', retire: '0', die: '0',}];
          this.sit5 = [{all: '0', now: '0', retire: '0', die: '0',},{all: '0', now: '0', retire: '0', die: '0',},{all: '0', now: '0', retire: '0', die: '0',}];
          this.funtPieEchart();
          return
        }
        let param = {
          showLoading: false,
          time: this.epidemicTime
        };
        this.http.post('/homePage/personHealthByWuHan', param)
          .then(res => {
            let data = res.data;
            let _this = this;
            // 工作人员
            this.sit1 = data.workPerson;
            this.sit5 = data.workPerson;
            //外人
            this.sit2 = data.externalPerson;
            // 家属
            this.sit3 = data.workfamilyPerson;
            // 退休人员
            this.sit4 = data.retirePerson;
            this.$nextTick(function () {
              // 疫情
              this.funtPieEchart();
            })
          })
          .catch(err => {
          })
      },

      //疫情
      funtPieEchart() {
        let _this = this;
        let attendPie = this.$echarts.init(document.getElementById('sitPie'));
        attendPie.resize();
        attendPie.setOption(
          {
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b}: {c} ({d}%)'
            },
            title: [
              {
                text: '{a|确诊人数  }',
                left: '7%',
                top: '75%',
                textStyle: {
                  rich: {
                    a: {
                      fontFamily: 'SourceHanSansCN-Regular',
                      fontWeight: 'bold',
                      color: "#674f2a",
                      fontSize: _this.legend,
                      align: 'center',
                      textAlign: 'center'
                    },
                  }
                },
              }, {
                text: this.sit5[0].all + '人',
                left: '8%',
                top: '33%',
                textStyle: {
                  rich: {
                    a: {
                      fontFamily: 'SourceHanSansCN-Regular',
                      fontWeight: 'bold',
                      color: "#674f2a",
                      fontSize: _this.legend,
                      align: 'center',
                      textAlign: 'center'
                    },
                  }
                },
              }, {
                text: '{a|疑似人数  }',
                left: '42%',
                top: '75%',
                textStyle: {
                  rich: {
                    a: {
                      fontFamily: 'SourceHanSansCN-Regular',
                      fontWeight: 'bold',
                      color: "#674f2a",
                      fontSize:  _this.legend,
                      align: 'center',
                      textAlign: 'center'
                    },
                  }
                },
              }, {
                text: this.sit5[1].all + '人',
                left: '43%',
                top: '33%',
                textStyle: {
                  rich: {
                    a: {
                      fontFamily: 'SourceHanSansCN-Regular',
                      fontWeight: 'bold',
                      color: "#674f2a",
                      fontSize:  _this.legend,
                      align: 'center',
                      textAlign: 'center'
                    },
                  }
                },
              }, {
                text: '{a|发热人数  }',
                left: '77%',
                top: '75%',
                textStyle: {
                  rich: {
                    a: {
                      fontFamily: 'SourceHanSansCN-Regular',
                      fontWeight: 'bold',
                      color: "#674f2a",
                      fontSize:  _this.legend,
                      align: 'center',
                      textAlign: 'center'
                    },
                  }
                },
              },{
                text: this.sit5[2].all + '人',
                left: '78%',
                top: '33%',
                textStyle: {
                  rich: {
                    a: {
                      fontFamily: 'SourceHanSansCN-Regular',
                      fontWeight: 'bold',
                      color: "#674f2a",
                      fontSize:  _this.legend,
                      align: 'center',
                      textAlign: 'center'
                    },
                  }
                },
              },
            ],
            color: ['#ecb852', '#e78d79', '#ed6f65'],
            series: [
              {
                name: '确诊人数',
                type: 'pie',
                radius: ['50%', '68%'],
                center: ['15%', '40%'],
                itemStyle:{
                  normal: {
                    borderWidth: 3,
                    borderColor: '#FFFFFF',
                  }
                },
                avoidLabelOverlap: false,
                label: {
                  normal: {
                    show: false,
                    position: 'center'
                  },
                },
                labelLine: {
                  normal: {
                    show: false
                  }
                },
                data: [
                  {value: this.sit5[0].retire, name: '治愈'},
                  {value: this.sit5[0].now, name: '现存'},
                  {value: this.sit5[0].die, name: '死亡'},
                ]
              },
              {
                name: '疑似人数',
                type: 'pie',
                radius: ['50%', '68%'],
                center: ['50%', '40%'],
                itemStyle:{
                  normal: {
                    borderWidth: 3,
                    borderColor: '#FFFFFF',
                  }
                },
                avoidLabelOverlap: false,
                label: {
                  normal: {
                    show: false,
                    position: 'center'
                  },
                },
                labelLine: {
                  normal: {
                    show: false
                  }
                },
                data: [
                  {value: this.sit5[1].retire, name: '治愈'},
                  {value: this.sit5[1].now, name: '现存'},
                  {value: this.sit5[1].die, name: '死亡'},
                ]
              }, {
                name: '发热人数',
                type: 'pie',
                radius: ['50%', '68%'],
                center: ['85%', '40%'],
                itemStyle:{
                  normal: {
                    borderWidth: 3,
                    borderColor: '#FFFFFF',
                  }
                },
                avoidLabelOverlap: false,
                label: {
                  normal: {
                    show: false,
                    position: 'center'
                  },
                },
                labelLine: {
                  normal: {
                    show: false
                  }
                },
                data: [
                  {value: this.sit5[2].retire, name: '治愈'},
                  {value: this.sit5[2].now, name: '现存'},
                ]
              },
            ]
          });

      },

      // 保电出勤
      getAttend() {
        let param = {
          showLoading: false,
          time: this.repairTime,
          regionId: this.regionId
        };
        this.http.post('/homePage/trueOutForWord', param)
          .then(res => {
            let data = res.data;
            this.attendX = [];
            this.attendY1 = [];
            this.attendY2 = [];
            this.attendY3 = [];
            let arr = [];
            for (let i = 1; i < 8; i++) {
              let key = 'day' + i;
              arr.push(data[key]);
            }
            for (let j = 0; j < arr.length; j++) {
              if (arr[j] != null) {
                this.attendX.push(arr[j].dateTime.substring(6, 8) + '日');
                this.attendY1.push(arr[j].repairHumanNo);
                this.attendY2.push(arr[j].repairCarNo);
                this.attendY3.push(arr[j].emergencyVehicleNo);
              } else {
                this.attendX.push(this.date.substring(6, 8) + '日');
                this.attendY1.push(0);
                this.attendY2.push(0);
                this.attendY3.push(0);
              }
            }

            let _this = this;
            this.$nextTick(function () {
              // 保电出勤
              _this.attendEchart();
            })

          })
          .catch(err => {
          })
      },

      // 保电出勤
      attendEchart() {
        let _this = this;
        let attendChart = this.$echarts.init(document.getElementById('attendMod'));
        attendChart.resize();
        attendChart.setOption({
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {
            data: ['保电人次', '保电车辆台次','应急电源车台次'],
            icon: "circle",
            itemWidth: 6, // 设置宽度
            itemHeight: 6, // 设置高度
            itemGap: 20, // 设置间距
            textStyle: {
              fontSize: _this.legend,//字体大小
              color: '#674f2a'//字体颜色
            },
            x: 'right' //居右显示
          },
          grid: {
            left: '2%',
            right:'12%',
            top: '24%',
            bottom: '6%',
            containLabel: true
          },
          xAxis: [{
            type: 'category',
            name:'日期',
            nameLocation: 'end',
            nameTextStyle: {
              fontSize: _this.xyAxis,
              color: '#2D2F2E'
            },
            data: _this.attendX,
            axisTick: { //y轴刻度线
              show: false
            },
            splitLine: { //网格线
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#6d718a',
                width: 1,
              }
            },
            axisLabel: {
              show: true,
              textStyle: {
                fontSize: _this.xyAxis,
              },
            },
          }],
          yAxis: [{
            type: 'value',
            name:'次数',
            nameLocation: 'end',
            nameTextStyle: {
              fontSize: _this.xyAxis,
              color: '#2D2F2E'
            },
            axisTick: { //y轴刻度线
              "show": false
            },
            splitLine: { //网格线
              "show": false
            },
            axisLine: {
              lineStyle: {
                color: '#6d718a',
                width: 1,
              }
            },
            axisLabel: {
              show: true,
              textStyle: {
                fontSize: _this.xyAxis,
              },
            },
          }],
          series: [{
            name: '保电人次',
            type: 'bar',
            barWidth: 5,
            itemStyle: {
              normal: {
                color: '#19a0f7',
                label: {
                  show: true,
                  position: 'top',
                  textStyle: {
                    color: '#92a1c3',
                    fontSize: _this.xyAxis
                  }
                }
              },
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            data:  _this.attendY1
          },
            {
              name: '保电车辆台次',
              type: 'bar',
              barWidth: 5,
              barGap: '160%', /*多个并排柱子设置柱子之间的间距*/
              barCategoryGap: '50%', /*多个并排柱子设置柱子之间的间距*/
              itemStyle: {
                normal: {
                  color: '#58b2af',
                  label: {
                    show: true,
                    position: 'top',
                    textStyle: {
                      color: '#92a1c3',
                      fontSize: _this.xyAxis
                    }
                  }
                },
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 10,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                },
              },
              data: _this.attendY2
            },{
              name: '应急电源车台次',
              type: 'bar',
              barWidth: 5,
              barGap: '160%', /*多个并排柱子设置柱子之间的间距*/
              barCategoryGap: '50%', /*多个并排柱子设置柱子之间的间距*/
              itemStyle: {
                normal: {
                  color: '#d46e75',
                  label: {
                    show: true,
                    position: 'top',
                    textStyle: {
                      color: '#92a1c3',
                      fontSize: _this.xyAxis
                    }
                  }
                },
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 10,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                },
              },
              data:_this.attendY3
            },
          ]
        }, true)
      },

    },
  }
</script>

<style lang="scss">
  .navBarWrap {
    position:fixed;
    top:0;
    z-index:999;
  }

  .containerMove {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    position: relative;
    background-image: url("../../../static/img/move/midBg.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;

    .containerMoveMain {
      width: 100%;
      height: 100%;
      overflow-y: auto;
      position: relative;

      /*标签定位*/
      .labelPosition {
        position: absolute;
        top: -4rem;
        width: 0.1rem;
        height: 0rem;
      }

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
        .selectArea {
          width: 6rem;
          height: 6rem;
          display: flex;
          align-items: center;
          position: absolute;
          left: 1rem;
          top: 0rem;
          span {
            float: left;
            font-size: 1.6rem;
            color: #fff;
            padding: 0 0.1rem;
          }
          img {
            float: left;
            width: 1.6rem;
            height: 1.6rem;
          }
        }
        .railClick {
          position: absolute;
          top: 0rem;
          right: 2rem;
          cursor: pointer;
          height: 6rem;
          display: flex;
          align-items: center;
          img {
            width: 1.8rem;
            height: 1.8rem;
          }
        }
      }

      /*标签列表*/
      .headList {
        width: calc(100% - 4rem);
        height: 4rem;
        padding: 0 2rem;
        background: #00706B;
        font-size: 1.6rem;
        overflow: hidden;
        .listBox {
          width: 100%;
          height: 100%;
          overflow-x: auto;
          ul {
            float: left;
            width: 80rem;
            height: 4rem;
            li {
              float: left;
              height: 3.6rem;
              line-height: 3.6rem;
              padding: 0rem 1rem;
              background: #00706B;
              a {
                text-decoration: none;
                color: #FFFFFF;
              }
            }
          }
        }
      }

      /*logo*/
      .headLogo {
        width: 100%;
        height: auto;
        margin-top: -0.2rem;
        z-index: -1;
        img {
          width: 100%;
          height: auto;
          margin-top: -0.2rem;
          border: none;
        }
      }

      /*监控数据*/
      .importData {
        width: calc(100% - 4rem);
        margin: -15rem 2rem auto 2rem;
        border-radius: 1rem;
        background: #fff;
        z-index: 10;
        position: absolute;
        .importLabel {
          width: 100%;
          height: 4rem;
          line-height: 4rem;
          background: #1DA39D;
          color: #FFFFFF;
          font-size: 1.6rem;
          text-indent: 2rem;
          border-radius: 1rem 1rem 0 0;
        }
        .importTime {
          width: 100%;
          height: 3rem;
          display: flex;
          align-items: center;
          background: #fff;
          img {
            width: 2rem;
            height: 2rem;
            margin-left: 1rem;
          }
          span {
            font-size: 1.4rem;
            color: #2B2C2B;
            margin-left: 0.4rem;
          }
          .seamless-warp2 {
            overflow: hidden;
            width: calc(100% - 10rem);
            margin-left: 1rem;
            ul.item {
              li {
                float: left;
                margin-right: 1rem;
                font-size: 1.4rem;
                color: #2B2C2B;
              }
            }
          }
        }
        .dataListOne {
          width: 100%;
          height: 8rem;
          background: #fff;
          margin-top: 1rem;
          ul {
            width: 100%;
            li {
              float: left;
              width: 25%;
              height: 8rem;
              display: flex;
              justify-content: center;
              align-items: center;
              p {
                display: inline-block;
                width: 100%;
                height: 6.6rem;
                span {
                  display: inline-block;
                  width: 100%;
                  text-align: center;
                }
                span:nth-child(1) {
                  height: 1.2rem;
                  line-height: 1.2rem;
                  font-size: 1rem;
                  label {
                    color: #6E6E6E;
                  }
                }
                span:nth-child(2) {
                  height: 2.4rem;
                  line-height: 2.4rem;
                  font-size: 2rem;
                  font-weight: 300;
                  margin-top: 0.2rem;
                }
                span:nth-child(3) {
                  height: 1.4rem;
                  line-height: 1.4rem;
                  font-size: 1.2rem;
                  color: #262827;
                  margin-top: 0.4rem;
                }
              }
            }
            li:nth-child(1) span:nth-child(1),
            li:nth-child(1) span:nth-child(2) {
              color: #0367bb;
            }
            li:nth-child(2) span:nth-child(1),
            li:nth-child(2) span:nth-child(2) {
              color: #a3020e;
            }
            li:nth-child(3) span:nth-child(1),
            li:nth-child(3) span:nth-child(2) {
              color: #707070;
            }
            li:nth-child(4) span:nth-child(1),
            li:nth-child(4) span:nth-child(2) {
              color: #1da39d;
            }

          }
        }
        .dataListTwo {
          width: 100%;
          height: 8.4rem;
          background: #fff;
          margin-top: 1rem;
          ul {
            width: 100%;
            li {
              float: left;
              width: 25%;
              height: 6.8rem;
              display: flex;
              justify-content: center;
              align-items: center;
              p {
                display: inline-block;
                width: 100%;
                span {
                  display: inline-block;
                  width: 100%;
                  text-align: center;
                }
                span:nth-child(1) {
                  font-size: 1rem;
                  height: 1.2rem;
                  line-height: 1.2rem;
                  label {
                    color: #6E6E6E;
                  }
                }
                span:nth-child(2) {
                  height: 2.2rem;
                  line-height: 2.2rem;
                  font-size: 1.8rem;
                  font-weight: 300;
                  margin-top: 0.2rem;
                }
                span:nth-child(3) {
                  height: 1.2rem;
                  line-height: 1.2rem;
                  font-size: 1rem;
                  color: #262827;
                  margin-top: 0.4rem;
                }
              }
            }
            li:nth-child(1) span:nth-child(1),
            li:nth-child(1) span:nth-child(2) {
              color: #46a07a;
            }
            li:nth-child(2) span:nth-child(1),
            li:nth-child(2) span:nth-child(2) {
              color: #e95261;
            }
            li:nth-child(3) span:nth-child(1),
            li:nth-child(3) span:nth-child(2) {
              color: #f4aa6a;
            }
            li:nth-child(4) span:nth-child(1),
            li:nth-child(4) span:nth-child(2) {
              color: #46a07a;
            }

          }
        }
      }

      /*各个模块*/
      .module {
        width: calc(100% - 4rem);
        margin: 2rem 2rem auto 2rem;
        border-radius: 1rem;
        background: #FFFFFF;
        position: relative;
        .moduleLabel {
          width: 100%;
          padding: 2rem 0rem;
          display: flex;
          align-items: center;
          span:nth-child(1) {
            display: inline-block;
            width: 0.4rem;
            height: 1.6rem;
            background: #00706B;
            margin-left: 1rem;
          }
          span:nth-child(2) {
            font-size: 1.6rem;
            color: #00706B;
            margin-left: 1rem;
            font-weight: bold;
          }
        }
      }

      /*战区动态*/
      .newModule {
        margin-top: 10rem;
        .moduleLabel {
          overflow: hidden;
          position: relative;
          span:nth-child(3) {
            position: absolute;
            right: 1rem;
            font-size: 1.4rem;
            font-weight: bold;
          }
        }
      }

      .areaNews {
        width: 100%;
        height: 15rem;
        ul {
          width: 100%;
          height: 100%;
          li {
            width: 100%;
            height: 3rem;
            span {
              float: left;
              display: inline-block;
              height: 3rem;
              line-height: 3rem;
              font-size: 1.4rem;
            }
            span:nth-child(1) {
              width: 6rem;
            }
            span:nth-child(2) {
              width: 9rem;
              text-align: center;
            }
            span:nth-child(3) {
              width: calc(100% - 15rem);
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
        }
      }

      /*作战指挥图*/
      .mapMod {
        width: 100%;
        height: 55.2rem;
        position: relative;
        .myMap {
          width: 100%;
          height: 50rem;
        }
        /*保障列表*/
        .list {
          width: 100%;
          height: 5.2rem;
          overflow-x: auto;
          ul {
            height: 100%;
            li {
              display: inline-block;
              padding: 0.6rem;
              background: #E9F7F6;
              cursor: pointer;
              .localIcon {
                float: left;
                width: 3rem;
                height: 100%;
                text-align: center;
                img {
                  width: 1.6rem;
                  height: 1.6rem;
                  margin-top: 0.6rem;
                }
              }
              .alone {
                float: left;
                width: calc(100% - 3rem);
                span {
                  display: inline-block;
                  width: 100%;
                  color: #967f5d;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                  a {
                    color: #818aa6;
                  }
                }
                span:nth-child(1) {
                  color: #745329;
                }
              }
            }
          }
        }
        /*搜索*/
        .searchArea {
          position: absolute;
          top: 0rem;
          right: 1rem;
          width: 31.2rem;
          background: #fff;
          .searchTwo {
            width: 6rem;
            float: left;
          }
          .searchThree {
            float: left;
            width: 0.6rem;
            height: 3.4rem;
            line-height: 3.4rem;
            color: #63FAFB;
          }
          .searchFour {
            float: left;
            width: 11rem;
            height: 100%;
          }
          .searchOne {
            float: left;
            width: 19.8rem;
            height: 100%;
            position: relative;
            .img1 {
              width: 1.8rem;
              height: 1.8rem;
              position: absolute;
              top: 8px;
              right: 10px;
              cursor: pointer;
            }
            .img2 {
              width: 1.6rem;
              height: 1.6rem;
              position: absolute;
              right: -1.6rem;
              top: -1.6rem;
              cursor: pointer;
            }
          }
        }
        .img3 {
          width: 1.8rem;
          height: 1.8rem;
          position: absolute;
          right: 1rem;
          top: 1rem;
          cursor: pointer;
        }
        .img4 {
          width: 1.8rem;
          height: 1.8rem;
          position: absolute;
          right: 1rem;
          top: 4rem;
          cursor: pointer;
        }
        .rail {
          width: 5.6rem;
          height: 5.6rem;
          position: absolute;
          right: 0rem;
          bottom: 10rem;
          cursor: pointer;
        }
      }

      /*重要客户*/
      .custMod {
        width: 100%;
        height: 24rem;
      }

      /*电网负荷情况*/
      .funtMod {
        width: 100%;
        height: 34rem;
        .funtLine {
          width: 100%;
          height: 20rem;
        }
        .funtRing {
          width: 100%;
          height: 14rem;
        }
      }

      /*疫情情况*/
      .sitMod {
        width: 100%;
        height: 18rem;
        .sitList {
          width: 100%;
          height: 4rem;
          ul {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            li {
              float: left;
              font-size: 1.4rem;
              color: #5F5F5F;
              padding: 0 0.4rem;
            }
          }
        }
        .sitPie {
          width: 100%;
          height: 14rem;
        }
      }

      /*保电出勤*/
      .attendMod {
        width: 100%;
        height: 24rem;
      }

      /*区域/数据切换*/
      .changeAreaBox {
        width: calc(100% - 4rem);
        height: 24rem;
        position: absolute;
        top: 6rem;
        left: 2rem;
        z-index: 1000;
        .changeArea {
          width: 100%;
          height: 24rem;
          color: #fff;
          background: #00706B;
          border-radius: 0 0 1rem 1rem;
          p {
            margin-left: 1rem;
            font-size: 1.6rem;
            font-weight: bold;
          }
          p:nth-child(1) {
            margin-top: 1rem;
          }
          p:nth-child(3) {
            margin-top: 1.4rem;
          }
          ul {
            height: 7rem;
            width: calc(100% - 2rem);
            padding: 0 1rem;
            margin-top: 1.2rem;
            li {
              height: 3rem;
              line-height: 3rem;
              color: #fff;
              background: #1DA39D;
              border-radius: 0.5rem;
              float: left;
              padding: 0 0.4rem;
              margin-right: 0.6rem;
              margin-bottom: 0.8rem;
              font-size: 1.4rem;
              cursor: pointer;
            }
            li:hover {
              font-weight: bold;
            }
          }
        }
      }

      /*目录*/
      .menuList {
        width: 8rem;
        line-height: 4rem;
        border: 0.1rem solid #CDDABF;
        border-radius: 0.4rem;
        position: absolute;
        right: 0rem;
        top: 5rem;
        ul {
          width: 100%;
          background: #2C8985;
          li {
            width: 100%;
            height: 36px;
            line-height: 36px;
            text-align: center;
            color: #fff;
            font-size: 14px;
            cursor: pointer;
          }
        }
      }
    }

    /*提示框-详情*/
    .model {
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.6);
      z-index: 99999;
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      .modelDetailMain {
        width: 80%;
        background: #fff;
        border-radius: 1rem;
        padding: 1rem 0;
        p {
          display: block;
          word-break: break-all;
          word-wrap: break-word;
          width: calc(100% - 2rem);
          padding: 0 1rem;
          color: #000;
          line-height: 2.8rem;
          font-size: 1.4rem;
          span {
            font-weight: bold;
          }
        }
        .modelBtn {
          width: 100%;
          display: flex;
          justify-content: center;
          button {
            width: 7.2rem;
            height: 3.4rem;
            border-radius: 0.4rem;
            border: none;
            font-size: 1.6rem;
          }
          button:nth-child(1) {
            background: #eee;
            color: rgba(0, 0, 0, 0.73);
          }
        }
      }

      /*弹窗信息*/
      .modelWindowMain {
        width: 80%;
        height: 80%;
        background: #fff;
        border-radius: 1rem;
        padding: 1rem 0;
        .modelWindowBody {
          width: 100%;
          height: calc(100% - 4rem);
          overflow: auto;
          p {
            display: block;
            word-break: break-all;
            word-wrap: break-word;
            width: calc(100% - 2rem);
            padding: 0 1rem;
            color: #000;
            line-height: 2.8rem;
            font-size: 1.4rem;
            span {
              font-weight: bold;
            }
          }
          .custAttendChart {
            width: calc(100% - 2rem);
            padding: 0 1rem;
            height: 24rem;
          }
        }
        .modelBtn {
          width: 100%;
          display: flex;
          justify-content: center;
          button {
            width: 7.2rem;
            height: 3.4rem;
            border-radius: 0.4rem;
            border: none;
            font-size: 1.6rem;
          }
          button:nth-child(1) {
            background: #eee;
            color: rgba(0, 0, 0, 0.73);
          }
        }
      }
    }

  }

</style>
