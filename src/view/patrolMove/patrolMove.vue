<template>
  <div class="containerPatrolMove">
    <div class="containerPatrolMoveMain">
      <!--标题头-->
      <div class="header">
        <div class="ret" @click="retPage">
          <img src="../../../static/img/move/ret.png" alt="">
          <span>返回</span>
        </div>
        <div class="title">{{ title }}战区巡检GIS</div>
      </div>

      <!--地图-->
      <div class="mapMod">
        <div id="myMap" class="myMap"></div>
        <div class="list" v-show="labelIndex==1">
          <ul :style="ulWidth">
            <li :style="liWidth" v-for="(item,index) in list" :key="index" :class="flag==index?'choosedLi':''"
                @click="ponitClick(item, index)">
              <div class="localIcon">
                <a :href="'https://uri.amap.com/marker?position='+item.lng+','+item.lng+'&name='+item.address">
                  <img :src="'../../../static/img/gis/'+ item.levelNo +'.png'" alt="">
                </a>
              </div>
              <div class="alone">
                <span :style="listFont1">{{ item.customeName }}</span>
                <span :style="listFont2">{{ item.address }}</span>
                <!--<span :style="listFont2" >电话:<a :href="'tel:'+ item.customeTel | custTel2">{{ item.customeTel | custTel }} <img src="../../../static/img/phone.png" alt=""></a></span>-->
                <span :style="listFont2" >电话: {{ item.customeTel }}</span>
              </div>
            </li>
          </ul>
        </div>
        <!--线路列表-->
        <div class="lineListBox" v-show="labelIndex==2">
          <ul :style="ulWidth">
            <li :style="liWidth" v-for="(item,index) in lineList" :key="index" :class="flag==index?'choosedLi':''">
              <div class="alone">
                <span>{{ item.lineName }}</span>
                <span v-if="item.level == 0">低级</span>
                <span v-if="item.level == 1">正常</span>
                <span v-if="item.level == 2">高级</span>
                <span v-if="item.level == 3">最高级</span>
                <span>
                  <p @click="lookLine(item)">查看</p>
                  <p @click="editLine(item)" v-show="item.type==1">编辑</p>
                  <p @click="delLine(item)" v-show="item.type==1">删除</p>
                </span></div>
            </li>
          </ul>
        </div>

        <!--搜索框-->
        <div class="searchArea" v-show="showSearch">
          <div class="searchOne">
            <el-input v-model="searchName" :placeholder="placeholder"></el-input>
            <img class="img1" @click="searchData" src="../../../static/img/search.png" alt="">
            <img class="img2" @click="showSearch = false" src="../../../static/img/qingkong2.png" alt="">
          </div>
        </div>
        <img class="img3" @click="showSearch = true" v-show="!showSearch" src="../../../static/img/search.png" alt="">

        <!--客户线路标签-->
        <div class="labelType">
          <span @click="labelChange(1)" :style="labelIndex==1?labelTypeStyle:''">客户</span>
          <span @click="labelChange(2)" :style="labelIndex==2?labelTypeStyle:''">路线</span>
        </div>

        <!--级别选择图片-->
        <div class="levelSelectImg" @click="ifLevelSelect = !ifLevelSelect" v-show="labelIndex == 1">
          <img src="../../../static/img/gis/levelSelect.png" alt="">
        </div>

        <!--级别选择-->
        <div class="levelSelect" v-show="ifLevelSelect">
          <el-checkbox-group v-model="checkListLevel" @change="changeLevel">
            <p><el-checkbox label="特级"></el-checkbox></p>
            <p><el-checkbox label="一级"></el-checkbox></p>
            <p><el-checkbox label="二级"></el-checkbox></p>
            <p><el-checkbox label="三级" ></el-checkbox></p>
          </el-checkbox-group>
        </div>

        <!--新建/编辑线路-->
        <div class="lineDotModule" v-if="selectLineArr.length > 0" :style="showDotBoxStyle">
          <div class="lineDotModuleBox">
            <div class="lineInput">
              <el-input v-model="lineName" placeholder="请输入线路名称"></el-input>
            </div>
            <div class="lineRadio">
              <el-radio v-model="lineRadio" label="0">低级</el-radio>
              <el-radio v-model="lineRadio" label="1">正常</el-radio>
              <el-radio v-model="lineRadio" label="2">高级</el-radio>
              <el-radio v-model="lineRadio" label="3">最高级 </el-radio>
            </div>
            <div class="lineDotModuleBody">
              <ul>
                <li v-for="(item, index) in selectLineArr" :key="index">
                  <span @click="ponitClick(item, index)">{{ item.customeName }}</span>
                  <span @click="lineDotDel(index)">删除</span>
                </li>
              </ul>
            </div>
            <div class="modelBtn">
              <button @click="subLine">保 存</button>
              <button @click="closeLineMod">关 闭</button>
              <button @click="closeAllLineMod">全部删除</button>
            </div>
            <p class="showDotBox" @click="changeDotBox(1)" v-show="showDotBox"><i class="el-icon-arrow-down"></i></p>
            <p class="showDotBox" @click="changeDotBox(2)" v-show="!showDotBox"><i class="el-icon-arrow-up"></i></p>
          </div>
        </div>


        <!--搜索框-->
        <!--<div class="searchArea" v-show="showSearch">-->
          <!--<div class="searchFour">-->
            <!--<el-select v-model="searchVal" placeholder="请选择" @change="changeSearch">-->
              <!--<el-option v-for="item in searchType" :key="item" :label="item" :value="item"></el-option>-->
            <!--</el-select>-->
          <!--</div>-->
          <!--<div class="searchOne">-->
            <!--<el-input v-if="searchVal == '客户名称' || searchVal == '单位'" v-model="searchName"-->
                      <!--placeholder="请输入内容"></el-input>-->
            <!--<el-input v-if="searchVal == '负荷阈值'" v-model="searchNum" placeholder="请输入内容"></el-input>-->
            <!--<el-select v-if="searchVal == '级别'" v-model="searchName" placeholder="请选择">-->
              <!--<el-option v-for="item in levelArr" :key="item" :label="item" :value="item"></el-option>-->
            <!--</el-select>-->
            <!--<el-select v-if="searchVal == '用户类别'" v-model="searchName" placeholder="请选择">-->
              <!--<el-option v-for="item in userTypeSelect" :key="item" :label="item" :value="item"></el-option>-->
            <!--</el-select>-->
            <!--<el-select v-if="searchVal == '行政区域'" v-model="searchName" placeholder="请选择">-->
              <!--<el-option v-for="item in administrationArr" :key="item" :label="item.adminDivision"-->
                         <!--:value="item.divisionId"></el-option>-->
            <!--</el-select>-->
            <!--<img class="img1" @click="searchData" src="../../../static/img/search.png" alt="">-->
            <!--<img class="img2" @click="showSearch = false" src="../../../static/img/qingkong2.png" alt="">-->
          <!--</div>-->
        <!--</div>-->
        <!--<img class="img3" @click="showSearch = true" v-show="!showSearch" src="../../../static/img/search.png" alt="">-->
        <!--<img class="img4" @click="allListData" src="../../../static/img/all.png" alt="" title="所有客户">-->
        <!--<img class="rail" v-show="title != '武汉'" @click="railPage" src="../../../static/img/move/rail.png" alt="" title="所有客户">-->
      </div>
    </div>

    <!--弹窗信息-->
    <div class="model" v-if="showWindowModel">
      <div class="modelWindowMain">
        <div class="modelWindowBody">
          <p><span>客户名称：</span>{{windowModelInfo.customeName}}</p>
          <p><span>客户编号：</span>{{windowModelInfo.customeNo}}</p>
          <!--<p><span>地址：</span><a :href="'https://uri.amap.com/marker?position='+windowModelInfo.lng+','+windowModelInfo.lat+'&name='+windowModelInfo.address">{{windowModelInfo.address}}</a></p>-->
          <p><span>地址：</span><span style="color: #4747F3;" @click="navMove(windowModelInfo)">{{windowModelInfo.address}}</span></p>
          <p><span>客户电话(联系人)：</span><a target="_blank" :href="'tel: ' + tel1">{{windowModelInfo.customeTel}}</a></p>
          <p><span>用户类别：</span>{{windowModelInfo.type}}</p>
          <p><span>行政区域：</span>{{windowModelInfo.adminDivision}}</p>
          <p><span>巡检级别：</span>{{windowModelInfo.levelNoName}}</p>
          <p><span>防疫保电级别：</span>{{windowModelInfo.levelNumName}}</p>
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
        </div>
        <div class="modelBtn">
          <button @click="selectDot(windowModelInfo)">选 择</button>
          <button @click="closeDel">关 闭</button>
        </div>
      </div>
    </div>

    <!--提示框-删除-->
    <div class="model" v-if="showModel">
      <div class="modelMain">
        <div class="modelTitle">您确认删除吗?</div>
        <div class="modelBtn">
          <button @click="cancelModel">取消</button>
          <button @click="deteModel">确定</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  export default {
    name: "patrolMove",
    data() {
      return {
        // 宽高-屏幕尺寸
        screenWidth: document.body.clientWidth,
        screenHeight: document.body.clientHeight,

        title: '',
        regionId: '',
        typeBtn: '',
        page: '',

        // 标签切换
        labelIndex: 1,
        drawOneType: true,
        ifPosition: true,
        labelTypeStyle: {
          background: '#DAE3D1'
        },

        // 是否显示客户点
        showDotBox: false,
        showDotBoxStyle: {
          top: '0rem'
        },

        // 地图
        map: null,
        zoom: 16,
        mapStyle: '',
        list: [],
        listArr: [],
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
          {customeNo: "6813368245", name: '光谷科技会展中心方舱医院定点医院', lnglat: [114.508811, 30.490224]},
          {customeNo: "6608307552", name: '武汉国际博览中心方舱医院定点医院', lnglat: [114.260066, 30.577000]},
          {customeNo: "0004041803", name: '华中科技大学同济医学院附属协和医院', lnglat: [114.274696, 30.58407]},
          {customeNo: "0025127812", name: '武汉体育中心方舱医院定点医院', lnglat: [114.260066, 30.577]},
          {customeNo: "0006026964", name: '省疫情防控指挥部', lnglat: [114.355801, 30.568398]}],
        levelIcon: ['特级', '一级', '二级', '三级'],

        // 指挥部
        listFont1: {
          fontSize: '1.4rem'
        },
        listFont2: {
          fontSize: '1.2rem'
        },

        // 弹窗
        showWindowModel: false,
        windowModelInfo: null,
        tel1: null,
        tel2: null,

        // 选择路线点
        ifLineModule: false,
        lineName: '',
        placeholder: '请输入客户名称',
        selectLineArr: [],
        selectLineIdArr: [],
        lineRadio: '1',
        polyline: null,
        polylineArr: [],

        // 是否显示级别
        ifLevelSelect: false,
        // 选择级别
        checkListLevel: [],

        // 线路列表
        lineList: [],

        // 编辑线
        addEditType: true,
        editData: null,

        // 删除-遮罩层
        delId: '',
        showModel: false,

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
    created() {
      this.title = this.$route.query.title;
      this.regionId = this.$route.query.regionId;
      this.typeBtn = this.$route.query.typeBtn;
      this.page = this.$route.query.page;

      // 地图保障点
      this.getMapDot();
    },
    mounted: function () {
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
      // 返回
      retPage() {
        this.$router.push({
          path: this.page,
          query: {
            title: this.title,
            regionId: this.regionId,
            typeBtn: this.typeBtn,
          }
        });
      },

      // 导航
      navMove(data) {
        this.$router.push({
          path: '/navMove',
          query: {
            title: this.title,
            regionId: this.regionId,
            page: '/patrolMove',
            typeBtn: true,
            data: data
          }
        });
      },

      // 地图
      loadmap() {
        this.map = new AMap.Map('myMap', {
          resizeEnable: true,
          zoom: 14,
          center: [114.309277, 30.542268],
          mapStyle: 'amap://styles/normal',
        });
      },

      // 标签切换
      labelChange(index) {
        this.searchName = '';
        this.map.clearMap();
        if(index == 1) {
          this.labelIndex=1;
          this.placeholder='请输入客户名称';
          this.addEditType = true;
          this.dotPoint(this.list);
        } else {
          this.labelIndex=2;
          this.placeholder='请输入线路名称';
          this.addEditType = false;
          this.ifLevelSelect = false;
          // 关闭弹窗
          this.closeDel();
          // 关闭线弹窗
          this.closeLineMod();
          // 线路列表
          this.getLineList();
          // 获取搜索线路客户
          this.getLinePoint();
        }
      },

      // 新建围栏-围栏列表盒子
      changeDotBox(data) {
        this.showDotBox = !this.showDotBox;
        if(data == 1) {
          this.showDotBoxStyle.top = '0rem'
        } else {
          this.showDotBoxStyle.top = '-28rem'
        }
      },

      // 级别选择
      changeLevel() {
        this.map.clearMap();
        // 搜索客户
        this.searchCust();
      },

      // 保障点搜索
      searchData() {
        this.map.clearMap();
        if(this.labelIndex == 1) {
          // 搜索客户
          this.searchCust();
        } else {
          // 搜索线路
          this.searchLine();
          // 获取搜索线路客户
          this.getLinePoint();
        }
      },

      // 搜索客户
      searchCust() {
        let levelStr = '';
        if(this.checkListLevel.length > 0) {
          levelStr = JSON.stringify(this.checkListLevel)
        }
        let params = {
          showLoading: false,
          level: levelStr,
          searchParam: this.searchName,
          regionId: this.regionId
        };
        let data;
        let _this = this;
        this.http.post('/inspection/getInspections', params)
          .then(res => {
            data = res.data;
            _this.listArr = data;
            _this.guaList(data);
            this.$message({
              type: 'success',
              message: "搜索成功",
              center: true
            })
          })
          .catch(err => {
            this.listArr = [];
            this.dotPoint(data);
            this.$message({
              type: 'error',
              message: "搜索失败",
              center: true
            })
          })
      },

      // 搜索线路
      searchLine() {
        let params = {
          showLoading: false,
          level: '',
          lineName: this.searchName,
          regionId: this.regionId
        };
        let data;
        let _this = this;
        this.http.post('/inspection/getLines', params)
          .then(res => {
            data = res.data;
            _this.lineList = data;
            _this.guaList(data);
            this.drawOneType = false;
            this.ifPosition = false;
            for(let i = 0; i < data.length;i++) {
              // 绘制线
              _this.drawLine(data[i].latLng, data[i].level);
            }
            this.$message({
              type: 'success',
              message: "搜索成功",
              center: true
            })
          })
          .catch(err => {
            _this.lineList = [];
            // this.dotPoint(data);
            this.$message({
              type: 'error',
              message: "搜索失败",
              center: true
            })
          })
      },

      // 获取搜索线路客户
      getLinePoint() {
        let params = {
          showLoading: false,
          level: '',
          lineName: this.searchName,
          regionId: this.regionId
        };
        let data;
        let _this = this;
        this.http.post('/inspection/getLineListCustomer', params)
          .then(res => {
            if (res.code === 0) {
              data = res.data;
              // 保障点
              this.$nextTick(function () {
                // 打点
                _this.dotPoint(data);
              })
            }
          })
          .catch(err => {})
      },

      // 地图保障点
      getMapDot() {
        let params = {
          showLoading: false,
          level: '',
          searchParam: '',
          regionId: this.regionId
        };
        let data;
        let _this = this;
        this.http.post('/inspection/getInspections', params)
          .then(res => {
            if (res.code === 0) {
              data = res.data;
              _this.listArr = data;
              _this.allPt = data;
              // 保障点
              this.$nextTick(function () {
                _this.guaList(data);
              })
            }
          })
          .catch(err => {})
      },

      // 获取线路列表
      getLineList() {
        let params = {
          showLoading: false,
          level: '',
          lineName: '',
          regionId: this.regionId
        };
        let data;
        let _this = this;
        if(this.polylineArr.length > 0) {
          this.map.remove(this.polylineArr);
        }
        this.http.post('/inspection/getLines', params)
          .then(res => {
            if (res.code === 0) {
              data = res.data;
              _this.lineList = data;
              this.drawOneType = false;
              this.ifPosition = false;
              // 保障点
              this.$nextTick(function () {
                _this.guaList(data);
              })
            }
          })
          .catch(err => {
            this.lineList = [];
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
          if(_this.labelIndex == 1) {
            _this.list = data;
            // 打点
            _this.dotPoint(data);
          } else {
            _this.linelist = data;
            for(let i = 0; i < data.length;i++) {
              // 绘制线
              _this.drawLine(data[i].latLng, data[i].level);
            }
          }

        })
      },

      // 打点
      dotPoint(datas) {
        if (this.map != null) {
          // this.map.clearMap();
        }
        let imgIcon;
        let iconSize=20;
        let _this = this;
        for (let i = 0; i < datas.length; i++) {
          let data = datas[i];
          if (data.lng == null || data.lat == null) {
            continue;
          }
          imgIcon = '../../../static/img/gis/'+data.levelNo+'.png';
          iconSize = 20;
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
            offset: new AMap.Pixel(-10, 5),
            position: lnglat
          });

          // if(this.ptInfoLabel) {
          //   this.ptInfo.setLabel({
          //     offset: new AMap.Pixel(-10, -6),  //设置文本标注偏移量
          //     content: "<div class='ptLabel'>" + data.customeName.substring(0, 5) + "...</div>", //设置文本标注内容
          //     direction: 'top' //设置文本标注方位
          //   });
          // }

          this.ptInfo.setLabel({
            offset: new AMap.Pixel(0, -5),  //设置文本标注偏移量
            content: "<div style='background: #fff;'>" + data.customeName + "</div>", //设置文本标注内容
            direction: 'top' //设置文本标注方位
          });

          this.ptInfo.on('click', function (param) {
            _this.windowInfo(data)
          })
        }
        // this.redFlagDot();
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
        // this.$nextTick(function () {
        //   if(_this.ptInfoLabel) {
        //     _this.map.setZoomAndCenter(_this.zoom, arr[nn].lnglat);
        //   }
        // })

        // if(this.showAllListData) {
        //   this.$message({
        //     type: 'success',
        //     message: "成功显示所有客户",
        //     center: true
        //   })
        // }
      },

      // 保障点点击事件
      ponitClick(item, index) {
        let lnglat = [parseFloat(item.lng), parseFloat(item.lat)];
        this.map.setZoomAndCenter(this.zoom, lnglat);
        // 点定位
        let imgIcon = '';
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
          offset: new AMap.Pixel(-10, 5),
          position: lnglat
        });

        this.map.setZoomAndCenter(18, lnglat);
        // 弹窗事件-图标点击事件
        let _this = this;
        this.windowInfo(item);
        this.ptInfo.on('click', function (param) {
          _this.windowInfo(item)
        })
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
      },

      // 关闭
      closeDel() {
        this.showWindowModel = false;
        this.windowModelInfo = null;
      },

      // 选择点
      selectDot(data) {
        this.selectLineIdArr = [];
        this.selectLineArr.push(data);
        let pathArr = [];
        for(let i = 0; i < this.selectLineArr.length; i++) {
          let item = this.selectLineArr[i];
          let lnglat = [parseFloat(item.lng), parseFloat(item.lat)];
          pathArr.push(lnglat);
          this.selectLineIdArr.push(item.id);
        }
        this.drawOneType = true;
        this.ifPosition = true;
        this.drawLine(pathArr, 1);

        // 关闭
        this.closeDel();
      },


      // 绘制线
      drawLine(arr, index) {
        if(this.labelIndex == 1 && this.polyline) {
          this.map.remove(this.polyline);
        }
        if(this.drawOneType && this.selectLineArr.length <= 1) {
          return
        }
        let colorArr = ['#9dada1', '#00706b', '#e78083', '#e70e2f'];
        let _this = this;
        this.polyline = new AMap.Polyline({
          path: arr,
          isOutline: true,
          outlineColor: '#ffeeff',
          borderWeight: 1,
          strokeColor: colorArr[index],
          strokeOpacity: 1,
          strokeWeight: 3,
          // 折线样式还支持 'dashed'
          strokeStyle: "solid",
          // strokeStyle是dashed时有效
          strokeDasharray: [10, 5],
          lineJoin: 'round',
          lineCap: 'round',
          zIndex: 50,
        })

        this.polyline.setMap(this.map);
        this.polylineArr.push(this.polyline);
        // 缩放地图到合适的视野级别
        if(this.ifPosition) {
          this.map.setFitView([ this.polyline ])
        }
      },

      // 删除线路点
      lineDotDel(index) {
        this.selectLineArr.splice(index, 1);
        this.selectLineIdArr = [];
        let pathArr = [];
        for(let i = 0; i < this.selectLineArr.length; i++) {
          let item = this.selectLineArr[i];
          let lnglat = [parseFloat(item.lng), parseFloat(item.lat)];
          pathArr.push(lnglat);
          this.selectLineIdArr.push(item.id);
        }
        this.drawOneType = true;
        this.ifPosition = true;
        this.drawLine(pathArr, 1);
      },

      // 保存线
      subLine() {
        if(this.lineName == '') {
          this.$message({
            type: 'info',
            message: "请输入线路名称",
            center: true
          })
          return
        }
        if(this.selectLineArr.length < 2) {
          this.$message({
            type: 'info',
            message: "请选择线路",
            center: true
          })
          return
        }
        let url = '';
        let id = '';
        if(this.addEditType) {
          url = '/inspection/addInspectionLine';
          id = '';
        } else {
          url = '/inspection/updateInspectionLine';
          id = this.editData.id
        }
        let params = {
          showLoading: false,
          id: id,
          lineName: this.lineName,
          level: this.lineRadio,
          inspectionPoint: JSON.stringify(this.selectLineIdArr)
        };
        this.http.post(url, params)
          .then(res => {
            this.$message({
              type: 'success',
              message: "保存成功",
              center: true
            })
            // 关闭线弹窗
            this.closeLineMod();
          })
          .catch(err => {
            this.$message({
              type: 'error',
              message: "保存失败",
              center: true
            })
          })

      },

      // 关闭线弹窗
      closeLineMod() {
        this.lineName = '';
        this.lineRadio = '1';
        this.selectLineIdArr = [];
        if(this.polyline) {
          this.map.remove(this.polyline);
        }
        this.selectLineArr = [];
      },

      // 删除全部
      closeAllLineMod() {
        if(this.polyline) {
          this.map.remove(this.polyline);
        }
        this.selectLineArr = [];
        this.selectLineIdArr = [];
      },

      // 查看线
      lookLine(data) {
        this.drawOneType = false;
        this.ifPosition = true;
        this.drawLine(data.latLng, data.level);
      },

      // 编辑线
      editLine(data) {
        this.editData = data;
        this.lineName = data.lineName;
        this.lineRadio  = ''+data.level;
        let params = {
          showLoading: false,
          id: data.id,
        };
        this.http.post('/inspection/selectCustomer', params)
          .then(res => {
            let datas = res.data;
            this.labelChange(1);
            this.addEditType = false;
            this.selectLineArr = [];
            this.selectLineIdArr = [];
            let pathArr = [];
            for(let i = 0; i < datas.length; i++) {
              let item = datas[i];
              let lnglat = [parseFloat(item.lng), parseFloat(item.lat)];
              pathArr.push(lnglat);
              this.selectLineArr.push(item);
              this.selectLineIdArr.push(item.id);
            }
            this.drawOneType = true;
            this.ifPosition = true;
            this.drawLine(pathArr, 1);
          })
          .catch(err => {})
      },

      // 删除线
      delLine(data) {
        this.showModel = true;
        this.delId = data.id;
      },

      cancelModel() {
        this.showModel = false;
      },

      deteModel() {
        let params = {
          showLoading: false,
          id: this.delId,
        };
        let _this = this;
        this.http.post('/inspection/deleteLine', params)
          .then(res => {
            // 线路列表
            this.getLineList();
            this.showModel = false;
            this.$message({
              type: 'success',
              message: "删除成功",
              center: true
            })
          })
          .catch(err => {
            this.$message({
              type: 'error',
              message: "删除失败",
              center: true
            })
          })
      },

    },
  }
