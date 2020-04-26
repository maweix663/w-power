<template>
  <div class="containerPatrol">
    <div class="header">
      <div class="title">{{ titleText }}战区巡检GIS</div>
    </div>
    <div class="main">
      <div class="mainLeft">
        <div class="labelType">
          <span @click="labelChange(1)" :style="labelIndex==1?labelTypeStyle:''">客户</span>
          <span @click="labelChange(2)" :style="labelIndex==2?labelTypeStyle:''">路线</span>
        </div>
        <div class="searchBox">
          <input v-model="searchName" :placeholder="placeholder"></input>
          <p>
            <img class="img1" @click="searchData" src="../../../static/img/gis/search.png" alt="">
          </p>
        </div>
        <!--客户列表-->
        <div class="custList" v-show="labelIndex==1">
          <ul>
            <li v-show="listArr.length == 0" style="width: 100%;text-align: center;font-size: 14px;">暂无数据</li>
            <li v-for="(item,index) in listArr" :key="index" @click="ponitClick(item, index)">
              <div class="localIcon">
                <img :src="'../../../static/img/gis/'+item.levelNo+'.png'" alt="">
              </div>
              <div class="alone">
                <span>{{ item.customeName }}</span>
                <span>{{ item.address }}</span>
                <span>电话:{{ item.customeTel | custTel }}</span>
              </div>
            </li>
          </ul>
        </div>
        <!--线路列表-->
        <div class="lineListBox" v-show="labelIndex==2">
          <ul>
            <li v-show="lineList.length == 0" style="width: 100%;text-align: center;font-size: 14px;">暂无数据</li>
            <li v-for="(item,index) in lineList" :key="index">
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
                </span>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="mainRight">
        <div id="myMap" class="myMap"></div>
      </div>
    </div>

    <!--返回-->
    <div class="backPrev">
      <img src="../../../static/img/fanhui.png" alt="" style="font-size: 16px;font-weight: 800;cursor: pointer" @click="back">
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

    <!--级别注释-->
    <div class="levelTitle">
      <ul>
        <li>
          <img src="../../../static/img/gis/0.png" alt="">
          <span>特级</span>
        </li>
        <li>
          <img src="../../../static/img/gis/1.png" alt="">
          <span>一级</span>
        </li>
        <li>
          <img src="../../../static/img/gis/2.png" alt="">
          <span>二级</span>
        </li>
        <li>
          <img src="../../../static/img/gis/3.png" alt="">
          <span>三级</span>
        </li>
      </ul>
    </div>

    <!--弹窗-->
    <div class="modelWindowMain" v-if="showWindowModel">
      <div class="modelWindowBody">
        <p><span>客户名称：</span>{{windowModelInfo.customeName}}</p>
        <p><span>客户编号：</span>{{windowModelInfo.customeNo}}</p>
        <p><span>地址：</span>{{windowModelInfo.address}}</p>
        <p><span>客户电话(联系人)：</span>{{windowModelInfo.customeTel}}</p>
        <p><span>用户类别：</span>{{windowModelInfo.type}}</p>
        <p><span>行政区域：</span>{{windowModelInfo.adminDivision}}</p>
        <p><span>巡检级别：</span>{{windowModelInfo.levelNoName}}</p>
        <p><span>防疫保电级别：</span>{{windowModelInfo.levelNumName}}</p>
        <p><span>保电人员：</span>{{windowModelInfo.electricityKeeper}}</p>
        <p><span>保电人员电话：</span>{{windowModelInfo.electricityKeeperTel}}</p>

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
        <button @click="custNav(windowModelInfo)">导 航</button>
        <button @click="closeDel">关 闭</button>
      </div>
    </div>

    <!--新建/编辑线路-->
    <div class="lineDotModule" v-show="selectLineArr.length > 0">
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
    </div>

  </div>
</template>

