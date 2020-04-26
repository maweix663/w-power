<template>
  <div class="containerHome">
    <!--标题区-->
    <div class="header">
      <div class="title" :style="title">{{titleText}}战区防疫保电监控平台</div>
      <div class="rightBox">
        <div class="date" :style="moduleTile">{{ time }}</div>
        <div @click="menuEvent" class="railClick"><img src="../../../static/img/gis/shejimulu.png"></div>
        <div>{{ userInfoId }}</div>
      </div>
    </div>
    <!--展示区-->
    <div class="main">
      <div class="mainleft">
        <!--区域导航-->
        <div class="mapNav">
          <div class="moduleTile" :style="moduleTile">战区导航</div>
          <div class="hbMapBox">
            <!--<div class="hbMapHome" id="hbMap"></div>-->
            <div class="area">
              <p :style="areaStyleFont">指标速览</p>
              <ul>
                <li :style="areaStylePadding" v-for="(item, index) in areaArr" @click="changeData(index,item)"  :class="{activeArea:index==currentArea}">{{ item.name }}</li>
              </ul>
              <p :style="areaStyleFont">战区切换</p>
              <ul>
                <li :style="areaStylePadding" v-for="(item, index) in areaArr" v-show="index == 0?false:true" @click="skip(item)">{{ item.name }}</li>
              </ul>
            </div>
          </div>
        </div>
        <!--电网负荷情况-->
        <div class="funt">
          <div class="moduleTile" :style="moduleTile">
            电网负荷情况
          </div>
          <div class="moduleHome">
            <div class="funtLine" id="funtLine"></div>
            <div class="funtRing" id="funtRing"></div>
          </div>
        </div>
      </div>
      <div class="mainMap">
        <!--地图-->
        <div class="mapArea">
          <div class="moduleTile" :style="moduleTile">作战指挥图
          </div>
          <div class="moduleHome">
            <div id="myMap" class="myMap"></div>
            <div class="list" ref="listStyle">
              <ul :style="ulWidth">
                <li :style="liWidth" v-for="(item,index) in list" :key="index" :class="flag==index?'choosedLi':''"
                    @click="ponitClick(item, index)">
                  <div class="localIcon">
                    <img src="../../../static/img/icon2.png" alt="">
                  </div>
                  <div class="alone">
                    <span :style="listFont1">{{ item.customeName }}</span>
                    <span :style="listFont2">{{ item.address }}</span>
                    <span :style="listFont2">电话:{{ item.customeTel | custTel }}</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <!--搜索框-->
          <div class="searchArea" v-show="showSearch">
            <div class="searchFour">
              <el-select v-model="searchVal" placeholder="请选择" @change="changeSearch">
                <el-option v-for="item in searchType" :key="item" :label="item" :value="item"></el-option>
              </el-select>
            </div>
            <div class="searchOne">
              <el-input v-if="searchVal == '客户名称' || searchVal == '单位' " v-model="searchName" placeholder="请输入内容"></el-input>
              <el-input v-if="searchVal == '负荷阈值'" v-model="searchNum" placeholder="请输入内容"></el-input>
              <el-select v-if="searchVal == '级别'" v-model="searchName" placeholder="请选择">
                <el-option v-for="item in levelArr" :key="item" :label="item" :value="item"></el-option>
              </el-select>
              <el-select v-if="searchVal == '用户类别'" v-model="searchName" placeholder="请选择">
                <el-option v-for="item in custArr1" :key="item" :label="item" :value="item"></el-option>
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
        </div>

      <!--疫情情况-->
      <div class="situation">
        <div class="moduleTile" :style="moduleTile">疫情情况
        </div>
        <div class="moduleHome" id="funtPie">
        </div>
        <div class="people">
          <ul>
            <li :style="listFont2" v-for="(item, index) in people" @click="peopleClcik(item,index)" :class="{active:index==current}">{{
              item }}
            </li>
          </ul>
        </div>
      </div>

    </div>

      <div class="mainright">
        <!--重要客户供电保障-->
        <div class="custom">
          <div class="moduleTile" :style="moduleTile" >重要客户供电保障
          </div>
          <div class="moduleHome">
            <!--客户模块-->
            <div class="custModHome" id="custMod" v-if="custMod"></div>
            <div class="custModHome" v-else></div>
          </div>
        </div>
        <!--保电出勤统计-->
        <div class="attend">
          <div class="moduleTile" :style="moduleTile">保电出勤统计
          </div>
          <div class="moduleHome" id="attendMod">
          </div>
        </div>

      </div>

    </div>

    <!--目录-->
    <div class="menuList" v-show="ifMenuList">
      <ul>
        <li @click="menuList('work')">复工复产</li>
        <!--<li @click="menuList('userManage')">账号权限</li>-->
      </ul>
    </div>

    <!--信息弹窗-->
    <div class="model" v-if="showWindowModel">
      <div class="modelWindowMain">
        <div class="modelWindowBody">
          <div class="modelWindowBodyLeft">
            <p><span>客户名称：</span>{{windowModelInfo.customeName}}</p>
            <p><span>客户编号：</span>{{windowModelInfo.customeNo}}</p>
            <p><span>地址：</span>{{windowModelInfo.address}}</p>
            <p><span>客户电话(联系人)：</span>{{windowModelInfo.customeTel}}</p>
            <p><span>用户类别：</span>{{windowModelInfo.type}}</p>
            <p><span>行政区域：</span>{{windowModelInfo.adminDivision}}</p>
            <p><span>防疫保电级别：</span>{{windowModelInfo.level}}</p>
            <p><span>保电人员：</span>{{windowModelInfo.electricityKeeper}}</p>
            <p><span>保电人员电话：</span>{{windowModelInfo.electricityKeeperTel}}</p>

            <p><span>供电营业所：</span>{{windowModelInfo.electricityKeeperCompany}}</p>
            <p><span>运行容量：</span>{{windowModelInfo.capacity}}</p>
            <p><span>自备应急电源容量：</span>无</p>
            <p><span>UPS配备情况：</span>无</p>
            <p><span>第一路电源：</span>{{windowModelInfo.line1}}</p>
            <p><span>第二路电源：</span>{{windowModelInfo.line2}}</p>
          </div>
          <div class="modelWindowBodyLeft">
            <p><span>第三路电源：</span>无</p>
            <p><span>供电类型：</span>无</p>
            <p><span>自备应急电源：</span>{{windowModelInfo.emergencySupply}}</p>
            <p><span>驻点运维公司：</span>无</p>
            <p><span>失压脱扣装置：</span>无</p>
            <p><span>安全隐患：</span>{{windowModelInfo.potentialSafety}}</p>
            <p><span>备注：</span>{{windowModelInfo.remarks}}</p>
            <p v-show="!showCustAttend"><span @click="lookCustAttend(windowModelInfo.customeNo)" style="color: #7C9484;cursor: pointer;">查看客户最近20天的负荷</span></p>
            <div v-show="showCustAttend" class="custAttendChart" id="custAttendChart"></div>
          </div>
        </div>
        <div class="modelBtn">
          <button @click="closeDel">关 闭</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import echarts from 'echarts'

  export default {
    name: "wuhanHome",
    data() {
      return {
        userInfoId: localStorage.userId2,
        // 目录
        ifMenuList: false,
        // 时间-日期
        time: '',
        date: '',
        // 防疫
        epidemicTime: '',
        // 电网
        loadTime: '',
        // 出勤
        repairTime: '',
        // 跳转路径
        paths: '',
        // 区域id
        regionId: '',
        wuhRegionId: '018b01f66d0fdw36bodsaodksaod',
        titleText: '武汉',
        // 区域
        area: ['武汉', '汉口', '武昌', '汉阳', '沌口', '东新'],
        currentArea: 0,
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
        // 类别
        people: ['退休职工', '外委用工及家属', '员工家属', '在职员工'],
        current: 3,
        // 图表legend
        legend: 12,
        xyAxis: 10,
        fourhuan: 15,
        // 地图
        map: null,
        zoom: 16,
        mapName: '武汉市',
        mapStyle: '',
        list: [],
        allPt: [],
        liWidth: {
          width: null,
          float: 'left'
        },
        ulWidth: {
          width: null,
        },
        flag: -1,
        ptInfo: null,
        ptInfoLabel: true,
        // 搜索
        showAlarm: false,
        searchName: '',
        searchNum: 80,
        showSearch: false,
        searchType: ['客户名称', '单位', '用户类别', '级别', '负荷阈值', '行政区域'],
        searchVal: '客户名称',
        levelArr: ['特级', '一级', '二级', '三级'],
        custArr1: [],
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
        // 查看客户最近20天的负荷
        showCustAttend: false,
        custAttendX: [],
        custAttendY: [],

        // 防疫
        peopleItem: '在职员工',
        sit1: [],
        sit2: [],
        sit3: [],
        sit4: [],
        sit5: [],


        // 负荷
        funtLineX: [],
        funtLineY1: [],
        funtLineY2: [],
        maxFun: [],
        minFun: [],

        // 客户
        custMod: true,
        custX: [],
        custY: [],
        maxLoadRate: null,
        customerLoadRate: null,
        exceedTwenty: null,
        allCust: null,

        // 保电出勤统计
        attendX: [],
        attendY1: [],
        attendY2: [],
        attendY3: [],

        // 自适应样式
        openAdapt: false,
        // 窗口宽高
        screenWidth: document.body.clientWidth,
        screenHeight: document.body.clientHeight,
        // 区域
        areaStyleFont: {
          fontSize: '14px'
        },
        areaStylePadding: {
          padding: '4px 6px',
          fontSize: '14px',
          marginRight: '3%'
        },
        // 标题
        title: {
          fontSize: '20px'
        },
        // 模块标题
        moduleTile: {
          fontSize: '18px'
        },
        // 图表legend
        legend: 12,
        xyAxis: 10,
        fourhuan: 15,
        // 负载-环
        loadRing: 36,
        // 指挥部
        listFont1: {
          fontSize: '14px'
        },
        listFont2: {
          fontSize: '12px'
        },

      }
    },
    watch: {
      // 监听窗口变化
      screenWidth(val) {
        this.screenWidth = val;
        let _this = this;
        setTimeout(() => {
          _this.infoSize();
          //疫情
          _this.getSit();
          //客户
          _this.custEchart();
          //保电出勤
          _this.attendEchart();
          // _this.hbMap();
          // 电网
          _this.getFunt();


        }, 500)
      },

      screenHeight(val) {
        this.screenHeight = val;
        let _this = this;
        setTimeout(() => {
          _this.infoSize();
          //疫情
          _this.getSit();
          //客户
          _this.custEchart();
          //保电出勤
          _this.attendEchart();
          // _this.hbMap();
          //电网
          _this.getFunt();


        }, 500)
      },
    },
    filters: {
      // 客户电话
      custTel: function (val) {
        if (val) {
          return val.replace(/[^0-9]/ig, "").substring(0,11)
        } else {
          return '无'
        }
      },
      // 负载率数据类型
      loadNum: function (val) {
        return parseFloat(val).toFixed(2)
      }
    },
    created() {
      // 区域
      // this.titleText = this.$route.query.area;
      this.regionId = this.$route.query.regionId;

      let date2 = new Date();
      let dateYear2 = date2.getFullYear();
      let dateMonth2 = date2.getMonth() + 1;
      let dateDate2 = date2.getDate();
      if (dateMonth2 < 10) {
        dateMonth2 = "0" + dateMonth2;
      }
      if (dateDate2 < 10) {
        dateDate2 = "0" + dateDate2;
      }
      // this.date = ''+dateYear2 + dateMonth2 + dateDate2;
      this.infoSize();
      // 获取日期
      this.getDate();
    },
    mounted() {
      let _this = this;
      let timer = setInterval(() => {
        let date = new Date(); // 修改数据date
        let dateYear = date.getFullYear();
        let dateMonth = date.getMonth() + 1;
        let dateDate = date.getDate();
        let dateHours = date.getHours();
        let dateMinutes = date.getMinutes();
        if (dateMonth < 10) {
          dateMonth = "0" + dateMonth;
        }
        if (dateDate < 10) {
          dateDate = "0" + dateDate;
        }
        if (dateHours < 10) {
          dateHours = "0" + dateHours;
        }
        if (dateMinutes < 10) {
          dateMinutes = "0" + dateMinutes;
        }
        _this.time = dateYear + "-" + dateMonth + "-" + dateDate + " " + dateHours + ":" + dateMinutes;
      }, 1000)
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
            area:this.titleText,
            regionId:this.regionId,
            page: '/homeWuhan',
            type:this.typeBtn
          }
        });
      },

      // 区域改变数据
      changeData: function(index,item) {
        this.currentArea = index
        this.titleText = item.name;
        this.regionId = item.regionId;
        if(item.name!='武汉') {
            this.wuhRegionId = item.regionId;
        }else {
            this.wuhRegionId='018b01f66d0fdw36bodsaodksaod';
        }
        this.mapName = item.name+'区'
        console.log(this.currentArea)

        // 获取时间
        this.getDate();
        // this.hbMap();
      },

      //跳转
      skip(item) {
        let _this = this;
        if (item.name == "汉口" || item.name == "汉阳" || item.name == "武昌") {
          _this.paths = "/home";
        } else {
          _this.paths = "/areaHome";
        }
        this.$router.push({
          path: _this.paths,
          query: {
            area: item.name,
            regionId: item.regionId,
            type: true
          }
        });
      },

      // 窗口大小
      infoSize() {
        if (this.screenHeight >= 560 && this.screenHeight < 620) {
          // 区域
          this.areaStyleFont.fontSize = '12px';
          this.areaStylePadding.padding = '2px 4px';
          this.areaStylePadding.fontSize = '12px';
          this.areaStylePadding.marginRight = '1%';
          // 标题
          this.title.fontSize = '20px';
          // 模块标题
          this.moduleTile.fontSize = '18px';
          // 图表legend
          this.legend = 12;
          this.xyAxis = 11;
          this.fourhuan = 13;
          // 负载-环
          this.loadRing = 24;
          // 指挥部
          this.listFont1.fontSize = '14px';
          this.listFont2.fontSize = '12px';
        }

        if (this.screenHeight >= 620 && this.screenHeight < 720) {
          // 区域
          this.areaStyleFont.fontSize = '12px';
          this.areaStylePadding.padding = '2px 4px';
          this.areaStylePadding.fontSize = '12px';
          this.areaStylePadding.marginRight = '1%';
          // 标题
          this.title.fontSize = '24px';
          // 模块标题
          this.moduleTilefontSize = '22px';
          // 图表legend
          this.legend = 14;
          this.xyAxis = 12;
          this.fourhuan = 15;
          // 负载-环
          this.loadRing = 34;
          // 指挥部
          this.listFont1.fontSize = '14px';
          this.listFont2.fontSize = '12px';
        }

        if (this.screenHeight >= 720) {
          // 区域
          this.areaStyleFont.fontSize = '14px';
          this.areaStylePadding.padding = '4px 6px';
          this.areaStylePadding.fontSize = '14px';
          this.areaStylePadding.marginRight = '3%';
          // 标题
          this.title.fontSize = '24px';
          // 模块标题
          this.moduleTilefontSize = '22px';
          // 图表legend
          this.legend = 12;
          this.xyAxis = 12;
          this.xyAxis1 = 10;
          this.fourhuan = 17;
          // 负载-环
          this.loadRing = 40;
          // 指挥部
          this.listFont1.fontSize = '16px';
          this.listFont2.fontSize = '14px';
        }
        // 保障点列表
        this.guaList(this.list);
      },

      // 武汉
      hbMap() {
        let _this = this;
        let displayEchart3 = echarts.init(document.getElementById('hbMap'));
        displayEchart3.resize();
        $.get('../../../static/data/wuhanshi.json', function (chinaJson) {
          echarts.registerMap('wuhanshi', chinaJson);
          let info = {
            grid: {
              height: '100%',
              width: '100%'
            },
            geo: {
              map: 'wuhanshi',
              label: {
                show: false
              },
              top: 'center',
              left: 'center',
              roam: true,
              zoom: 1.01,
              itemStyle: {
                areaColor: '#a9bd9c',
                borderColor: '#89a67a',
                shadowColor: '#a9bd9c',
                shadowBlur: 2,
                borderWidth: 1,
                opacity: 0.6,
              },
            },
            series: [{
              name: '湖北',
              type: 'map',
              map: 'wuhanshi',
              top: 'center',
              left: 'center',
              roam: true,
              label: {
                normal: {
                  show: false,
                  position: 'inner',
                  textStyle: {
                    color: '#F2F5E7'
                  }
                },
                emphasis: {
                  show: true
                }
              },
              itemStyle: {
                normal: {
                  areaColor: '#a9bd9c',
                  borderColor: '#89a67a',
                  borderWidth: 1,
                  opacity: 0.6,
                  label: {
                    show: true,
                    color: '#ff0',
                    fontSize: 14
                  },
                  emphasis: {
                    label: {
                      show: true
                    }
                  }
                }
              },
              data: [
                {
                  name: _this.mapName,
                  selected: true,
                  itemStyle: {
                    areaColor: '#F2F5E7',
                    borderColor: '#F2F5E7',
                    shadowColor: '#F2F5E7',
                    shadowBlur: 2,
                    borderWidth: 1,
                    opacity: 1,
                  },
                  label: {
                    show: true,
                    color: '#F2F5E7'
                  }
                }
              ]
            }]
          };
          displayEchart3.setOption(info);
          displayEchart3.on('click', function (params) {
            let name = params.name;
            _this.areaClcik(name);
          });
        })
      },

      // 区域点击事件
      areaClcik(item) {
        let num = 0;
        for (let i = 0; i < this.areaArr.length; i++) {
          if (item == this.areaArr[i].adminDivision) {
            this.regionId = this.areaArr[i].divisionId;
            // 获取时间
            this.getDate()
          } else {
            num++;
            if (num == this.areaArr.length) {
              this.$message({
                message: '暂无数据',
                center: true
              })
            }
          }
        }
      },

      // 获取时间
      getDate: function () {
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
            // this.areaArr = res.data.regionList;
            // 获取级别
            this.getLevel();
            // 地图保障点
            this.getMapDot();
            // 重要客户
            this.getCust();
            //保电出勤
            this.getAttend();
            //武汉地图加载
            // this.hbMap();
            //电网运行
            this.getFunt();
            //疫情情况
            this.getSit();
            this.getCustArr();
          })
          .catch(err => {
          })
      },
      /*获取用户类别--下拉框*/
      getCustArr(){
        let param = {
          showLoading: false,
        };
        this.http.post('/homePage/selectUserType', param)
          .then(res => {
            this.custArr1 = res.data;
          })
          .catch(err => {

          })
      },
      // 电网运行
      getFunt() {
        let param = {
          showLoading: false,
          time: this.loadTime,
          regionId: this.wuhRegionId
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

      // 电网运行
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
            left: '5%',
            right: '10%',
            bottom: '3%',
            containLabel: true
          },
          tooltip: {
            trigger: 'axis'
          },
          xAxis: {
            name: '日期',
            type: 'category',
            boundaryGap: false,
            axisTick: { //y轴刻度线
              show: false
            },

            splitLine: { //网格线
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#674f2a',
                width: 1,
              }
            },
            axisLabel: {
              show: true,
              textStyle: {
                fontSize: _this.xyAxis,
                color: '#674f2a'
              },
            },
            data: _this.funtLineX
          },
          yAxis: {
            name: '单位（万千瓦）',
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
                width: 1,
              }
            },
            axisLabel: {
              show: true,
              formatter:'{value} ',
              textStyle: {
                fontSize: _this.xyAxis,
                color: '#674f2a'
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
                  color: '#fe5e76'
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
                  color: '#f28208'
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
            right: '2%',
            y: 'center',
            itemWidth: 3,
            itemHeight: 10,
            itemGap: 10,
            textStyle: {
              color: '#7a8c9f',
              fontSize: _this.xyAxis - 1,
              lineHeight: 14,
              rich: {
                percent: {
                  color: '#536944',
                  fontSize: _this.xyAxis + 2,
                },
                percent1: {
                  color: '#ff6976',
                  fontSize: _this.xyAxis + 1,
                }, percent2: {
                  color: '#ed6f64',
                  fontSize: _this.xyAxis + 1,
                },
              },
            },
            formatter: name => {
              switch (name) {
                case '昨日最大负荷':
                  return (
                    '昨日最大负荷{percent|' + _this.maxFun[0] + '}万千瓦\n\n 比前一天' + _this.maxFun[2] + '{percent2|' + _this.maxFun[1] + '%\n}'
                  );
                case '昨日最小负荷':
                  return (
                    '昨日最小负荷{percent|' + _this.minFun[0] + '}万千瓦\n\n 比前一天' + _this.minFun[2] + '{percent2|' + _this.minFun[1] + '%} '
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
              radius: ['55%', '65%'],
              center: ['20%', '50%'],
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
                        offset: 0, color: '#3cab85', // 0% 处的颜色
                      }, {
                        offset: 1, color: '#3b7084', // 100% 处的颜色
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
                        offset: 1, color: '#ee9b1d',
                      }, {
                        offset: 0, color: '#f9731f',
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
      // 地图
      loadmap() {
        this.map = new AMap.Map('myMap', {
          resizeEnable: true,
          zoom: 16,
          center: [114.341743, 30.546034],
          /*114.341743, 30.546034*/
          mapStyle: 'amap://styles/normal',
          // mapStyle: this.mapStyle,
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

      //点击人类型
      peopleClcik(item, index) {
        this.current = index;
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

        console.log(this.sit5)
      },

      //取得疫情数据
      getSit() {
        if( this.epidemicTime == null) {
          this.sit1 = [{all: '0', now: '0', retire: '0', die: '0',},{all: '0', now: '0', retire: '0', die: '0',},{all: '0', now: '0', retire: '0', die: '0',}];
          this.sit2 = [{all: '0', now: '0', retire: '0', die: '0',},{all: '0', now: '0', retire: '0', die: '0',},{all: '0', now: '0', retire: '0', die: '0',}];
          this.sit3 = [{all: '0', now: '0', retire: '0', die: '0',},{all: '0', now: '0', retire: '0', die: '0',},{all: '0', now: '0', retire: '0', die: '0',}];
          this.sit4 = [{all: '0', now: '0', retire: '0', die: '0',},{all: '0', now: '0', retire: '0', die: '0',},{all: '0', now: '0', retire: '0', die: '0',}];
          this.sit5 = [{all: '0', now: '0', retire: '0', die: '0',},{all: '0', now: '0', retire: '0', die: '0',},{all: '0', now: '0', retire: '0', die: '0',}];
          this.funtPieEchart();
          return
        }
        this.current = 3;
        let param = {
          showLoading: false,
          time: this.epidemicTime,
          regionId:this.regionId
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
        let attendPie = this.$echarts.init(document.getElementById('funtPie'));
        attendPie.resize();
        attendPie.setOption(
          {
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b}: {c} ({d}%)'
            },
            title: [
              {
                text: '{a|累计确诊人数  }' + this.sit5[0].all + '{a|  人}',
                left: '7%',
                top: '15%',
                textStyle: {
                  rich: {
                    a: {
                      fontFamily: 'SourceHanSansCN-Regular',
                      fontWeight: '400',
                      color: "#674f2a",
                      fontSize: _this.legend,
                      align: 'center',
                      textAlign: 'center'
                    },
                  }
                },
              }, {
                text: '{a|累计疑似  }' + this.sit5[1].all + '{a|  人}',
                left: '43%',
                top: '15%',
                textStyle: {
                  rich: {
                    a: {
                      fontFamily: 'SourceHanSansCN-Regular',
                      fontWeight: '400',
                      color: "#674f2a",
                      fontSize:  _this.legend,
                      align: 'center',
                      textAlign: 'center'
                    },
                  }
                },
              }, {
                text: '{a|累计发热待查  }' + this.sit5[2].all + '{a|  人}',
                left: '75%',
                top: '15%',
                textStyle: {
                  rich: {
                    a: {
                      fontFamily: 'SourceHanSansCN-Regular',
                      fontWeight: '400',
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
                radius: ['50%', '65%'],
                center: ['15%', '65%'],
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
                radius: ['50%', '65%'],
                center: ['50%', '65%'],
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
                radius: ['50%', '65%'],
                center: ['85%', '65%'],
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
            this.custArr = res.data.exceedTwentyList;
            let data = res.data.customerInfo;
            this.custX = [];
            this.custY = [];
            // let xData = [];
            for (let i = 0; i < data.length; i++) {
              this.custX.push(data[i].name);
              this.custY.push(data[i].count);
            }
            // let strArr = ['三级', '二级','一级','特级'];
            // let name, xRep, xStr;
            // for(let n = strArr.length - 1; n >= 0; n--) {
            //   let num = 0;
            //   for(let m = xData.length - 1; m >= 0; m--) {
            //     if(xData[m].indexOf(strArr[n]) >= 0) {
            //       xRep = xData[m].replace('('+strArr[n]+')','');
            //       if(num == 0) {
            //         xStr = strArr[n] + '  ' +xRep;
            //         num++;
            //       } else {
            //         xStr = xRep;
            //       }
            //       this.custX.unshift(xStr);
            //     }
            //   }
            // }
            let _this = this;
            this.$nextTick(function () {
              // 客户模块
              _this.custEchart();
            })
          })
          .catch(err => {
          })
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
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {
            data: ['保障点客户数'],
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
            left: '1%',
            right:'8%',
            top: '12%',
            bottom: '1%',
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
                width: 1,
              }
            },
            axisLabel: {
              show: true,
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
                  color: '#58b2af',
                  label: {
                    show: true,
                    position: 'right',
                    textStyle: {
                      color: '#58b2af',
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
            left: '1%',
            right: '10%',
            top: '18%',
            bottom: '1%',
            containLabel: true
          },
          xAxis: [{
            name:'日期',
            type: 'category',
            data: _this.attendX,
            axisTick: { //y轴刻度线
              show: false
            },
            splitLine: { //网格线
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#674f2a',
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
            name:'次数',
            type: 'value',
            axisTick: { //y轴刻度线
              "show": false
            },
            splitLine: { //网格线
              "show": false
            },
            axisLine: {
              lineStyle: {
                color: '#674f2a',
                width:1,
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

      // 获取级别
      getLevel() {
        this.http.post('/homePage/findMapShowLocationInfo', '')
          .then(res => {
            // this.levelArr = res.data.levels;
          })
          .catch(err => {
          })
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
                _this.guaList(data);
              })
            }
          })
          .catch(err => {
          })
      },

      // 所有客户
      allListData() {
        this.showAlarm = false;
        let data = this.allPt;
        let _this = this;
        this.$nextTick(function () {
          _this.guaList(data);
        })
      },

      // 保障点列表
      guaList(data) {
        let _this = this;
        this.$nextTick(function () {
          let listWidth = _this.$refs.listStyle.offsetWidth;
          _this.liWidth.width = (listWidth / 4) + 'px';
          _this.ulWidth.width = listWidth + 'px';
          _this.ulWidth.width = (listWidth / 4) * data.length + 60 + 'px';
          _this.liWidth.left = 'left';
          $(".mCSB_container").css("width", _this.ulWidth.width);
          $(".list").mCustomScrollbar({axis: "x"});
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
        this.ptInfo.on('click', function (param) {
          _this.windowInfo(data)
        })
      },

      // 关闭
      closeDel() {
        this.showWindowModel = false;
        this.showCustAttend = false;
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

        this.showWindowModel = true;
        this.windowModelInfo = data;

        let title = "";
        this.content = [];
        this.content.push('客户名称：' + data.customeName);
        this.content.push('客户编号：' + data.customeNo);
        this.content.push('地址：' + data.address);
        this.content.push('客户电话(联系人)：' + data.customeTel);
        this.content.push('用户类别：' + data.type);
        this.content.push('行政区域：' + data.adminDivision);
        this.content.push('防疫保电级别：' + data.level);
        this.content.push('保电人员：' + data.electricityKeeper);
        this.content.push('保电人员电话：' + data.electricityKeeperTel);
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
        // this.$nextTick(function () {
        //   $(".custom-info").mCustomScrollbar();
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

    },
  }

</script>

<style lang="scss" scope>
  .containerHome {
    width: 100%;
    height: 100%;
    background: url("../../../static/img/bg.png") no-repeat;
    background-size: 100% 100%;

    /*公共模块*/
    @mixin mixin-mainBox {
      /*background: #00356f;*/
    }

    @mixin mixin-mainChildBox {
      border-radius: 10px;
      background: #d2dcc550;
      border: 1px solid #b9c9aa;
    }

    /*标题区*/
    .header {
      width: 100%;
      height: 50px;
      line-height: 50px;
      position: relative;
      font-size: 20px;

      & > .title {
        width: 100%;
        text-align: center;
        color: #508799;
        font-weight: bold;
        /*padding-top: 10px;*/
      }

      .rightBox {
        height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        top: 0;
        right: 20px;
        overflow: hidden;
        .date {
          color: #6F7696;
          font-family: dig;
          font-size: 18px;
          margin-right: 10px;
        }
        .railClick {
          cursor: pointer;
          margin-right: 10px;
          img {
            width: 16px;
            height: 16px;
          }
        }
      }
    }

    /*模块标题*/
    .moduleTile {
      width: 100%;
      height: 40px;
      line-height: 40px;
      padding-left: 20px;
      font-size: 18px;
      color: #536844;
      font-weight: bold;
    }

    .moduleHome {
      width: calc(100% - 20px);
      height: calc(100% - 50px);
      padding: 0px !important;
      position: relative;
      margin: auto;
    }

    /*展示区*/
    .main {
      width: calc(100% - 40px);
      height: calc(100% - 90px);
      padding: 20px;
      /*background: #00356f;*/
      & > div {
        @include mixin-mainBox;
        height: 100%;
        float: left;
      }
      .mainMap {
        width: calc(52% - 40px);
        margin-left: 20px;
        margin-right: 20px;
      }
      .mainright {
        width: 24%;
      }
      .mainleft {
        width: 23%;
      }
    }

    .mainleft {
      .mapNav {
        @include mixin-mainChildBox;
        width: 100%;
        height: 40%;
      }

      .funt {
        @include mixin-mainChildBox;
        width: 100%;
        height: calc(60% - 20px);
        margin-top: 20px;
      }
    }

    .mainright {
      .custom {
        @include mixin-mainChildBox;
        width: 100%;
        height: 54%;
      }

      .attend {
        @include mixin-mainChildBox;
        width: 100%;
        height: calc(46% - 20px);
        margin-top: 20px;
      }
    }

    .mainMap {
      .mapArea {
        @include mixin-mainChildBox;
        width: 100%;
        height: 70%;
      }
      .situation {
        @include mixin-mainChildBox;
        width: 100%;
        height: calc(30% - 20px);
        margin-top: 20px;
      }
    }

    /*各个模块*/
    /*地图*/
    .mapArea {
      width: calc(100% - 20px);
      height: 65%;
      margin: auto 10px;
      position: relative;

      .myMap {
        width: 100%;
        height: calc(100% - 80px);
      }
      .list {
        width: 100%;
        height: 80px;
        ul {
          /*width: 100%;*/
          height: 70px;
          overflow: hidden;
          li {
            /*float: left;*/
            /*width: calc(25% - 12px);*/
            display: inline-block;
            height: calc(100% - 12px);
            padding: 6px;
            cursor: pointer;
            .localIcon {
              float: left;
              width: 30px;
              height: 100%;
              text-align: center;
              img {
                width: 16px;
                height: 16px;
                margin-top: 6px;
              }
            }
            .alone {
              float: left;
              width: calc(100% - 30px);
              height: 100%;
              span {
                display: inline-block;
                width: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }

            }
          }
        }
      }
      .searchArea {
        position: absolute;
        top: 5px;
        right: 20px;
        width: 312px;
        .searchTwo {
          width: 60px;
          float: left;
        }
        .searchThree {
          float: left;
          width: 6px;
          height: 34px;
          line-height: 34px;
          color: #63FAFB;
        }
        .searchFour {
          float: left;
          width: 104px;
          height: 100%;
        }
        .searchOne {
          float: left;
          width: 208px;
          height: 100%;
          position: relative;
          .img1 {
            width: 18px;
            height: 18px;
            position: absolute;
            top: 8px;
            right: 10px;
            cursor: pointer;
          }
          .img2 {
            width: 20px;
            height: 20px;
            position: absolute;
            right: -16px;
            top: -16px;
            cursor: pointer;
          }
        }
      }
      .img3 {
        width: 18px;
        height: 18px;
        position: absolute;
        right: 40px;
        top: 10px;
        cursor: pointer;
      }
      .img4 {
        width: 18px;
        height: 18px;
        position: absolute;
        right: 5px;
        top: 10px;
        cursor: pointer;
      }
    }

    .hbMapBox {
      width: 100%;
      height: calc(100% - 40px);
      .hbMapHome {
        width: 100%;
        height: calc(100% - 56px);
      }
      .area {
        height: 100%;
        width: 100%;
        p {
          float: left;
          display: block;
          width: 100%;
          margin-left: 10px;
          font-weight: 400;
        }
        p:nth-child(1) {
          margin-top: 5px;
        }
        p:nth-child(3) {
          margin-top: 5px;
        }
        ul {
          float: left;
          display: block;
          width: calc(100% - 20px);
          padding: 0 10px;
          margin-top: 6px;
          li {
            color: #674f2a;
            background: #D7DECE;
            border-radius: 5px;
            float: left;
            margin-bottom: 4px;
            cursor: pointer;
          }
          li:hover {
            background: #ABBE9E;
            color: #F2F5E7;
          }
        }
      }
    }

    /*疫情情况*/
    .situation {
      width: calc(100% - 20px);
      height: calc(30% - 20px);
      margin: 20px 10px auto 10px;
      position: relative;
    }

    .people {
      height: 10%;
      width: 80%;
      position: absolute;
      top: 5px;
      right: 0px;
      ul {
        height: 100%;
        width: calc(100% - 20px);
        padding: 0 10px;
        li {
          height: 100%;
          color: #536844;
          float: right;
          margin-right: 5%;
          font-size: 16px;
          cursor: pointer;
        }
      }
    }

    /*客户模块*/
    .custModHome {
      width: 100%;
      height: 100%;
    }

    /*电网运行*/
    .funt {
      .funtLine {
        width: 100%;
        height: 60%;
      }
      .funtRing {
        width: 100%;
        height: 40%;
      }
    }

    .active {
      background: rgba(118, 189, 118, 0.4);
      border: 1px solid #70af50;
      border-radius: 5px;
      padding: 2px 5px;
    }
    .activeArea {
      background: #ABBE9E !important;
      color: #F2F5E7 !important;
    }

    /*目录*/
    .menuList {
      width: 100px;
      line-height: 40px;
      border: 1px solid #CDDABF;
      border-radius: 4px;
      position: absolute;
      right: 20px;
      top: 50px;
      ul {
        width: 100%;
        background: #F2F5E7;
        li {
          width: 100%;
          height: 36px;
          line-height: 36px;
          text-align: center;
          font-size: 14px;
          cursor: pointer;
        }
        li:hover {
          background: #CDDABF;
        }
      }
    }

    /*信息弹窗*/
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
      .modelWindowMain {
        width: calc(52% - 40px);
        height: 60%;
        background: #DDE3C9;
        border-radius: 1rem;
        padding: 1rem 0;
        .modelWindowBody {
          width: 100%;
          height: calc(100% - 4rem);
          overflow-y: auto;
          .modelWindowBodyLeft {
            width: 50%;
            float: left;
            p {
              width: calc(100% - 2rem);
              float: left;
              display: inline-block;
              word-break: break-all;
              word-wrap: break-word;
              padding: 0 1rem;
              color: #000;
              line-height: 2.8rem;
              font-size: 1.4rem;
              font-weight: bold;
              span {
                font-weight: 400;
              }
            }
            p:nth-child(2n) {
              background: #D1D9B3;
            }
            .custAttendChart {
              float: left;
              width: calc(94% - 2rem);
              padding: 0 1rem;
              height: 24rem;
            }
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
            cursor: pointer;
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