</script>

<style lang="scss" scoped>
  .containerPatrolMove {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
    background-image: url("../../../static/img/move/midBg.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;

    .containerPatrolMoveMain {
      width: 100%;
      height: 100%;
      overflow-y: auto;
      position: relative;

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
          cursor: pointer;
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

      /*作战指挥图*/
      .mapMod {
        width: 100%;
        height: calc(100% - 6rem);
        position: relative;
        .myMap {
          width: 100%;
          height: calc(100% - 7rem);
        }
        /*保障列表*/
        .list {
          width: 100%;
          height: 7rem;
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
        /*线路列表*/
        .lineListBox {
          width: 100%;
          height: 7rem;
          overflow-x: auto;
          ul {
            height: 100%;
            li {
              display: inline-block;
              padding-left: 0.6rem;
              background: #E9F7F6;
              cursor: pointer;
              .alone {
                float: left;
                width: calc(100% - 3rem);
                padding-top: 0.6rem;
                span {
                  display: inline-block;
                  width: 100%;
                  color: #967f5d;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                  p {
                    display: inline-block;
                    margin-right: 1rem;
                    cursor: pointer;
                  }
                  p:nth-child(2) {
                    color: #83cdff;
                  }
                  p:nth-child(3) {
                    color: #ff725b;
                  }
                }
                span:nth-child(1) {
                  color: #714F24;
                  font-size: 1.6rem;
                }
                span:nth-child(2),
                span:nth-child(3) {
                  color: #A18D6E;
                  font-size: 1.2rem;
                }
              }
            }
          }
        }
        /*搜索*/
        .searchArea {
          position: absolute;
          top: 2rem;
          right: 2rem;
          width: 31.2rem;
          background: #fff;
          z-index: 10;
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
            width: 100%;
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
          top: 2rem;
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

        /*客户线路标签*/
        .labelType {
          width: 10rem;
          height: 3.2rem;
          display: flex;
          justify-content: center;
          align-items: center;
          position: absolute;
          top: 2rem;
          left: 50%;
          margin-left: -5rem;
          span {
            display: inline-block;
            width: 4.8rem;
            height: 3.2rem;
            line-height: 3.2rem;
            text-align: center;
            font-size: 1.4rem;
            background: #fff;
            cursor: pointer;
          }
          span:nth-child(1) {
            border-radius: 0.4rem 0 0 0.4rem;
          }
          span:nth-child(2) {
            border-radius: 0 0.4rem 0.4rem 0;
          }
        }

        /*级别选择图片*/
        .levelSelectImg {
          display: flex;
          border-radius: 0.4rem;
          justify-content: center;
          align-items: center;
          position: absolute;
          right: 1rem;
          top: 5rem;
          cursor: pointer;
          img {
            width: 2rem;
            height: 2rem;
          }
        }

        .levelSelect {
          width: 6.8rem;
          height: 12rem;
          background: #fff;
          border: 0.1rem solid #ddd;
          border-radius: 0.4rem;
          position: absolute;
          right: 0rem;
          top: 7rem;
          p {
            width: 100%;
            height: 3rem;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }

        /*新建/编辑线路*/
        .lineDotModule {
          width: 100%;
          height: 28rem;
          background: #fff;
          border-radius: 4px;
          position: absolute;
          left: 0rem;
          z-index: 100;
          .lineDotModuleBox {
            width: 100%;
            height: 100%;
            position: relative;
            .lineInput {
              width: 80%;
              margin-left: 10%;
            }
            .lineRadio {
              width: 100%;
              height: 3.6rem;
              display: flex;
              justify-content: center;
              align-items: center;
            }
            .lineDotModuleBody {
              width: 100%;
              height: 16rem;
              overflow-y: auto;
              ul {
                width: 100%;
                li {
                  width: 100%;
                  height: 3rem;
                  span {
                    float: left;
                    line-height: 3rem;
                    text-indent: 1rem;
                    display: flex;
                    align-items: center;
                    font-size: 1.2rem;
                  }
                  span:nth-child(1) {
                    width: calc(100% - 6rem);
                    cursor: pointer;
                  }
                  span:nth-child(2) {
                    width: 6rem;
                    cursor: pointer;
                    color: #e76d63;
                  }
                }
                li:hover {
                  background: #F3F5E7;
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
                background: #eee;
                margin-right: 0.6rem;
                cursor: pointer;
              }
              button:nth-child(1) {
                color: rgba(0, 0, 0, 0.73);
              }
              button:nth-child(3) {
                width:11rem;
              }
            }
            .showDotBox {
              width: 2.4rem;
              height: 3rem;
              color: #fff;
              background: #74afab;
              border-radius: 0.4rem;
              display: flex;
              justify-content: center;
              align-items: center;
              position: absolute;
              left: 0;
              bottom: -3rem;
              cursor: pointer;
            }
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
          button {
            background: #eee;
            color: rgba(0, 0, 0, 0.73);
          }
        }
      }

      /*删除弹窗*/
      .modelMain {
        width: 80%;
        height: 16rem;
        background: #fff;
        border-radius: 1rem;
        .modelTitle {
          width: 100%;
          height: 10rem;
          font-size: 2rem;
          font-weight: 400;
          display: flex;
          justify-content: center;
          align-items: center;
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
          button:nth-child(2) {
            background: #00706B;
            color: #fff;
            margin-left: 2rem;
          }
        }
      }
    }

  }

</style>
