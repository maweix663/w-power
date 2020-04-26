<template>
  <div class="containerWorkMove">
    <div class="containerWorkMoveMain" id="containerWorkMove">
      <!--标题-->
      <div class="header" id="headLogo">
        <div class="title">复工复产</div>
        <div class="selectArea" @click="changeType">
          <img src="../../../static/img/work/type.png" alt="">
          <span>{{ type }}</span>
          <img src="../../../static/img/work/next.png" alt="">
        </div>
      </div>

      <!--菜单列表-->
      <div class="headList" :class="navBarFixed == true ? 'navBarWrap' :''">
        <div class="listBox">
          <ul>
            <li v-for="(item, index) in navList" :style="labelList == index?selectLabel: ''" @click="changeNavList(item, index)">{{ item.enterpriseType }}</li>
          </ul>
        </div>
      </div>

      <!--logo-->
      <div class="headLogo">
        <img src="../../../static/img/work/headBg.png" alt="">
      </div>

      <!--关键指标-->
      <div  class="importData">
        <div class="labelPosition"  id="listImport"></div>
        <div class="importLabel">
          <p>关键指标</p>
          <div class="explainClick" @click="ecplainEvent">
            <p>
              <img src="../../../static/img/work/explain2.png" alt="">
              <span>指标说明</span>
            </p>
          </div>
        </div>

        <div class="dataListOne" v-loading="importDataLoading">
          <ul>
            <li v-for="(item, index) in dataListArr">
              <p>
                <span><label>较上日</label>  {{item.complate}}</span>
                <span>{{item.value}}</span>
                <span>{{item.name}} <span v-show="item.name == '当日用电量'">(万千瓦时)</span></span>
              </p>
            </li>
          </ul>
        </div>
      </div>

      <!--复工复产情况-->
      <div class="module newModule">
        <div class="moduleLabel"><span></span><span>复工复产情况</span></div>
        <div class="workTypeBox">
          <div class="workTypeBox1" v-loading="workTypeBox1Loading">
            <!--区域-->
            <div class="workArea">
              <ul :style="areaWidth">
                <li @click="getAreaWork('')">
                  <span :style="division == ''?areaSelect:''">全市></span>
                </li>
                <li v-for="(item, index) in workAreaList" :key="index" @click="getAreaWork(item)">
                  <img src="../../../static/img/work/areaIcon.png" alt="">
                  <span :style="division == item?areaSelect:''">{{ item }}</span>
                </li>
              </ul>
            </div>
            <!--区域复工图-->
            <div class="workEchart" id="workEchart"></div>
            <!--复工类型-->
            <div class="workType">
              <ul>
                <li :style="workType == 0?workTypeBg:''" @click="workTypeSelect(0)">复工率</li>
                <li :style="workType == 1?workTypeBg:''" @click="workTypeSelect(1)">复产率</li>
                <li :style="workType == 2?workTypeBg:''" @click="workTypeSelect(2)">复工电力指数</li>
              </ul>
            </div>
          </div>
          <!--行业标题-->
          <div v-show="enterpriseTypeShow" class="industryTitle">各行业类别复工电力指数</div>
          <div class="workTypeBox2" v-show="enterpriseTypeShow" v-loading="workTypeBox2Loading">
            <!--行业图-->
            <div class="industryEchart" id="industryEchartId"></div>
            <!--行业类型-->
            <div class="indeustryTypeList">
              <ul>
                <li v-for="(item, index) in seriesColorArr" :key="index" @click="indeustryClick(index)" :style="industryIndex == index?'background: #ccc':''">
                  <span :style="item.color"></span>
                  <span>{{ item.name }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!--指标排名-->
      <div class="module">
        <div class="moduleLabel"><span></span><span>指标排名</span></div>
        <div class="indexRanking" v-loading="indexRankingLoading">
          <div class="companyList" v-show="true">
            <div class="typeSelectBody">
              <span>{{ company }}</span>
              <img @click="showCompanySelect = !showCompanySelect;" v-show="showCompanySelect == false" alt="" src="../../../static/img/work/down.png">
              <img @click="showCompanySelect = !showCompanySelect;" v-show="showCompanySelect == true" alt="" src="../../../static/img/work/down.png">
            </div>
            <div class="typeSelectList" v-show="showCompanySelect">
              <ul>
                <li @click="companySelect('')">武汉供电公司</li>
                <li v-for="(item,index) in companyList" :key="index" @click="companySelect(item)" :style="company == item?'color: #000;':''">{{ item }}</li>
              </ul>
            </div>
          </div>
          <ul>
            <li v-for="(item,index) in nameArea">
              <span>{{ item }}</span>
              <div class="ranking" :id="'ranking' + index"></div>
              <!--平均值标注-->
              <div class="avgArr avgOne">
                平均值：{{ rankingAvgArr[index][0] }}%
              </div>
            </li>
          </ul>
        </div>
      </div>

      <!--明细查询-->
      <div class="module">
        <div class="moduleLabel"><span></span><span>明细查询</span></div>
        <div class="detailSearch" v-loading="detailSearchLoading">
          <!--供电单位-->
          <div class="detailSelect countyList">
            <div class="typeSelectBox">
              <div class="typeSelectTitle">
                <span class="risk">*</span>
                <span class="detailTitle">供电单位</span>
              </div>
              <div class="typeSelectBody">
                <span>{{ county }}</span>
                <img @click="detailOpenClose(1)" v-show="showDetailSearchIndex != 1" alt="" src="../../../static/img/work/down.png">
                <img @click="detailOpenClose(1)" v-show="showDetailSearchIndex == 1" alt="" src="../../../static/img/work/down.png">
              </div>
            </div>
            <div class="typeSelectList" v-show="showDetailSearchIndex == 1">
              <ul>
                <li v-for="(item,index) in detailSearchArr.countys" :key="index" @click="showDetailSearchIndex = 0;county = item;powerStation = '' ;getPower()" :style="county == item?'color: #000;':''">{{ item }}</li>
              </ul>
            </div>
          </div>
          <!--供电所-->
          <div class="detailSelect powerStationList">
            <div class="typeSelectBox">
              <div class="typeSelectTitle">
                <span class="risk">*</span>
                <span class="detailTitle">供电所</span>
              </div>
              <div class="typeSelectBody">
                <span>{{ powerStation }}</span>
                <img @click="detailOpenClose(2)" v-show="showDetailSearchIndex != 2" alt="" src="../../../static/img/work/down.png">
                <img @click="detailOpenClose(2)" v-show="showDetailSearchIndex == 2" alt="" src="../../../static/img/work/down.png">
              </div>
            </div>
            <div class="typeSelectList" v-show="showDetailSearchIndex == 2">
              <ul>
                <li v-for="(item,index) in powerArr" :key="index" @click="showDetailSearchIndex = 0;powerStation = item;" :style="powerStation == item?'color: #000;':''">{{ item }}</li>
              </ul>
            </div>
          </div>
          <!--时间-->
          <div class="detailSelect timeList">
            <div class="typeSelectBox">
              <div class="typeSelectTitle">
                <span class="risk">*</span>
                <span class="detailTitle">时间</span>
              </div>
              <div class="typeSelectBody">
                <span>{{ time }}</span>
                <img @click="detailOpenClose(3)" v-show="showDetailSearchIndex != 3" alt="" src="../../../static/img/work/down.png">
                <img @click="detailOpenClose(3)" v-show="showDetailSearchIndex == 3" alt="" src="../../../static/img/work/down.png">
              </div>
            </div>
            <div class="typeSelectList" v-show="showDetailSearchIndex == 3">
              <ul>
                <li v-for="(item,index) in detailSearchArr.times" :key="index" @click="showDetailSearchIndex = 0;time = item;" :style="time == item?'color: #000;':''">{{ item }}</li>
              </ul>
            </div>
          </div>
          <!--行业类别-->
          <div class="detailSelect industryList">
            <div class="typeSelectBox">
              <div class="typeSelectTitle">
                <span class="risk">*</span>
                <span class="detailTitle">行业类别</span>
              </div>
              <div class="typeSelectBody">
                <span>{{ industry }}</span>
                <img @click="detailOpenClose(4)" v-show="showDetailSearchIndex != 4" alt="" src="../../../static/img/work/down.png">
                <img @click="detailOpenClose(4)" v-show="showDetailSearchIndex == 4" alt="" src="../../../static/img/work/down.png">
              </div>
            </div>
            <div class="typeSelectList" v-show="showDetailSearchIndex == 4">
              <ul>
                <li v-for="(item,index) in detailSearchArr.industrys" :key="index" @click="showDetailSearchIndex = 0;industry = item;" :style="industry == item?'color: #000;':''">{{ item }}</li>
              </ul>
            </div>
          </div>
          <!--按钮-->
          <div class="detailSelect industryList">
            <div class="typeSelectBox">
                <p class="searchData" @click="searchData">搜 索</p>
            </div>
          </div>
        </div>
      </div>

    </div>


    <!--指标说明-->
    <div class="model" v-if="showWindowModel">
      <div class="modelWindowMain">
        <div class="modelWindowBody">
          <div class="head">指标说明</div>
          <div class="body">
            <ul>
              <li>
                <p>
                  <img src="../../../static/img/work/yuan.png" alt="">
                  <span>企业复工电力指数</span>
                </p>
                <p>
                  （复工率×0.5+复产率×0.5）×100
                </p>
              </li>
              <li>
                <p>
                  <img src="../../../static/img/work/yuan.png" alt="">
                  <span>复工率</span>
                </p>
                <p>
                  复工企业（日电量≥30%日均电量基准值的企业）户数占所有企业总户数的百分比
                </p>
              </li>
              <li>
                <p>
                  <img src="../../../static/img/work/yuan.png" alt="">
                  <span>复产率</span>
                </p>
                <p>
                  所有企业当日合计电量占所有企业合计日均电量基准值的百分比
                </p>
              </li>
              <li>
                <p>
                  <img src="../../../static/img/work/yuan.png" alt="">
                  <span>已复工企业复产率</span>
                </p>
                <p>
                  已复工企业当日合计电量占已复工企业合计日均电量基准值的百分比
                </p>
              </li>
              <li>
                <p>
                  <img src="../../../static/img/work/yuan.png" alt="">
                  <span>日均电量基准值</span>
                </p>
                <p>
                  各企业2019年上半年平均日用电量
                </p>
              </li>
            </ul>
          </div>
        </div>
        <div class="modelBtn">
          <img @click="closeDel" src="../../../static/img/work/close.png" alt="">
        </div>
      </div>
    </div>

    <!--明细搜索结果-->
    <div class="model" v-if="showSearchModel">
      <div class="modelWindowMain">
        <div class="modelWindowBody">
          <div class="head">搜索结果</div>
          <div class="body">
            <el-table :data="searchDataList" stripe height="100%" style="width: 100%;background: #f2f4e7;color: #536844;border-radius:15px;border:1px solid #b9b9aa;">
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
        <div class="modelBtn">
          <img @click="closeDel" src="../../../static/img/work/close.png" alt="">
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  export default {
    name: "workMove",
    data() {
      return {
        // 宽高-屏幕尺寸
        screenWidth: document.body.clientWidth,
        screenHeight: document.body.clientHeight,

        // 各个模块的加载效果
        // 关键指标
        importDataLoading: true,
        // 复功复产
        workTypeBox1Loading: true,
        workTypeBox2Loading: true,
        // 指标排行
        indexRankingLoading: true,
        // 明细查询
        detailSearchLoading: true,


        // 模块类型
        type: '防疫保电',
        // 标签置顶
        navBarFixed: false,
        // 标签列表
        navList: [],
        labelList: 0,
        // 企业id
        enterpriseId: '',
        // 企业类型展示
        enterpriseTypeShow: false,

        // 关键指标
        dataListArr: [],
        // 指标说明
        showWindowModel: false,

        // 复工复产情况
        // 区域
        workAreaList: [],
        // 区域id
        division: '',
        // 区域复工数据
        workX: [],
        workY: [],
        // 复工类型
        workType: 0,

        // 复工行业
        industryArr: [],
        timeIndustry: [],
        dataIndustry: [],
        seriesArr: [],
        seriesAllArr: [],
        industryIndex: null,
        seriesColorArr: [],
        seriesColorAllArr: [
          {name: '农、林、牧、渔业', color: '#4e79a7'},
          {name: '工业', color: '#a0cbe8'},
          {name: '建筑业', color: '#f28e2b'},
          {name: '交通运输、仓储和邮政业', color: '#ffbe7d'},
          {name: '信息传输、软件和信息技术服务业', color: '#59a14f'},


          {name: '批发和零售业', color: '#8cd17d'},
          {name: '住宿和餐饮业', color: '#b6992d'},
          {name: '金融业', color: '#f1ce63'},
          {name: '房地产业', color: '#499894'},
          {name: '租赁和商务服务业', color: '#86bcb6'},

          {name: '公共服务及管理组织', color: '#e15759'},
        ],

        // 指标排名
        company: '武汉供电公司',
        showCompanySelect: false,
        companyList: [],
        nameArea: [],
        rankingXArr: [],
        rankingYArr: [],
        rankingAvgArr: [],

        // 明细查询
        // 供电单位、供电所、时间、行业类别
        county: '',
        powerStation: '',
        time: '',
        industry: '',
        showDetailSearch: false,
        showDetailSearchIndex: 0,
        detailSearchArr: [],
        powerArr: [],
        // 搜索结果
        showSearchModel: false,
        searchDataList: [],

        // 样式-选中标签
        selectLabel: {
          borderBottom: '3px solid #fff'
        },
        // 区域宽度
        areaWidth: {
          width: '8rem'
        },
        // 区域选中颜色
        areaSelect: {
          color: '#179531',
          fontWeight: 'bold',
          fontSize: '1.4rem'
        },
        // 复工类型选中颜色
        workTypeBg: {
          background: '#00958E',
          color: '#fff'
        },
        // 行业列表宽度
        indeustryTypeListWidth: {
          width: '30rem'
        },
        // 图表legend
        legend: 12,
        // 坐标
        xyAxis: 10,
      }
    },
    filters: {
      areaFilter(val) {
        return val.replace('区','')
      }
    },
    beforeRouteLeave (to, from, next) {
      window.removeEventListener('scroll', this.watchScroll, true)
      next()
    },
    created() {
      // 获取标签列表
      this.getNavList();
    },
    mounted() {
      // 监听滚动
      window.addEventListener('scroll', this.watchScroll, true);
      this.$nextTick(function () {
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
      // 防疫保电
      changeType() {
        this.$router.push({
          path: '/whHomeMove'
        });
      },

      // 监听滚动
      watchScroll () {
        var read = document.querySelector('#containerWorkMove').scrollTop
        if (read > 80) {
          this.navBarFixed = true
        } else {
          this.navBarFixed = false
        }
      },

      // 获取标签列表
      getNavList() {
        let params = {
          showLoading: false,
        };
        this.http.post('/resumeWork/listEnterprise', params)
          .then(res => {
            this.navList = res.data;
            this.enterpriseId = res.data[0].id;
            if(res.data[0].enterpriseType == '规上工业企业' ||  res.data[0].enterpriseType == '建筑企业') {
              this.enterpriseTypeShow = false;
            } else {
              this.enterpriseTypeShow = true;
            }
            // 关键指标
            this.getKeyIndex();
            // 获取区域
            this.getArea();
            // 获取区域复工数据
            this.getAreaWork('');
            // 获取公司
            this.getCompany();
            // 获取指标
            this.getRanking();
            // 获取明细查询参数
            this.getDetailParam();
          })
          .catch(err => {})
      },

      // 选择标签
      changeNavList(item, index) {
        this.labelList = index;
        this.enterpriseId = item.id;
        this.division = '';
        this.workType = 0;
        this.industryIndex = null;
        if(item.enterpriseType == '规上工业企业' ||  item.enterpriseType == '建筑企业') {
          this.enterpriseTypeShow = false;
        } else {
          this.enterpriseTypeShow = true;
        }
        // 关键指标
        this.getKeyIndex();
        // 获取区域
        this.getArea();
        // 获取区域复工数据
        this.getAreaWork('');
        // 获取公司
        this.getCompany();
        // 获取指标
        this.getRanking();
        // 获取明细查询参数
        this.getDetailParam();
      },

      // 关键指标
      getKeyIndex() {
        this.importDataLoading = true;
        let params = {
          showLoading: false,
          enterpriseId: this.enterpriseId
        };
        this.http.post('/resumeWork/getVitalData', params)
          .then(res => {
            if(res.code == 0) {
              // 重要数据
              this.dataListArr = res.data;
            }
            this.importDataLoading = false;
          })
          .catch(err => {})
      },

      // 指标说明
      ecplainEvent() {
        this.showWindowModel = true;
      },

      // 关闭
      closeDel() {
        this.showWindowModel = false;
        this.showSearchModel = false;
      },

      // 获取区域
      getArea() {
        let params = {
          showLoading: false,
          enterpriseId: this.enterpriseId
        };
        this.http.post('/resumeWork/listDivision', params)
          .then(res => {
            if(res.code == 0) {
              let len = res.data.length + 1;
              this.areaWidth.width = 8 * len + 'rem';
              // 重要数据
              this.workAreaList = res.data;
            }
          })
          .catch(err => {})
      },

      // 获取区域复工数据
      getAreaWork(item, type) {
        this.workTypeBox1Loading = true;
        this.division = item;
        if(type != 'workType') {
          this.workType = 0;
          this.industryIndex = null;
          if(this.enterpriseTypeShow) {
            // 获取行业数据
            this.getIndustry();
          }
        }
        let params = {
          showLoading: false,
          enterpriseId: this.enterpriseId,
          division: item,
          reWorkType: this.workType
        };
        this.http.post('/resumeWork/getReWorkCase', params)
          .then(res => {
            if(res.code == 0) {
              let data = res.data;
              this.workX = [];
              this.workY = [];
              for(let i = 0; i < data.length; i++) {
                let time = parseInt(data[i].date.substring(4,6)) + '.' + parseInt(data[i].date.substring(6,8));
                let val = parseFloat(data[i].value);
                this.workX.push(time);
                this.workY.push(val);
              }
              let _this = this;
              this.$nextTick(function () {
                // 区域复工图
                _this.workEchart();
              })
            }
            this.workTypeBox1Loading = false;
          })
          .catch(err => {})
      },

      // 复工类型选择
      workTypeSelect(data) {
        this.workType = data;
        // 获取区域复工数据
        this.getAreaWork(this.division, 'workType');
      },

      // 区域复工图
      workEchart() {
        let _this = this;
        let workEchart = this.$echarts.init(document.getElementById('workEchart'));
        workEchart.resize();
        workEchart.setOption({
          grid: {
            left: '8%',
            right:'12%',
            top: '6%',
            bottom: '6%',
            containLabel: true
          },
          tooltip: {
            trigger: 'axis',
            // formatter: '{b}<br />{c}%',
            formatter:function(params) {
              let num = params[0].data.toFixed(2);
              return params[0].name + '<br />' + num;
            }
          },
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
                  color: '#E1E1E1',
                  width: 1,
                }
              },
              axisLabel: {
                show: true,
                textStyle: {
                  fontSize: _this.xyAxis,
                  color: '#8D8D8D'
                },
              },
              data: _this.workX
            }
          ],
          yAxis: [
            {
              type: 'value',
              nameTextStyle: {
                fontSize: _this.xyAxis,
                color: '#2D2F2E'
              },
              axisTick: { //y轴刻度线
                show: false
              },
              splitLine: { //网格线
                show: true,
                lineStyle: {
                  color: '#DFDFDF',
                }
              },
              axisLine: {
                lineStyle: {
                  color: '#6D718A',
                  width: 0,
                }
              },
              axisLabel: {
                show: true,
                formatter:'{value}',
                textStyle: {
                  fontSize: _this.xyAxis,
                  color: '#7A7A7A'
                },
              },
            }
          ],
          series: [
            {
              name: '百分比',
              type: 'line',
              barWidth: '60%',
              itemStyle: {
                normal: {
                  color: '#FFBC78'
                },
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                },
              },
              data: _this.workY
            }
          ]
        }, true)
      },

      // 获取各个行业数据
      getIndustry() {
        this.workTypeBox2Loading = true;
        let params = {
          showLoading: false,
          enterpriseId: this.enterpriseId,
          division: this.division,
          reWorkType: this.workType,
          industryOne: ''
        };
        let _this = this;
        this.http.post('/resumeWork/getIndustryPowerCase', params)
          .then(res => {
            if(res.code == 0) {
              let data = res.data;
              _this.industryArr = [];
              _this.timeIndustry = [];
              _this.dataIndustry = [];
              _this.seriesArr  = [];
              _this.seriesAllArr  = [];
              _this.seriesColorArr = [];
              for(let i = 0; i < data.length; i++) {
                _this.industryArr.push(data[i].industryOne);
                let list = [];
                for(let n = 0; n < data[i].list.length; n++) {
                  let val = parseFloat(data[i].list[n].value);
                  list.push(val)
                }
                _this.dataIndustry.push(list)
              }
              for(let j = 0; j < data[0].list.length; j++) {
                let time = parseInt(data[0].list[j].date.substring(6,8))+'日';
                _this.timeIndustry.push(time)
              }

              for(let m = 0; m <  _this.dataIndustry.length; m++) {
                let colorStr = '';
                for(let s = 0; s < _this.seriesColorAllArr.length; s++) {
                  if(_this.industryArr[m] == _this.seriesColorAllArr[s].name) {
                    colorStr = _this.seriesColorAllArr[s].color;
                  }
                }
                let useColor = {
                  name: this.industryArr[m],
                  color: 'background:' + colorStr
                };
                _this.seriesColorArr.push(useColor);
                let obj = {
                  name: _this.industryArr[m],
                  type: 'line',
                  data: _this.dataIndustry[m],
                  itemStyle: {
                    normal: {
                      color: colorStr
                    }
                  },
                };
                _this.seriesArr.push(obj)
              }
              _this.indeustryTypeListWidth.width = 14*_this.seriesColorArr.length + 'rem';
              _this.seriesAllArr = _this.seriesArr;
              this.$nextTick(function () {
                // 行业复工图
                _this.IndustryEchartEvent();
              })
            }
            this.workTypeBox2Loading = false;
          })
          .catch(err => {})
      },

      // 行业点击事件
      indeustryClick(index) {
        this.seriesArr = [];
        if(this.industryIndex == index) {
          this.industryIndex = null;
          this.seriesArr = this.seriesAllArr;
        } else {
          this.industryIndex = index;
          this.seriesArr.push(this.seriesAllArr[index]);
        }
        // 行业复工图
        this.IndustryEchartEvent();
      },

      // 行业复工图
      IndustryEchartEvent() {
        let _this = this;
        let echart = this.$echarts.init(document.getElementById('industryEchartId'));
        echart.resize();
        echart.setOption({
          tooltip: {
            trigger: 'axis',
            position: [10, 10],
            formatter:function(params) {
              let strArr = '';
              for (let i = 0; i < params.length; i++) {
                let num = params[i].data.toFixed(2);
                strArr += params[i].seriesName + ': ' + num + '<br />';
              }
              return params[0].name + '<br />' + strArr;
            }
          },
          // legend: {
          //   type: 'scroll',
          //   icon: 'circle',
          //   bottom: 40,
          //   itemWidth: 8,
          //   itemHeight: 8,
          //   data: _this.industryArr
          // },
          grid: {
            left: '8%',
            right:'12%',
            top: '10%',
            bottom: '40',
            containLabel: true
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
          xAxis: {
            type: 'category',
            name:'日期',
            nameLocation: 'end',
            axisTick: { //y轴刻度线
              show: false
            },
            splitLine: { //网格线
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#7E8197',
                width: 1,
              }
            },
            axisLabel: {
              show: true,
              formatter:'{value}',
              textStyle: {
                fontSize: _this.xyAxis,
                color: '#262827'
              },
            },
            data: _this.timeIndustry
          },
          yAxis: {
            type: 'value',
            name:'指数',
            axisTick: { //y轴刻度线
              show: false
            },
            splitLine: { //网格线
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#7E8197',
                width: 1,
              }
            },
            axisLabel: {
              show: true,
              formatter:'{value}',
              textStyle: {
                fontSize: _this.xyAxis,
                color: '#262827'
              },
            },
            boundaryGap: false,
          },
          series: _this.seriesArr
        }, true)
      },

      // 获取公司
      getCompany() {
        let params = {
          showLoading: false,
          enterpriseId: this.enterpriseId,
        };
        this.http.post('/resumeWork/listCounty', params)
          .then(res => {
            if(res.code == 0) {
              let data = res.data;
              this.companyList = data;
            }
          })
          .catch(err => {})
      },

      // 选择公司
      companySelect(item) {
        if(item == '') {
          this.company = '武汉供电公司';
        } else {
          this.company = item;
        }
        this.showCompanySelect = false;
        this.getRanking();
      },

      // 获取指标
      getRanking() {
        this.indexRankingLoading = true;
        let county = this.company;
        if(this.company == '武汉供电公司') {
          county = ''
        }
        let params = {
          showLoading: false,
          enterpriseId: this.enterpriseId,
          county: county
        };
        let _this = this;
        this.http.post('/resumeWork/getRanking', params)
          .then(res => {
            if(res.code == 0) {
              let data = res.data;
              _this.nameArea = [];
              _this.rankingXArr = [];
              _this.rankingYArr = [];
              _this.rankingAvgArr = [];
              for(let i = 0; i < data.length; i++) {
                _this.nameArea.push(data[i].name);
                let x = [];
                let y = [];
                let avg = [];
                for(let j = 0; j < data[i].data.length; j++) {
                  x.push(data[i].data[j].name);
                  y.push(data[i].data[j].percent);
                  avg.push(String(data[i].avg));
                }
                _this.rankingXArr.push(x);
                _this.rankingYArr.push(y);
                _this.rankingAvgArr.push(avg);
              }
              this.$nextTick(function () {
                // 指标排行
                for(let m = 0; m < 4; m++) {
                  let id = 'ranking' + m;
                  _this.rankIngEchar(id, m);
                }
              })
            }
            this.indexRankingLoading = false;
          })
          .catch(err => {})
      },

      // 指标排行图
      rankIngEchar(id, m) {
        let colorArr = ['#499894', '#58B2AF', '#F28E2B', '#FFBC78'];
        let _this = this;
        let echart = this.$echarts.init(document.getElementById(id));
        echart.resize();
        echart.setOption({
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            },
            formatter: '{b}<br /> {c}%',
          },
          grid: {
            left: '8',
            right:'36',
            top: '20',
            bottom: '10',
            containLabel: true
          },
          xAxis: {
            type: 'value',
            axisTick: { //y轴刻度线
              show: false
            },
            splitLine: { //网格线
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#7E8197',
                width: 1,
              }
            },
            axisLabel: {
              show: true,
              formatter:'{value}%',
              textStyle: {
                fontSize: 10,
                color: '#3D3E3E'
              },
              // interval:0,
              // rotate:40
            },
          },
          yAxis: {
            type: 'category',
            axisTick: { //y轴刻度线
              show: false
            },
            splitLine: { //网格线
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#7E8197',
                width: 1,
              }
            },
            axisLabel: {
              show: true,
              formatter:'{value}',
              textStyle: {
                fontSize: _this.xyAxis,
                color: '#3D3E3E'
              },
            },
            data: _this.rankingXArr[m]
          },
          series: [{
            type: 'bar',
            data: _this.rankingYArr[m],
            barWidth : 10,//柱图宽度
            itemStyle: {
              normal: {
                color: colorArr[m]
              }
            },
            markLine:{
              symbol: 'none',
              lineStyle: {
                color: '#4E79A7'
              },
              label: {
                show: false,
                position: 'middle',
                roatate: 90,
                // distance: ['-68', '10'],
                formatter: '{b}: {c}%',
                textStyle: {
                  fontSize: _this.xyAxis,
                  color: '#000',
                },
              },
              data:[
                {type: 'average',name:'平均值'}
              ],
            }
          }]
        }, true)
      },

      // 明细查询
      // 展开下拉框
      detailOpenClose(index) {
        if(index == 2 && this.county == '') {
          this.$message({
            type: 'warning',
            message: '请选择供电单位',
            center: true
          })
          return
        }
        if(this.showDetailSearchIndex == index) {
          this.showDetailSearchIndex = 0;
        } else {
          this.showDetailSearchIndex = index;
        }
        this.showDetailSearch = !this.showDetailSearch;
      },

      // 获取明细查询参数
      getDetailParam() {
        this.detailSearchLoading = true;
        let params = {
          showLoading: false,
          enterpriseId: this.enterpriseId,
        };
        this.http.post('/resumeWork/detailsParame', params)
          .then(res => {
            if(res.code == 0) {
              let data = res.data;
              this.detailSearchArr = data;
            }
            this.detailSearchLoading = false;
          })
          .catch(err => {})
      },

      // 获取供电单位对应供电所
      getPower() {
        this.detailSearchLoading = true;
        let params = {
          showLoading: false,
          enterpriseId: this.enterpriseId,
          county: this.county
        };
        this.http.post('/resumeWork/listPowerStation', params)
          .then(res => {
            if(res.code == 0) {
              let data = res.data;
              this.powerArr = data;
            }
            this.detailSearchLoading = false;
          })
          .catch(err => {})
      },

      // 明细搜索
      searchData() {
        if(this.county == '' || this.powerStation == '' || this.time == '' || this.industry == '') {
          this.$message({
            type: 'warning',
            message: '请选择搜素条件',
            center: true
          })
          return
        }
        this.$router.push({
          path: '/workSearch',
          query: {
            enterpriseId: this.enterpriseId,
            county: this.county,
            powerStation: this.powerStation,
            time: this.time,
            industry: this.industry,
          }
        });
        // let params = {
        //   showLoading: true,
        //   enterpriseId: this.enterpriseId,
        //   county: this.county,
        //   powerStation: this.powerStation,
        //   time: this.time,
        //   industry: this.industry,
        // };
        // this.http.post('/resumeWork/reWorkDetails', params)
        //   .then(res => {
        //     if(res.code == 0) {
        //       let data = res.data;
        //       this.searchDataList = data;
        //     } else {
        //       this.searchDataList = [];
        //     }
        //     this.showSearchModel = true;
        //   })
        //   .catch(err => {})
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

  .containerWorkMove {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    position: relative;
    background-image: url("../../../static/img/move/midBg.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;

    .containerWorkMoveMain {
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
          width: 12rem;
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
            padding: 0 0 0 0.4rem;
          }
          img {
            float: left;
            width: 1.8rem;
            height: 1.8rem;
          }
          img:nth-child(3) {
            width: 1.6rem;
            height: 1.6rem;
          }
        }
      }

      /*标签列表*/
      .headList {
        width: calc(100% - 4rem);
        height: 4.5rem;
        padding: 0 2rem;
        background: #00706B;
        font-size: 1.6rem;
        overflow: hidden;
        z-index: 3000;
        .listBox {
          width: 100%;
          height: 100%;
          overflow-x: auto;
          ul {
            float: left;
            width: 44rem;
            height: 4rem;
            li {
              float: left;
              height: 3.6rem;
              line-height: 3.6rem;
              padding: 0rem 1rem;
              background: #00706B;
              color: #FFFFFF;
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

      /*关键指标*/
      .importData {
        width: calc(100% - 4rem);
        margin: -10rem 2rem auto 2rem;
        border-radius: 1rem;
        background: #fff;
        z-index: 10;
        position: absolute;
        .importLabel {
          width: 100%;
          height: 4rem;
          background: #1DA39D;
          border-radius: 1rem 1rem 0 0;
          p:nth-child(1) {
            display: inline-block;
            height: 4rem;
            line-height: 4rem;
            color: #FFFFFF;
            font-size: 1.6rem;
            text-indent: 2rem;
          }
          .explainClick {
            float: right;
            width: 10rem;
            height: 4rem;
            p {
              float: right;
              display: flex;
              justify-content: center;
              align-items: center;
              width: 10rem;
              height: 4rem;
              img {
                width: 1.6rem;
                height: 1.6rem;
              }
              span {
                color: #fff;
                font-size: 1.2rem;
                text-indent: 1rem;
              }
            }
          }
        }
        .dataListOne {
          width: 100%;
          height: 18rem;
          margin-top: 1rem;
          background: #fff;
          ul {
            width: 100%;
            li {
              float: left;
              width: 33.3%;
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
                    color: #7C7C7C;
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
                  span {
                    color: #262827;
                    font-size: 1rem;
                  }
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
              color: #46a07a;
            }
            li:nth-child(5) span:nth-child(1),
            li:nth-child(5) span:nth-child(2) {
              color: #e95261;
            }
            li:nth-child(6) span:nth-child(1),
            li:nth-child(6) span:nth-child(2) {
              color: #f4aa6a;
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
          padding: 2rem 0rem 1rem 0rem;
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

      /*复工复产情况*/
      .newModule {
        margin-top: 15rem;
        .moduleLabel {
          overflow: hidden;
          position: relative;
        }
      }

      .workTypeBox {
        width: 100%;
        padding-bottom: 1rem;
        .workTypeBox1 {
          width: 100%;
          height: 32rem;
          /*区域*/
          .workArea {
            width: 100%;
            height: 4rem;
            overflow-x: auto;
            ul {
              height: 100%;
              li {
                float: left;
                width: 8rem;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                img {
                  width: 1.4rem;
                  height: 1.4rem;
                }
                span {
                  color: #656565;
                  font-size: 1.4rem;
                  margin-left: 0.2rem;
                }
              }
            }
          }
          /*区域复工图*/
          .workEchart {
            width: 100%;
            height: 24rem;
          }
          /*复工类型*/
          .workType {
            width: 100%;
            height: 4rem;
            ul {
              width: 100%;
              height: 100%;
              display: flex;
              justify-content: center;
              align-items: center;
              li {
                display: inline-block;
                float: left;
                height: 3.2rem;
                line-height: 3.2rem;
                text-align: center;
                border: 1px solid #ccc;
                border-radius: 2rem;
                font-size: 1.4rem;
                cursor: pointer;
              }
              li:nth-child(1),
              li:nth-child(2) {
                width: 7rem;
                margin-right: 1rem;
              }
              li:nth-child(3) {
                width: 12rem;
              }
            }
          }
        }

        /*行业标题*/
        .industryTitle {
          margin-top: 1rem;
          margin-left: 1rem;
          color: #000;
          font-size: 1.4rem;
          font-weight: bold;
        }

        .workTypeBox2 {
          width: 100%;
          /*行业图*/
          .industryEchart {
            width: 100%;
            height: 36rem;
          }

          /*.行业类型*/
          .indeustryTypeList {
            width: 100%;
            margin-bottom: 1rem;
            ul {
              width: calc(100% - 1rem);
              overflow: hidden;
              margin-left: 1rem;
              li {
                float: left;
                padding: 0 1rem;
                height: 3.2rem;
                border-radius: 0.2rem;
                display: flex;
                justify-content: center;
                align-items: center;
                span:nth-child(1) {
                  display: inline-block;
                  width: 0.6rem;
                  height: 0.6rem;
                  border-radius: 0.5rem;
                }
                span:nth-child(2) {
                  display: inline-block;
                  height: 3.2rem;
                  line-height: 3.2rem;
                  font-size: 1.4rem;
                  color: #656565;
                  margin-left: 0.4rem;
                }
              }
            }
          }
        }
      }

      /*指标排名*/
      .indexRanking {
        width: 100%;
        padding-bottom: 1rem;
        .companyList {
          width: 16rem;
          margin-left: calc(100% - 16rem);
          position: relative;
          .typeSelectBody {
            width: 100%;
            height: 4rem;
            display: flex;
            align-items: center;
            span {
              display: inline-block;
              width: calc(100% - 2rem);
              height: 4rem;
              line-height: 4rem;
              color: #000;
              font-size: 1.4rem;
              font-weight: bold;
            }
            img {
              width: 1.6rem;
            }
            img:nth-child(3) {
              /* Rotate div */
              transform: rotate(180deg);
              -ms-transform: rotate(180deg); /* Internet Explorer */
              -moz-transform: rotate(180deg); /* Firefox */
              -webkit-transform: rotate(180deg); /* Safari 和 Chrome */
              -o-transform: rotate(180deg); /* Opera */
            }
          }
          .typeSelectList {
            width: 100%;
            height: 15rem;
            background: #fff;
            border-radius: 0.4rem;
            margin-left: -1rem;
            overflow-y: auto;
            position: absolute;
            z-index: 10;
            ul {
              width: 100%;
              height: 15rem;
              li {
                list-style: none;
                height: 3.2rem;
                line-height: 3.2rem;
                padding-left: 1rem;
                color: #00706B;
                font-size: 1.4rem;
                border-bottom: 1px solid #ddd;
              }
              li:nth-last-child {
                border-bottom: 0px solid #ddd;
              }
            }
          }
        }
        ul {
          width: calc(100% - 1rem);
          height: 100rem;
          margin-left: 1rem;
          li {
            width: 100%;
            height: 25rem;
            position: relative;
            span {
              float: left;
              display: flex;
              justify-content: center;
              align-items: center;
              width: 2rem;
              height: 100%;
              color: #000000;
              font-size: 1.4rem;
            }
            .ranking {
              float: left;
              width: calc(100% - 2rem);
              height: 100%;
            }
            .avgArr {
              position: absolute;
              top: 1rem;
              right: 0rem;
              font-size: 1.2rem;
            }
          }
        }
      }

      /*明细查询*/
      .detailSearch {
        width: 100%;
        height: 30rem;
        .detailSelect {
          width: 90%;
          height: 3.2rem;
          margin-left: 4%;
          margin-top: 2rem;
          position: relative;
          .typeSelectBox {
            width: 100%;
            .typeSelectTitle {
              float: left;
              width: 8rem;
              height: 3.2rem;
              line-height: 3.2rem;
              text-align: right;
              font-size: 1.4rem;
              .risk {
                color: #FF1818;
              }
              .detailTitle {
                color: #000;
              }
            }
            .typeSelectBody {
              float: left;
              width: calc(100% - 9.2rem);
              height: 3.2rem;
              margin-left: 1rem;
              border: 1px solid #2A2A2A;
              border-radius: 0.2rem;
              display: flex;
              align-items: center;
              span {
                display: inline-block;
                width: calc(100% - 2rem);
                height: 3.2rem;
                line-height: 3.2rem;
                color: #666;
                font-size: 1.4rem;
                font-weight: bold;
                text-indent: 0.5rem;
                overflow: hidden;
              }
              img {
                width: 1.6rem;
              }
              img:nth-child(3) {
                /* Rotate div */
                transform: rotate(180deg);
                -ms-transform: rotate(180deg); /* Internet Explorer */
                -moz-transform: rotate(180deg); /* Firefox */
                -webkit-transform: rotate(180deg); /* Safari 和 Chrome */
                -o-transform: rotate(180deg); /* Opera */
              }
            }
            .searchData {
              width: 7.2rem;
              height: 3.2rem;
              line-height: 3.2rem;
              text-align: center;
              background: #58B2AF;
              color: #fff;
              font-size: 1.4rem;
              border-radius: 1.6rem;
              margin-left: 9.2rem;
              cursor: pointer;
            }
          }
          .typeSelectList {
            width: calc(100% - 9.2rem);
            height: 15rem;
            background: #fff;
            border-radius: 0.4rem;
            margin-left: -1rem;
            overflow-y: auto;
            position: absolute;
            right: 0;
            top: 3.4rem;
            z-index: 10;
            ul {
              width: 100%;
              height: 15rem;
              li {
                list-style: none;
                height: 3.2rem;
                line-height: 3.2rem;
                padding-left: 1rem;
                color: #00706B;
                font-size: 1.4rem;
                border-bottom: 1px solid #ddd;
              }
              li:nth-last-child {
                border-bottom: 0px solid #ddd;
              }
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
        height: 82%;
        border-radius: 1rem;
        padding: 1rem 0;
        .modelWindowBody {
          width: 100%;
          height: calc(100% - 4rem);
          background: #fff;
          border-radius: 0.4rem;
          .head {
            width: 100%;
            height: 4rem;
            line-height: 4rem;
            text-align: center;
            color: #333;
            font-size: 1.6rem;
            font-weight: bold;
          }
          .body {
            width: calc(100% - 2rem);
            height: calc(100% - 4rem);
            margin-left: 1rem;
            overflow: auto;
            ul {
              width: 100%;
              li {
                width: 100%;
                margin-bottom: 1rem;
                p {
                  width: 100%;
                  line-height: 2.8rem;
                  font-size: 1.4rem;
                }
                p:nth-child(1) {
                  display: flex;
                  align-items: center;
                  img {
                    width: 1rem;
                    height: 1rem;
                  }
                  span {
                    color: #555;
                    font-size: 1.6rem;
                    margin-left: 0.6rem;
                    font-weight: bold;
                  }
                }
              }
            }
          }
        }
        .modelBtn {
          width: 100%;
          height: 4rem;
          display: flex;
          justify-content: center;
          img {
            width: 3rem;
            height: 3rem;
            margin-top: 1rem;
          }
        }
      }
    }

  }

</style>
