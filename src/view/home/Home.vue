<template>
  <div class="containerHome2" >
    <div class="header">
      <div class="title" :class="[skinColor?'titleBlue':'titleYellow']" :style="title">{{titleText}}战区防疫保电监控平台</div>
      <div class="rightBox">
        <div class="date" :style="moduleTile">{{ time }}</div>
        <div @click="uploadFile" class="upload"><img src="../../../static/img/upload.png"></div>
        <div @click="menuEvent" v-show="!typeBtn" class="railClick"><img src="../../../static/img/gis/shejimulu.png"></div>
        <div>{{ userInfoId }}</div>
      </div>
    </div>

    <!--展示区-->
    <div class="main">
      <div class="mainLeft">
        <!--重要客户-->
        <div class="custom" :class="[skinColor?'moduleBgBlue':'moduleBgYellow']">
          <div class="moduleTile" :class="[skinColor?'moduleTileBlue':'moduleTileYellow']" :style="moduleTile">重要客户供电保障</div>
          <div class="moduleHome">
            <!--客户模块-->
            <div class="custMod" id="custMod" v-if="custMod"></div>
            <div class="custMod" v-else></div>
            <!--负载模块-->
            <div class="loadMod" id="loadMod"></div>
          </div>
        </div>
        <!--负载率超过20%客户-->
        <div class="custOver" :class="[skinColor?'moduleBgBlue':'moduleBgYellow']">
          <div class="moduleTile" :class="[skinColor?'moduleTileBlue':'moduleTileYellow']" :style="moduleTile">负载率超过20%客户</div>
          <div class="moduleHome" style="text-align: center">
            <table class="overTable" :class="[skinColor?'tableBlue':'tableYellow']">
              <thead>
              <tr>
                <th rowspan="2" width="75%">客户名称</th>
                <th rowspan="2" width="25%">负载率</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(item,index) in custArr" :class="{list_item_on:index%2==0,list_item_off:index%2!=0}"  @click="ponitClick(item, index)">
                <td width="75%">{{ item.customeName }}</td>
                <td width="25%">{{ item.loadRate | loadNum }}%</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="mainMap">
        <!--地图-->
        <div class="mapArea"  :class="[skinColor?'moduleBgBlue':'moduleBgYellow']">
          <div class="moduleTile" :class="[skinColor?'moduleTileBlue':'moduleTileYellow']" :style="moduleTile">作战指挥图
          </div>
          <div class="moduleHome">
            <div id="myMap" class="myMap"></div>
            <div class="list" ref="listStyle">
              <ul :style="ulWidth" :class="[skinColor?'mapAreaBlue':'mapAreaYellow']">
                <li :style="liWidth" v-for="(item,index) in list" :key="index" :class="flag==index?'choosedLi':''"
                    @click="ponitClick(item, index)">
                  <div class="localIcon">
                    <img src="../../../static/img/icon2.png" alt="">
                  </div>
                  <div class="alone">
                    <span :style="listFont1" :class="[skinColor?'mapAreaLiTitleBlue':'mapAreaLiTitleYellow']">{{ item.customeName }}</span>
                    <span :style="listFont2" :class="[skinColor?'mapAreaLiSpanBlue':'mapAreaLiSpanYellow']">{{ item.address }}</span>
                    <span :style="listFont2" :class="[skinColor?'mapAreaLiSpanBlue':'mapAreaLiSpanYellow']">电话:{{ item.customeTel | custTel }}</span>
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

        <!--备品备件-->
        <div class="spareParts"  :class="[skinColor?'moduleBgBlue':'moduleBgYellow']">
          <div class="moduleTile" :class="[skinColor?'moduleTileBlue':'moduleTileYellow']" :style="moduleTile">人员物资
          </div>
          <div class="moduleHome">
            <table class="myTable" :class="[skinColor?'tableBlue':'tableYellow']" id="nav_tab" >
              <thead style="background: #CDDABF">
              <tr style="height: 30px;">
                <th rowspan="2">单位</th>
                <th v-show="headTitle1.length > 0" :colspan="headTitle1.length">在岗人员情况</th>
                <th v-show="headTitle2.length > 0" :colspan="headTitle2.length">防疫物资情况</th>
              </tr>
              <tr>
                <th v-for="(item1, index1) in headTitle1">{{ item1 }}</th>
                <th v-for="(item2, index2) in headTitle2">{{ item2 }}</th>
              </tr>
              </thead>
              <tbody id="nav_tab_tbd" style="text-align: center;font-size: 12px; background: #D0E4CD">
              <tr v-for="(itemArr,index) in spareArr" :class="{list_item_on:index%2==0,list_item_off:index%2!=0}">
                <td v-for="(item,indexItem) in itemArr">{{ item }}</td>
              </tr>
              </tbody>
            </table>
          </div>
    </div>
      </div>

      <div class="mainright">
        <!--电网运行-->
        <div class="funt" :class="[skinColor?'moduleBgBlue':'moduleBgYellow']">
          <div class="moduleTile" :class="[skinColor?'moduleTileBlue':'moduleTileYellow']" :style="moduleTile">电网负荷情况
          </div>
          <div class="moduleHome">
            <div class="funtLine" id="funtLine"></div>
            <div class="funtRing" id="funtRing"></div>
          </div>
        </div>
        <!--保电出勤-->
        <div class="attend" :class="[skinColor?'moduleBgBlue':'moduleBgYellow']">
          <div class="moduleTile" :class="[skinColor?'moduleTileBlue':'moduleTileYellow']" :style="moduleTile">保电出勤统计
          </div>
          <div class="moduleHome" id="attendMod"></div>
        </div>
      </div>
    </div>

    <!--返回武汉按钮-->
    <div class="typeBtnBox" v-show="typeBtn" @click="returnBtn">
      <img src="../../../static/img/fanhui.png" alt="">
    </div>

    <!--目录-->
    <div class="menuList" v-show="ifMenuList">
      <ul>
        <li @click="menuList('rail')" v-show="!typeBtn">地理围栏</li>
        <li @click="menuList('patrol')">巡检GIS</li>
        <li @click="menuList('userManage')" v-show="userPower == 1">账号权限</li>
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

    <!-- 批量导入 -->
    <el-dialog class="showTableData" :title="excelTitle" :visible.sync="dialogImport" :before-close="closeExcel"
               :close-on-click-modal=false>
      <el-row style="margin-bottom: 20px;">
        <el-date-picker
          v-model="uploadData.date"
          type="date"
          placeholder="选择日期"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyyMMdd"
          :editable=false
          :picker-options="pickerOptions0">
        </el-date-picker>
        </el-row>
      <el-upload
        class="upload-demo"
        ref="upload"
        accept=".xlsx"
        :limit=1
        :action="excelUrl"
        :data="uploadData"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :on-success="handlesuccess"
        :file-list="fileList"
        :headers = "headers"
        :before-upload="beforeUpload"
        :auto-upload="false">
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传文件</el-button>
        <div slot="tip" class="el-upload__tip">只能同时上传<strong>一个xlsx文件</strong>，且不超过<strong>50M</strong></div>
      </el-upload>
      <el-row>
        <el-col :span="24" style="text-align: center;">
          <el-button type="primary" @click="closeExcel">关 闭</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "home",
    inject:['reload'],
    data() {
      return {
        userInfoId: localStorage.userId2,
        //true为蓝色皮肤，false为黄色皮肤
        skinColor: true,
        skinCount: 0,
        colorCommon: {
          color1: '', /*所有坐标轴颜色*/
          color2: '#534c7c', /*所有echars小标题颜色*/
        },

        // 目录
        ifMenuList: false,

        // 账号权限
        userPower: null,

        // 区域
        titleText: '武昌',
        regionId: '018b01f66d0f4c36b785c0e45b959e0e',
        typeBtn: false,
        // 时间-日期
        time: '',
        date: '',
        // 电网
        loadTime: '',
        // 出勤
        repairTime: '',
        // 客户
        custMod: true,
        custX: [],
        custY3: [],
        maxLoadRate: null,
        customerLoadRate: null,
        exceedTwenty: null,
        allCust: null,
        custColor: {
          color1: '', /*重要客户保障未停电颜色*/
          color2: '',/*停电颜色*/
          color3: '',/*保障点客户数颜色*/
          color4: '',/*重要客户最大负载颜色*/
          color5: '',/*国电信武汉分公司颜色*/
          color6: '',/*负载率超过20%颜色*/
          color7: '',/*环形图颜色颜色*/
        },
        // 负载超过20%
        custArr:[],

        // 保电出勤统计
        attendX:  [],
        attendY1: [],
        attendY2: [],
        attendY3: [],
        attendColor: {
          color1: '', /*保电人次颜色*/
          color2: ''/*保电车辆台次颜色*/
        },
        // 地图
        map: null,
        zoom: 16,
        mapStyle:'',
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

        //电网运行情况
        funtColor:{
          color1:'',/*日最大负荷*/
          color2:'',/*日最小负荷*/
          color3:'',/*环形图1渐变1*/
          color4:'',/*环形图1渐变2*/
          color5:'',/*环形图2渐变1*/
          color6:'',/*环形图2渐变2*/
          color7:'',/*字颜色*/
          color8:'',/*字颜色*/
        },

        // 备品备件
        headTitle1: ['在岗','全民','其他用工'],
        headTitle2: ['一次性医用口罩（个）','N95口罩（个）','护目镜（个）','一次性橡胶手套（双）','医用防护服（隔离衣）（套）','消毒洗手液（L）','消毒酒精（L）','消毒液（KG）'],
        spareArr: [],
        spareArr2:[
          ['综合科', '11', '3', '8', '15', '38', '', '0','','','','','2'],
          ['营业科', '1', '1', '0', '0', '22', '', '', '', '', '', '', ''],
          ['联调中心', '2', '1', '1', '40', '30', '', '309', '', '5','10', '','5'],
          ['采集运维班', '0', '0', '0', '0', '', '','200', '','','5','','1' ],
          ['装表接电一班', '	0',	'0',	'0',	'66',	'48',	'',	'16',	'',	'',	'',	'',	'1'],
          ['装表接电二班', '	3',	'1',	'2',	'50', '', '', '', '', '', '', '', '',],
          ['洪山营业一班',	'0',	'0',	'0',	'0',	'',	'30',	'40',	'',	'3',	'3',	'',	'1'],
          ['武昌营业一班', '	0',	'0',	'0',	'0',	'0',	'',	'0',	'',	'0',	'2',	'2',],


          ['青山营业班',	 '0',	'0',	'0',	'40',	'20',	'',	'290',	'',	'16',	'3',	'8',	'3'
          ],
          ['洪山营业二班',	'2',	'1',	'1',	'50',	'',	'20',	'200',	'',	'1',	'7',	'',	'5'
          ],
          ['街道口营业班',	 '2',	'0',	'2',	'82',	'350',	'',	'36',	'',	'',	'',	'',	'3'
          ],
          ['黄鹤营业班', 	'1',	'0',	'1',	'160',	'120',	'',	'36',	'',	'',	'',	'',	'3'
          ],
          ['武昌营业二班',	 '3',	'0',	'3',	'140',	'150',	'',	'300',	'',	'4',	'6',	'',	'4'
          ],
          ['水果湖营业班', 	'3',	'0',	'3',	'160',	'120',	'',	'35',	'',	'',	'',	'3', ''
          ],
          ['徐东营业班	', '2',	'0',	'2',	'72',	'80',	'',	'310',	'',	'10',	'5',	'8',	'5'
          ],
          ['钢城营业班', '0',	'0',	'0',	'118',	'116',	'',	'36',	'',	'',	'',	'',	'2'
          ],
          ['钢东营业班',	 '2',	'0',	'2',	'160',	'120',	'',	'36',	'',	'',	'',	'',	'3'
          ],
        ],

        // 负荷
        funtLineX: [],
        funtLineY1: [],
        funtLineY2: [],
        maxFun: [],
        minFun: [],

        // 批量导入、更新相关路径
        headers: {
          'Authorization': localStorage.token
        },
        excelUrl: '/api/homePage/importExcel',
        uploadData: {
          date: ''
        },
        excelTitle: '导入文件',
        dialogImport: false,
        fileList: [],
        fileInfo: null,
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() > Date.now() - 8.64e6
          }
        },

        // 背景
        conBg: '../../../static/img/4.png',

        // 自适应样式
        openAdapt: false,
        // 窗口宽高
        screenWidth: document.body.clientWidth,
        screenHeight: document.body.clientHeight,
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
        listFont1:{
          fontSize: '14px'
        },
        listFont2:{
          fontSize: '12px'
        },
      }
    },
    watch: {
      // 监听窗口变化
      screenWidth (val) {
        this.screenWidth = val;
        let _this = this;
        setTimeout(() => {
          _this.infoSize();

          // 客户模块
          _this.custEchart();
          // 负载模块
          _this.loadEchart();
          // 保电出勤
          _this.attendEchart();
          // 电网运行
          _this.funtLineEchart();

          _this.funtRingEchart();
          // 防疫
          // _this.funtPieEchart();
        }, 500)
      },

      screenHeight (val) {
        this.screenHeight = val;
        let _this = this;
        setTimeout(() => {
          _this.infoSize();

          // 客户模块
          _this.custEchart();
          // 负载模块
          _this.loadEchart();
          // 保电出勤
          _this.attendEchart();
          // 电网运行
          _this.funtLineEchart();

          _this.funtRingEchart();
          // 防疫
          // _this.funtPieEchart();
        }, 500)
      },
    },
    filters: {
      // 客户电话
      custTel: function (val) {
        if(val) {
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
      this.titleText = this.$route.query.area;
      this.regionId = this.$route.query.regionId;
      this.typeBtn = this.$route.query.type;
      if(this.titleText == null) {
        this.titleText = '武昌'
      }

      let date2 = new Date();
      // this.skinColor = localStorage.skinColor;
      if (this.skinColor) {
        this.skinCount = 0;
        this.conBg = "../../../static/img/backgroung-blue.png";
        this.mapStyle = 'amap://styles/normal';
      } else {
        this.skinCount = 1;
        this.conBg = "../../../static/img/4.png";
        this.mapStyle = 'amap://styles/normal';
      }
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
      //判断是什么皮肤颜色
      this.isColor();
      // // 点击换肤
      // this.changeColor()

      // 获取账号权限
      this.getUserPower();
    },
    beforeUpdate() {
      // localStorage.setItem("skinColor", this.skinColor);
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
    destroyed() {
      // localStorage.setItem("skinColor", this.skinColor);
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
            page: '/home',
            type:this.typeBtn
          }
        });
      },

      /*echars换色*/
      isColor: function () {
        if (this.skinColor) {
          this.custColor.color1 = '#6699ff'; /*重要客户*/
          this.custColor.color2 = '#ffee99';
          this.custColor.color3 = '#58b2af';
          this.custColor.color4 = '#18a0f8';
          this.custColor.color5 = '#57b2af';
          this.custColor.color6 = '#d46e75';
          this.custColor.color7 = '#eacdba';
          this.attendColor.color1 = 'rgb(24,243,212)'; /*保电出勤*/
          this.attendColor.color2 = 'rgb(34,124,233)';
          this.colorCommon.color1 = '#674f2a';/*公共样式*/
          this.colorCommon.color2 = '#674f2a';
          this.funtColor.color1 = '#fe5e76';/*电网运行*/
          this.funtColor.color2 = '#1f82fd';
          this.funtColor.color3 = '#FE5B76';
          this.funtColor.color4 = '#FFA378';
          this.funtColor.color5 = '#2571FE';
          this.funtColor.color6 = '#189FFD';
          this.funtColor.color7 = '#7a8c9f';
          this.funtColor.color8 = '#ffffff';
          // this.preventColor.color = '#ff9d19';/*防疫情*/
        } else {
          this.custColor.color1 = '#b47716';
          this.custColor.color2 = '#3e2f5f';
          this.custColor.color3 = '#59aa24';
          this.custColor.color4 = '#dd7531';
          this.custColor.color5 = '#3d9941';
          this.custColor.color6 = '#3d5094';
          this.custColor.color7 = 'rgba(102,50,6,0.38)';
          this.attendColor.color1 = '#f8271f';
          this.attendColor.color2 = '#f0890c';
          this.colorCommon.color1 = '#9c6c40';
          this.colorCommon.color2 = '#615028';
          this.funtColor.color1 = '#3da270';/*电网运行*/
          this.funtColor.color2 = '#f28208';
          this.funtColor.color3 = '#3cab85';
          this.funtColor.color4 = '#3b7084';
          this.funtColor.color5 = '#ee9b1d';
          this.funtColor.color6 = '#f9731f';
          this.funtColor.color7 = '#af9d7d';
          this.funtColor.color8 = '#615028';
          // this.preventColor.color = '#000000';/*防疫情*/
        }
      },

      // 窗口大小
      infoSize() {
        if (this.screenHeight >= 560 && this.screenHeight < 620) {
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

      // 获取账号权限
      getUserPower() {
        let params = {
          showLoading: false,
          Authorization: localStorage.token
        };
        this.http.post('/user/isDivisionUser', params)
          .then(res => {
            if(res.code == 0) {
              this.userPower = 1;
            } else {
              this.userPower = null;
            }
          })
          .catch(err => {
            this.userPower = null;
          })
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

      // 获取时间
      getDate: function () {
        let params = {
          showLoading: false,
        };
        this.http.post('/homePage/findTime', params)
          .then(res => {
            this.date = res.data.time;
            // 电网
            this.loadTime = res.data.loadTime;
            // 出勤
            this.repairTime = res.data.repairTime;
            // 重要客户
            this.getCust();
            // 获取级别
            this.getLevel();
            // 地图保障点
            this.getMapDot();
            // 电网运行
            this.getFunt();
            //保电出勤
            this.getAttend();
            // 备件-中心城区
            this.getMaterialType();
            //获取用户类别
            this.getCustArr();

          })
          .catch(err => {})
      },

      /*获取用户类型--下拉框*/
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

      // 重要客户
      getCust() {
        let params = {
          showLoading: false,
          time: this.date,
          regionId: this.regionId
        };
        this.http.post('/homePage/customerSafeguard', params)
          .then(res => {
            this.allCust = res.data;
            this.custArr = res.data.exceedTwentyList;
            this.maxLoadRate = res.data.maxLoadRate == null? '0':res.data.maxLoadRate;
            this.customerLoadRate = res.data.customerLoadRate == null?'0':res.data.customerLoadRate;
            this.exceedTwenty = res.data.exceedTwenty == null?'0':res.data.exceedTwenty;
            let data = res.data.customerInfo;
            this.custX = [];
            this.custY3 = [];
            // let xData = [];
            for(let i = 0; i < data.length; i++) {
              this.custX.push(data[i].name);
              this.custY3.push(data[i].count);
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
              // 负载模块
              _this.loadEchart();
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
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {
            // data: ['未停电', '停电', '保障点客户数'],
            data: ['保障点客户数'],
            icon: "circle",
            itemWidth: 6, // 设置宽度
            itemHeight: 6, // 设置高度
            itemGap: 20, // 设置间距
            textStyle: {
              fontSize: _this.legend,//字体大小
              color: '#534c7c'//字体颜色
            },
            x: 'right' //居右显示
          },
          grid: {
            left: '1%',
            right: '8%',
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
                color: _this.colorCommon.color1,
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
            type: 'category',
            axisTick: { //y轴刻度线
              "show": false
            },
            splitLine: { //网格线
              "show": false
            },
            axisLine: {
              lineStyle: {
                color: _this.colorCommon.color1,
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
              barCategoryGapptLabel: '50%', /*多个并排柱子设置柱子之间的间距*/
              itemStyle: {
                normal: {
                  color: _this.custColor.color3,
                  label: {
                    show: true,
                    position: 'right',
                    textStyle: {
                      color: _this.custColor.color3,
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
              data: _this.custY3
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

      // 负载模块
      loadEchart() {
        let loadChart = this.$echarts.init(document.getElementById('loadMod'));
        loadChart.resize();
        var data = [
          {
            name: '停电用户数',
            // value: this.customerLoadRate
            value:0
          }, {
            name: '重要客户\n'+'最大负载率',
            value: this.maxLoadRate
          }, {
            name: '负载率\n'+'超过20%',
            value: this.exceedTwenty
          }];
        let marginLeft = [16, 50, 84];
        let _this = this;
        var titleArr = [], seriesArr = [],
          colors = [[_this.custColor.color5, _this.custColor.color7], [_this.custColor.color4,  _this.custColor.color7], [_this.custColor.color6,  _this.custColor.color7]]
        data.forEach(function (item, index) {
          let indexVal = index;
          let value;
          if(index != 2) {
            value = 100 - item.value
          } else {
            value = 0
          }
          titleArr.push(
            {
              text: item.name,
              left: marginLeft[index] + '%',
              top: '72%',
              textAlign: 'center',
              textStyle: {
                fontWeight: 'normal',
                fontSize: _this.legend,
                color: colors[index][0],
                textAlign: 'center',
              },
            }
          );
          seriesArr.push(
            {
              name: item.name,
              type: 'pie',
              clockWise: false,
              radius: [_this.loadRing, _this.loadRing + 4],
              itemStyle: {
                normal: {
                  color: colors[index][0],
                  shadowColor: colors[index][0],
                  shadowBlur: 0,
                  label: {
                    show: false
                  },
                  labelLine: {
                    show: false
                  },
                }
              },
              hoverAnimation: false,
              center: [marginLeft[index] + '%', '40%'],
              data: [{
                value: item.value,
                label: {
                  normal: {
                    formatter: function (params) {
                      if (indexVal == 2||indexVal==0) {
                        return params.value + '家';
                      } else {
                        return params.value + '%';
                      }
                    },
                    position: 'center',
                    show: true,
                    textStyle: {
                      fontSize: _this.legend+2,
                      fontWeight: 'bold',
                      color: colors[index][0]
                    }
                  }
                },
              }, {
                value: value,
                name: 'invisible',
                itemStyle: {
                  normal: {
                    color: colors[index][1]
                  },
                  emphasis: {
                    color: colors[index][1]
                  }
                }
              }]
            }
          )
        });

        loadChart.setOption({
          title: titleArr,
          series: seriesArr
        }, true)
        loadChart.on('click', function (params) {
          _this.showAlarm = false;
          if(params.seriesName.indexOf("重要客户")>-1) {
            _this.list = _this.allCust.maxList;
            _this.guaList(_this.allCust.maxList);
          } else if(params.seriesName.indexOf("中国电信武汉分公司")>-1){
            let n = [];
            _this.list = n;
            n.push(_this.allCust.customerLoadRateInfo);
            _this.guaList(n);
          } else if(params.seriesName.indexOf("负载率")>-1) {
            _this.list = _this.allCust.exceedTwentyList;
            _this.guaList(_this.allCust.exceedTwentyList);
          }
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
          regionId: this.regionId
        };
        let data;
        let _this = this;
        this.http.post('/homePage/mapShowLocation', params)
          .then(response => {
            if (response.code === 0) {
              data = response.data;
              _this.allPt = data;
              // 保障点列表
              _this.guaList(data);
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

      // 保障点点击事件
      ponitClick(item, index) {
        this.flag = index;
        // 关闭弹窗
        this.map.clearInfoWindow();

        let lnglat =[parseFloat(item.lng), parseFloat(item.lat)];
        // 点定位
        let imgIcon;
        if(this.showAlarm) {
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
        this.ptInfo.on('click', function(param){
          _this.windowInfo(data)
        })
      },

      // 关闭
      closeDel() {
        this.showWindowModel = false;
        this.showCustAttend = false;
      },

      // 弹窗信息
      windowInfo: function(item) {
        let lnglat = [parseFloat(item.lng), parseFloat(item.lat)];
        let data = {};
        for(let i in item){
          let m;
          if(item[i] == null) {
            m = '无'
          } else {
            m = item[i]
          }
          data[i]= m
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
              iconSize=20;
            }
          }
          for(let j=0; j < _this.redFlagArr.length; j++) {
            if (datas[i].customeNo == _this.redFlagArr[j].customeNo) {
              imgIcon = '../../../static/img/redFlag.png';
              iconSize=34;
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
        if(this.titleText == "武汉") {
          nn = 4;
        } else  if(this.titleText == "汉口") {
          nn = 2;
        } else  if(this.titleText == "武昌") {
          nn = 4;
        } else  if(this.titleText == "汉阳") {
          nn = 1;
        } else  if(this.titleText == "沌口") {
          nn = 3;
        } else  if(this.titleText == "东薪") {
          nn = 0;
        } else {
          nn = 4;
        }
        this.$nextTick(function () {
          if(_this.ptInfoLabel) {
            _this.map.setZoomAndCenter(_this.zoom, arr[nn].lnglat);
          }
        })
      },

      // 电网运行
      getFunt() {
        let param = {
          showLoading: false,
          time: this.loadTime,
          regionId: this.regionId
        };
        this.http.post('/homePage/runningCondition', param)
          .then(res => {
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
                if(maxRate > 99.99) {
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
              if(maxRate < 0.01) {
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
                if(minRate > 99.99) {
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
              if(minRate < 0.01) {
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
            data: [ '日最大负荷', '日最小负荷'],
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
            left: '3%',
            right: '10%',
            bottom: '3%',
            containLabel: true
          },
          tooltip: {
            trigger: 'axis'
          },
          xAxis: {
            name:'日期',
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
                color: _this.colorCommon.color1,
                width: 1,
              }
            },
            axisLabel: {
              show: true,
              textStyle: {
                fontSize: _this.xyAxis,
                color: _this.colorCommon.color1
              },
            },
            data: _this.funtLineX
          },
          yAxis: {
            name:'单位（万千瓦）',
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
                  color: _this.funtColor.color1
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
                  color: _this.funtColor.color2
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
            right: '0%',
            y: 'center',
            itemWidth: 3,
            itemHeight: 20,
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
                  fontSize: _this.xyAxis+1,
                },percent2: {
                  color: '#ed6f64',
                  fontSize: _this.xyAxis+1,
                },
              },
            },
            formatter: name => {
              switch (name) {
                case '昨日最大负荷':
                  return (
                    '昨日最大负荷{percent|'+_this.maxFun[0]+'}万千瓦 比前一天'+_this.maxFun[2]+'{percent2|'+_this.maxFun[1]+'%}'
                  );
                case '昨日最小负荷':
                  return (
                    '昨日最小负荷{percent|'+_this.minFun[0]+'}万千瓦 比前一天'+_this.minFun[2]+'{percent2|'+_this.minFun[1]+'%} '
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
              radius: ['60%', '70%'],
              center: ['15%', '50%'],
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
                fontSize: 16,
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
                        offset: 0, color: _this.funtColor.color3, // 0% 处的颜色
                      }, {
                        offset: 1, color: _this.funtColor.color4, // 100% 处的颜色
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
                        offset: 1, color: _this.funtColor.color5,
                      }, {
                        offset: 0, color: _this.funtColor.color6,
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
              color: '#534c7c'//字体颜色
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
                color: _this.colorCommon.color1,
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
                color: _this.colorCommon.color1,
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
                color: _this.attendColor.color1,
                label: {
                  show: true,
                  position: 'top',
                  textStyle: {
                    color: _this.colorCommon.color1,
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
                  color: _this.attendColor.color2,
                  label: {
                    show: true,
                    position: 'top',
                    textStyle: {
                      color: _this.colorCommon.color1,
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
                  color: '#e98f22',
                  label: {
                    show: true,
                    position: 'top',
                    textStyle: {
                      color: _this.colorCommon.color1,
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
              data: _this.attendY3
            },
          ]
        }, true)
      },

      // 备件-中心城区
      getMaterialType() {
        let params = {
          showLoading: false,
          time: this.date,
          regionId: this.regionId
        };
        let _this = this;
        this.http.post('/homePage/centreSparePart', params)
          .then(res => {
            let data = res.data;
            for(let i = 0; i < data.length; i++) {
              let arr = [];
              arr.push(data[i].departmentName);
              for(let j = 0; j < _this.headTitle1.length; j++) {
                let num1 = 0;
                if(data[i].peolpe != null) {
                  for(let m = 0; m < data[i].peolpe.length; m++) {
                    if(_this.headTitle1[j] == data[i].peolpe[m].id) {
                      arr.push(data[i].peolpe[m].number)
                    } else {
                      num1++;
                      if(num1 == data[i].peolpe.length) {
                        arr.push(0)
                      }
                    }
                  }
                } else {
                  arr.push(0)
                }
              }
              for(let r = 0; r < _this.headTitle2.length; r++) {
                let num2 = 0;
                if(data[i].spare != null) {
                  for(let s = 0; s < data[i].spare.length; s++) {
                    if(_this.headTitle2[r] == data[i].spare[s].materialId) {
                      arr.push(data[i].spare[s].materialNumber)
                    } else {
                      num2++;
                      if(num2 == data[i].spare.length) {
                        arr.push(0)
                      }
                    }
                  }
                } else {
                  arr.push(0)
                }
              }
              _this.spareArr.push(arr);
            }
          })
          .catch(err => {})
      },

      // 返回武汉按钮
      returnBtn() {
        this.$router.push({
          path: '/homeWuhan'
        });
      },

      //文件上传
      uploadFile:function(){
        this.dialogImport = true
      },

      closeExcel:function(){
        this.fileList = []
        this.fileInfo = null
        this.dialogImport = false
      },
      // 上传文件
      submitUpload () {
        if(this.uploadData.date == '') {
          this.$message({
            message: "请选择日期",
            center: true
          })
          return
        }
        this.$refs.upload.submit()
      },
      // 文件列表移除文件
      handleRemove (file, fileList) {
        console.log(file, fileList)
      },

      // 上传前判断
      beforeUpload (file) {
        let testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
        let extension = testmsg === 'xls'
        let extension2 = testmsg === 'xlsx'
        let isLt2M = file.size / 1024 / 1024 < 50     //这里做文件大小限制
        if (!extension && !extension2) {
          this.$message({
            message: '上传文件只能是 xls、xlsx格式!',
            type: 'warning'
          })
        }
        if (!isLt2M) {
          this.$message({
            message: '上传文件大小不能超过 2MB!',
            type: 'warning'
          })
        }
        return extension || extension2 && isLt2M
      },

      // 文件上传成功
      handlesuccess (response, file, fileList) {
        if (response.code === 0) {
          this.fileInfo = response.data.uploadFile;
          let url = "/api/"+this.fileInfo;
          window.location.href = url;
          this.closeExcel();
          this.reload();
        }
        this.$message({
          message: response.msg,
          center: true
        })
      },

      // 点击已上传的文件链接时的钩子, 可以通过 file.response 拿到服务端返回数据
      handlePreview (file) {
        console.log(file)
      },
    },

  }
</script>
<style lang="scss" scope>
  /*地图选点*/
  .choosedLi {
    color: #B9BCC8 !important;
    background: #ceddd2 !important;
  }

  .choosedType {
    color: #B7BACD!important;
  }

  /*公共模块*/
  @mixin mixin-mainBox {
    /*background: #00356f;*/
  }

  @mixin mixin-mainChildBox {
    border-radius: 10px;
  }

  /*模块标题*/
  .moduleTile {
    width: 100%;
    height: 40px;
    line-height: 40px;
    padding-left: 20px;
  }

  .moduleHome {
    width: calc(100% - 20px);
    height: calc(100% - 50px);
    padding: 0px!important;
    position: relative;
    margin: auto;
  }

  .containerHome2 {
    background: url("../../../static/img/bg.png") no-repeat;
    background-size: 100% 100%;
    width: 100%;
    height: 100%;

    /*标题区*/
    .header {
      width: 100%;
      height: 50px;
      line-height: 50px;
      position: relative;

      & > .title {
        width: 100%;
        text-align: center;
        color: #4C8497;
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
        font-size: 18px;
        .date {
          color: #6F7696;
          font-family: dig;
          margin-right: 10px;
        }
        .upload {
          cursor: pointer;
          margin-right: 10px;
          img {
            width: 20px;
            height: 20px;
          }
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
      .mainLeft {
        width: 23%;
      }
      .mainMap {
        @include mixin-mainChildBox;
        width: calc(52% - 40px);
        margin-left: 20px;
        margin-right: 20px;
      }
      .mainright {
        width: 24%;
      }
    }

    .mainLeft {
      .custom {
        @include mixin-mainChildBox;
        width: 100%;
        height: 60%;
      }

      .custOver {
        @include mixin-mainChildBox;
        width: 100%;
        height: calc(40% - 20px);
        margin-top: 20px;
      }
    }

    .mainright {
      .funt {
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

    /*各个模块*/

    /*客户模块*/
    .custMod {
      width: 100%;
      height: 64%;
    }

    /*负载模块*/
    .loadMod {
      width: 100%;
      height: 36%;
    }

    /*地图*/
    .mapArea {
      width: calc(100% - 20px);
      height: 65%;
      margin: auto 10px;
      position: relative;
      @include mixin-mainChildBox;
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
            width: 14px;
            height: 14px;
            position: absolute;
            right: -14px;
            top: -14px;
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

    /*备品备件*/
    .spareParts {
      @include mixin-mainChildBox;
      width: calc(100% - 20px);
      height: calc(35% - 20px);
      margin: 20px 10px auto 10px;
      .moduleHome table {
        width: 100%;
        height: 100%;
      }
    }

    .spareMod {
      width: 100%;
      height: 100%;
      & > ul {
        width: 100%;
        height: 40px;
        li {
          float: left;
          padding-right: 20px;
          font-size: 14px;
          color: #636886;
          cursor: pointer;
        }
        li:nth-child(1) {
          margin-left: 10px;
        }
      }
      .spareTable {
        width: 100%;
        height: calc(100% - 40px);
        ul {
          width: 100%;
          height: 33%;
          li {
            float: left;
            width: 9%;
            height: 100%;
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 12px;
            color: #767B99;
          }
        }
      }
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

    /*防疫*/
    .prevent {
      .preventMod {
        width: 100%;
        height: 100%;
      }
    }

    .overTable {
      border-radius: 10px;
      width: 100%;
      height: 100%;
    }

    .overTable thead, .overTable tbody tr {
      display: table;
      width: 100%;
      table-layout: fixed;
    }

    .overTable thead {
      background: #cddabf;
      height: 34px;
    }

    .overTable tbody {
      height: calc(100% - 34px);
      width: 100%;
      overflow-y: scroll;
      overflow-x: hidden;
      display: block;
    }

    .overTable tbody tr:hover {
      background: #E7ECDC !important;
      cursor: pointer;
    }

    .overTable tbody tr:nth-child(2n) {
      background: #d7dece;
    }

    .overTable tbody tr:nth-child(2n-1) {
      background: #d0e4cd;
    }

    .myTable tbody {
      display: block;
      height: calc(100% - 78px);
      width: 100%;
      overflow-y: scroll;
      overflow-x: hidden;
      text-align: center;
    }
    .myTable2 tbody {
      display: block;
      width: 100%;
      overflow-y: scroll;
      overflow-x: hidden;
      text-align: center;
    }

    .myTable thead, .myTable tbody tr, .myTable2 thead, .myTable2 tbody tr, {
      display: table;
      width: 100%;
      table-layout: fixed;
    }
    .myTable tbody, .myTable2 tbody {
      border-right: none;
      border-top: none;
    }

    .myTable thead tr th, .overTable thead tr th, .myTable2 thead tr th {
      text-align: center;
    }

    .myTable thead tr:nth-child(1) th:nth-child(2),
    .myTable thead tr:nth-child(2) th:nth-child(3),
    .myTable tbody tr td:nth-child(4) {
      padding-right: 16px;
    }

    /*.myTable ::-webkit-scrollbar {*/
      /*width: 0.25rem;*/
      /*height: 0.25rem;*/
      /*background-image: linear-gradient(135deg, #cad5ba 0%, #cad5ba 72%, #cad5ba 100%);*/
    /*}*/
    /*.myTable ::-webkit-scrollbar-track {*/
      /*border-radius: 0;*/
    /*}*/
    /*.myTable ::-webkit-scrollbar-thumb {*/
      /*border-radius: 0;*/
      /*background-image: linear-gradient(135deg, #c1cfb2 0%, #c1cfb2 72%, #c1cfb2 100%);*/
      /*transition: all .2s;*/
      /*border-radius: 0.25rem;*/
    /*}*/
    /*.myTable ::-webkit-scrollbar-thumb:hover {*/
      /*background-color: rgba(95, 95, 95, 0.7);*/
    /*}*/

    .showTableData .el-dialog {
      width: 30%;
    }

    /*返回武汉按钮*/
    .typeBtnBox {
      width: 28px;
      height: 28px;
      position: absolute;
      left: 20px;
      top: 8px;
      cursor: pointer;
      img {
        width: 100%;
        height: 100%;
      }
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