<script>
  export default {
    name: "patrol",
    data() {
      return {
        titleText: '',
        regionId: '',
        typeBtn: '',
        page: '',

        // 时间
        date: '',
        labelIndex: 1,
        drawOneType: true,
        ifPosition: true,
        labelTypeStyle: {
          background: '#fff'
        },
        // 搜索
        searchName: '',
        // 客户列表
        listArr: [],
        allPt: null,
        ptInfo: null,
        ptInfoLabel: false,
        // 重点客户
        redFlagArr: [
          {customeNo: "6813368245",name: '光谷科技会展中心方舱医院定点医院', lnglat: [114.508811, 30.490224]},
          {customeNo: "6608307552",name: '武汉国际博览中心方舱医院定点医院', lnglat: [114.260066, 30.577000]},
          {customeNo: "0004041803",name: '华中科技大学同济医学院附属协和医院', lnglat: [114.274696, 30.58407]},
          {customeNo: "0025127812",name: '武汉体育中心方舱医院定点医院', lnglat: [114.260066, 30.577]},
          {customeNo: "0006026964",name: '省疫情防控指挥部', lnglat: [114.355801, 30.568398]}],
        levelIcon: ['特级', '一级', '二级', '三级'],

        // 是否显示级别
        ifLevelSelect: false,
        // 选择级别
        checkListLevel: [],

        // 线路列表
        lineList: [],

        // 选择路线点
        ifLineModule: false,
        lineName: '',
        placeholder: '请输入客户名称',
        selectLineArr: [],
        selectLineIdArr: [],
        lineRadio: '1',
        polyline: null,
        polylineArr: [],

        // 弹窗
        showWindowModel: false,
        windowModelInfo: null,

        // 编辑线
        addEditType: true,
        editData: null,

      }
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
    },
    created() {
      this.titleText = this.$route.query.area;
      this.regionId = this.$route.query.regionId;
      this.typeBtn = this.$route.query.type;
      this.page = this.$route.query.page;

      // 获取时间
      this.getDate();
    },
    mounted: function () {
      this.$nextTick(function () {
        // 地图
        this.loadmap();
        $(".lineListBox").mCustomScrollbar({axis: "y"});
        $(".lineDotModuleBody").mCustomScrollbar({axis: "y"});
      })
    },
    methods: {
      //返回上一界面
      back(){
        this.$router.push({
          path: this.page,
          query:{
            area:this.titleText,
            regionId:this.regionId,
            type:this.typeBtn
          }
        });
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
      },

      // 获取时间
      getDate: function () {
        let params = {
          showLoading: false,
        };
        this.http.post('/homePage/findTime', params)
          .then(res => {
            this.date = res.data.time;
            // 地图保障点
            this.getMapDot();
          })
          .catch(err => {})
      },

      // 标签切换
      labelChange(index) {
        this.searchName = '';
        this.map.clearMap();
        if(index == 1) {
          this.labelIndex=1;
          this.placeholder='请输入客户名称';
          this.addEditType = true;
          this.dotPoint(this.listArr);
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
            this.dotPoint(data);
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
                $(".custList").mCustomScrollbar({axis: "y"});
                // 打点
                _this.dotPoint(data);
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
              for(let i = 0; i < data.length;i++) {
                // 绘制线
                _this.drawLine(data[i].latLng, data[i].level);
              }
            }
          })
          .catch(err => {
            this.lineList = [];
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

          // this.ptInfo.setLabel({
          //   offset: new AMap.Pixel(-10, -6),  //设置文本标注偏移量
          //   content: "<div class='ptLabel'>" + data.customeName.substring(0, 5) + "...</div>", //设置文本标注内容
          //   direction: 'top' //设置文本标注方位
          // });

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

      // 弹窗
      windowInfo(item) {
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
        this.$nextTick(function () {
          $(".modelWindowBody").mCustomScrollbar({axis: "y"});
        })
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
      },

      // 绘制线
      drawLine(arr, index) {
        if(this.labelIndex == 1 && this.polyline) {
          this.map.remove(this.polyline);
        }
        if(this.drawOneType && this.selectLineArr.length <= 1) {
          return
        }
        let colorArr = ['#9dada1', '#00706b', '#e78083', '#e70e2f', '#324ccc'];
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

      // 导航
      custNav(item) {
        let _this = this;
        AMap.plugin('AMap.Geolocation', function() {
          let geolocation = new AMap.Geolocation({
            enableHighAccuracy: true,//是否使用高精度定位，默认:true
            timeout: 10000,          //超过10秒后停止定位，默认：5s
            buttonPosition:'RB',    //定位按钮的停靠位置
            buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
            zoomToAccuracy: true,   //定位成功后是否自动调整地图视野到定位点

          });
          // _this.map.addControl(geolocation);
          geolocation.getCurrentPosition(function(status,result){
            if(status=='complete'){
              _this.onComplete(result, item)
            }else{
              _this.onError(result)
            }
          });
        });
      },

      //解析定位结果
      onComplete(data, item) {
        this.$message({
          type: 'success',
          message: '定位成功',
          center: true
        })
        let arr = [];
        let lnglat = (data.position + '').split(',');
        arr = [[parseFloat(lnglat[0]), parseFloat(lnglat[1])], [parseFloat(item.lng), parseFloat(item.lat)]];
        this.drawOneType = false;
        this.ifPosition = true;
        this.drawLine(arr, 4);
      },

      //解析定位错误信息
      onError(data) {
        this.$message({
          type: 'error',
          message: '请使用IE8以上浏览器',
          center: true
        })
      },

      // 关闭
      closeDel() {
        this.showWindowModel = false;
        this.windowModelInfo = null;
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
        this.$confirm('您确认删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
        let params = {
            showLoading: false,
            id: data.id,
          };
          let _this = this;
          this.http.post('/inspection/deleteLine', params)
            .then(res => {
              // 线路列表
              this.getLineList();
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
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
            center: true
          });
        });
      },

    },
  }
</script>

<style lang="scss" scoped>
  .containerPatrol {
    width: 100%;
    height: 100%;
    background: url("../../../static/img/bg.png") no-repeat;
    background-size: 100% 100%;

    /*标题区*/
    .header {
      width: 100%;
      height: 50px;
      line-height: 50px;
      position: relative;
      font-size: 20px;

      .title {
        width: 100%;
        text-align: center;
        color: #508799;
        font-weight: bold;
        /*padding-top: 10px;*/
      }

      .date {
        height: 50px;
        line-height: 50px;
        color: #6F7696;
        font-family: dig;
        position: absolute;
        top: 0;
        right: 80px;
        font-size: 18px;
      }
    }

    .main {
      width: 100%;
      height: calc(100% - 50px);
      /*客户列表*/
      .mainLeft {
        float: left;
        width: 280px;
        height: 100%;
        background: #DFE5CF;
        .labelType {
          width: 100%;
          height: 32px;
          display: flex;
          justify-content: center;
          align-items: center;
          span {
            display: inline-block;
            width: 48px;
            height: 32px;
            line-height: 32px;
            text-align: center;
            font-size: 14px;
            border-radius: 4px;
            cursor: pointer;
          }
        }
        .searchBox {
          width: calc(100% - 40px);
          height: 32px;
          margin: 10px 20px;
          position: relative;
          input {
            width: 100%;
            height: 24px;
            line-height: 24px;
          }
          p {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 40px;
            height: 30px;
            background: #536844;
            cursor: pointer;
            position: absolute;
            right: -4px;
            top: 0px;
          }
        }
        .custList {
          width: 100%;
          height: calc(100% - 100px);
          ul {
            width: 100%;
            li {
              width: calc(100% - 20px);
              height: 80px;
              margin-left: 10px;
              cursor: pointer;
              .localIcon {
                float: left;
                width: 30px;
                height: 100%;
                text-align: center;
                img {
                  width: 20px;
                  height: 20px;
                  margin-top: 12px;
                }
              }
              .alone {
                float: left;
                width: calc(100% - 30px);
                height: calc(100% - 10px);
                padding-top: 10px;
                span {
                  display: inline-block;
                  width: 100%;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                }
                span:nth-child(1) {
                  color: #714F24;
                  font-size: 16px;
                }
                span:nth-child(2),
                span:nth-child(3) {
                  color: #A18D6E;
                  font-size: 12px;
                }
              }
            }
            li:hover {
              background: #EDF1E4;
            }
          }
        }
        /*线路列表*/
        .lineListBox {
          width: 100%;
          height: calc(100% - 100px);
          ul {
            width: 100%;
            li {
              width: calc(100% - 20px);
              height: 80px;
              margin-left: 10px;
              cursor: pointer;
              .alone {
                float: left;
                width: calc(100% - 30px);
                height: calc(100% - 10px);
                padding-top: 10px;
                span {
                  display: inline-block;
                  width: 100%;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                  p {
                    display: inline-block;
                    margin-right: 10px;
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
                  font-size: 16px;
                }
                span:nth-child(2),
                span:nth-child(3) {
                  color: #A18D6E;
                  font-size: 12px;
                }
              }
            }
            li:hover {
              background: #EDF1E4;
            }
          }
        }
      }
      /*地图*/
      .mainRight {
        float: left;
        width: calc(100% - 280px);
        height: 100%;
        .myMap {
          width: 100%;
          height: 100%;
        }
      }
    }

    /*返回*/
    .backPrev{
      position: absolute;
      left:15px;
      color: #536844;
      top: 5px;
    }

    /*级别选择图片*/
    .levelSelectImg {
      width: 40px;
      height: 40px;
      background: #fff;
      display: flex;
      border-radius: 4px;
      justify-content: center;
      align-items: center;
      position: absolute;
      right: 40px;
      top: 50px;
      cursor: pointer;
      img {
        width: 30px;
        height: 30px;
      }
    }

    .levelSelect {
      width: 68px;
      height: 120px;
      background: #fff;
      border: 1px solid #ddd;
      border-radius: 4px;
      position: absolute;
      right: 24px;
      top: 90px;
      p {
        width: 100%;
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }

    /*级别注释*/
    .levelTitle {
      width: 360px;
      height: 40px;
      border: 1px solid #ddd;
      border-radius: 4px;
      position: absolute;
      bottom: 20px;
      right: 20px;
      ul {
        width: 100%;
        height: 100%;
        background: #fff;
        li {
          width: 90px;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          float: left;
          img {
            width: 18px;
            height: 18px;
          }
          span {
            font-size: 14px;
            margin-left: 6px;
          }
        }
      }
    }

    /*弹窗*/
    .modelWindowMain {
      width: 320px;
      height: 60%;
      background: #FFFFFF;
      border-radius: 1rem;
      padding: 1rem 0;
      position: absolute;
      right: 80px;
      top: 50px;
      .modelWindowBody {
        width: 100%;
        height: calc(100% - 4rem);
        overflow-y: auto;
        p {
          width: calc(100% - 2rem);
          float: left;
          display: inline-block;
          word-break: break-all;
          word-wrap: break-word;
          padding: 0 1rem;
          color: #4B4B4B;
          line-height: 2.8rem;
          font-size: 1.4rem;
          font-weight: bold;
          span {
            font-weight: 400;
            color: #131313;
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
          border-radius: 1.7rem;
          border: none;
          font-size: 1.6rem;
          cursor: pointer;
        }
        button:nth-child(1) {
          background: #eee;
          color: #222;
        }
        button:nth-child(2) {
          background: #99A68F;
          color: #fff;
        }
      }
    }

    /*线路点列表*/
    .lineDotModule {
      width: 400px;
      height: 320px;
      background: #fff;
      border-radius: 4px;
      position: absolute;
      left: 280px;
      bottom: 0;
      z-index: 100;
      .lineInput {
        width: 360px;
        margin-left: 20px;
      }
      .lineRadio {
        width: 100%;
        height: 36px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .lineDotModuleBody {
        width: 100%;
        height: 200px;
        overflow: hidden;
        ul {
          width: 100%;
          li {
            width: 100%;
            height: 30px;
            span {
              float: left;
              line-height: 30px;
              text-indent: 10px;
              display: flex;
              align-items: center;
              font-size: 12px;
            }
            span:nth-child(1) {
              width: calc(100% - 60px);
              cursor: pointer;
            }
            span:nth-child(2) {
              width: 60px;
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
          width: 72px;
          height: 34px;
          border-radius: 4px;
          border: none;
          font-size: 16px;
          margin-right: 6px;
          background: #eee;
          cursor: pointer;
        }
        button:nth-child(1) {
          color: rgba(0, 0, 0, 0.73);
        }
        button:nth-child(3) {
          width: 92px;
        }
      }
    }

  }
</style>
