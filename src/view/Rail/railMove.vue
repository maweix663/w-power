<template>
  <div class="containerNewsMove">
    <!--标题头-->
    <div class="header">
      <div class="ret" @click="retPage">
        <img src="../../../static/img/move/ret.png" alt="">
        <span>返回</span>
      </div>
      <div class="title">地理围栏</div>
    </div>

    <!--地理围栏-->
    <div class="module">
      <!--<div class="moduleLabel"><span></span><span>地理围栏</span></div>-->
      <div id="myMap" class="myMap"></div>
      <!--新建围栏-围栏列表-->
      <div class="railBox" :style="railBoxStyle">
        <div class="railLabel">
          <p @click="changeRailBox(1)" v-show="showRailBox"><i class="el-icon-arrow-down"></i></p>
          <p @click="changeRailBox(2)" v-show="!showRailBox"><i class="el-icon-arrow-up"></i></p>
          <span :style="railShow == true?railLabel:''" @click="changeLabel(1)">新建围栏</span>
          <span :style="railShow == false?railLabel:''" @click="changeLabel(2)">围栏列表</span>
        </div>
        <div class="railBoxBody">
          <div v-show="addRailList" class="addRail">
            <el-form label-position="right" label-width="80px" :model="form">
              <el-form-item label="围栏名称">
                <el-input type="text" v-model="form.railName" placeholder="请输入抄表段"></el-input>
              </el-form-item>
              <el-form-item label="抄表段">
                <span @click="noBangRailNo" class="noBangList">查看未绑定的抄表段</span>
              </el-form-item>
              <el-form-item label="绘制说明">
                <span>请在地图选取合适的点进行点击来绘制地理围栏。<strong>点击地图进行绘制，双击结束。</strong></span>
              </el-form-item>
              <el-form-item>
                <el-button @click="reset">重置</el-button>
                <el-button @click="submit">保存</el-button>
                <el-button v-show="showEdit" @click="retRailList">返回</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div v-show="!addRailList" class="railList">
            <div class="railListSearch">
              <el-input v-model="numName" placeholder="请输入抄表段或台区号进行搜索"></el-input>
              <div class="railSearch" @click="getRail">
                <img src="../../../static/img/move/railSearch.png" alt="">
              </div>
            </div>
            <!--表头-->
            <div class="listTitle">
              <p>抄表段</p>
              <p>台区号</p>
              <p>操作</p>
            </div>
            <!--动态列表-->
            <div class="newsListBox" id="newsListBox" ref="element">
              <ul>
                <li class="list-item" data-type="0" v-for="(item,index) in newsList" :key="index">
                  <div class="itemTitle">
                    <div class="item-desc">
                      <p @click="showRail(item)">{{ item.railNo }}</p>
                      <p @click="showRail(item)">{{ item.areaNo }}</p>
                      <p>
                        <span @click="userInfo(item)">
                          <img src="../../../static/img/move/detail.png" alt="查看用户信息" title="查看用户信息">
                        </span>
                        <span>
                          <a :href="'https://uri.amap.com/marker?position='+JSON.parse(item.railCoordinate)[0].lng+','+ JSON.parse(item.railCoordinate)[0].lat +'&name=抄表段 '+ item.railNo ">
                            <img src="../../../static/img/move/daohang.png" alt="导航" title="导航">
                          </a>
                        </span>
                        <span @click="editRail(item)" v-show="item.type == 1">
                          <img src="../../../static/img/move/edit.png" alt="编辑" title="编辑">
                        </span>
                        <span @click="delRail(item)" v-show="item.type == 1">
                          <img src="../../../static/img/move/del.png" alt="删除" title="删除">
                        </span>
                      </p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!--开始绘制-->
      <div v-show="ifStartDraw" class="startDraw">
        <p @click="startDrawEvebt" :style="ifStartDrawStyle">
          <img src="../../../static/img/move/huizhi.png" alt="">
          <span>开始绘制</span>
        </p>
        <p @click="closeDraw">
          <img src="../../../static/img/move/guanbi.png" alt="">
          <span>关闭绘制</span>
        </p>
      </div>

      <!--所有围栏-->
      <div class="allRailImg" v-show="railShow == false">
        <img @click="allListData" src="../../../static/img/all.png" alt="" title="所有围栏">
      </div>

    </div>

    <!--详情-->
    <div class="model" v-if="showDetailModel">
      <div class="modelDetailMain">
        <p><span>时间：</span>{{detailNews.time}}</p>
        <p><span>标题：</span>{{detailNews.title}}</p>
        <p><span>内容：</span>{{detailNews.detail}}</p>
        <div class="modelBtn">
          <button @click="closeDel">关 闭</button>
        </div>
      </div>
    </div>

    <!--提示框-删除-->
    <div class="model" v-if="showModel">
      <div class="modelMain">
        <div class="modelTitle">您确认删除吗?</div>
        <div class="modelBtn">
          <button @click="closeDel">取消</button>
          <button @click="deterDel">确定</button>
        </div>
      </div>
    </div>

    <!--查看未绑定抄表号-->
    <div class="model" v-if="showRailNoModel">
      <div class="bangRailNoBox">
        <div class="railListSearch">
          <el-input v-model="bangRailNoSearch" placeholder="请输入抄表段或台区号进行搜索"></el-input>
          <div class="railSearch" @click="getRailNoListSearch">
            <img src="../../../static/img/move/railSearch.png" alt="">
          </div>
        </div>
        <p class="bangTitle">
          <span>抄表号</span>
          <span>台区号</span>
        </p>
        <div class="bangRailNoBody" id="bangRailNoBody">
          <ul>
            <li v-for="(item, index) in railNoList" :key="index" @click="selectNoBangRailNo(item)">
              <!--<span><template><el-radio v-model="form.railName" :label="item.railNo"></el-radio></template></span>-->
              <span>{{ item.railNo }}</span>
              <span>{{ item.areaNo }}</span>
            </li>
          </ul>
        </div>
        <div class="modelBtn">
          <button @click="closeDel">关 闭</button>
        </div>
        <div class="bangTotal">{{ bangTotal }} 条</div>
      </div>
    </div>

  </div>
</template>

<script>
  export default {
    name: "railMove",
    data() {
      return {
        // 区域
        title: '',
        regionId: '',
        typeBtn: null,
        page: '',
        // 围栏
        railBoxStyle: {
          bottom: 0
        },
        showRailBox: true,
        // 标签切换
        railShow: true,
        // 窗口切换
        addRailList: true,
        // 开启编辑
        showEdit: false,
        railLabel: {
          background: '#cddabf'
        },
        form: {
          id: '',
          railName: '',
          railCoordinate: '', //围栏坐标
          railType: '',//围栏类型
          railId: ''//围栏id
        },
        // 围栏列表-搜索
        numName: '',
        allListDataMsg: false,

        // 地图
        map: Object,
        polygon: Object,
        mouseTool: null,//鼠标绘图工具
        ifStartDraw: true,//是否开启绘制
        ifStartDrawStyle: {
          'background': '#fff'
        },
        city: '',
        overlays: [],//存放画的围栏图形
        paths: [],
        path: {},
        allPt2: [],
        getAllPt2: {},
        pt2: {}, //用来存放每个点的坐标
        railData: [],//围栏数据显示

        // 动态列表
        refreData: false,
        newsList: [],
        pageSize: 1,
        startX: 0, // 初始位置
        endX: 0, // 结束位置
        // 点击抄表段回显围栏
        showCellClick: false,

        // 详情
        showDetailModel: false,
        detailNews: null,

        // 删除-遮罩层
        delId: '',
        showModel: false,

        // 查看未绑定抄表号
        showRailNoModel: false,
        bangRailNoSearch: '',
        bangSearchType: false,
        railNoList: [],
        railType: 1,
        railPosition: false,
        pageSizeBang: 1,
        bangTotal: null,
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

      // 获取战区动态
      this.refreData = false;
      this.showCellClick = false;
      this.getNews();
      this.getRailNoList();
    },
    mounted: function () {
      // 监听滚动
      window.addEventListener('scroll', this.watchScroll, true);
      // 地图
      this.loadmap();
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

      // 地图
      loadmap() {
        this.map = new AMap.Map('myMap', {
          resizeEnable: true,
          zoom: 14,
          center: [114.309277, 30.542268],
          mapStyle: 'amap://styles/normal',
        });
      },

      // 开始绘制事件
      startDrawEvebt() {
        this.mouseTool = new AMap.MouseTool(this.map);
        this.listenOverlaysMouse();
        // 围栏类型
        this.mouseTool.polygon({
          fillColor: '#00706b',
          strokeColor: '#405f5b'
        });
        this.ifStartDrawStyle.background = '#CDDABF';
      },

      // 清除绘制
      closeDraw() {
        this.ifStartDrawStyle.background = '#fff';
        if(this.mouseTool) {
          this.mouseTool.close(true)
        }
      },

      //监听绘制覆盖物
      listenOverlaysMouse: function () {
        let _this = this;
        _this.mouseTool.on('draw', function (e) {
          _this.paths = [];
          _this.path = {};
          if (_this.overlays.length == 0) { //要求围栏只能有一个
            _this.overlays.push(e.obj);
          } else {
            _this.map.remove(_this.overlays[0]);
            _this.overlays.splice(0, 1);
            _this.overlays.push(e.obj);
          }
          _this.allPt2 = [];
          _this.getAllPt2 = _this.overlays[0].getPath();  //取得矩形或者多边形每个点的坐标
          for (let n = 0; n < _this.getAllPt2.length; n++) {
            _this.pt2 = {
              'lng': _this.getAllPt2[n].lng,
              'lat': _this.getAllPt2[n].lat
            }
            _this.allPt2.push(_this.pt2);  //每个点的集合
          }
          _this.path.data = _this.allPt2;
          _this.paths.push(_this.path)

          _this.form.railCoordinate = JSON.stringify(_this.paths[0].data);
        })
      },

      // 搜索未绑定的抄表段列表
      getRailNoListSearch() {
        this.bangSearchType = true;
        this.railNoList = [];
        this.getRailNoList();
      },

      // 获取未绑定的抄表段列表
      getRailNoList() {
        let params = {
          showLoading: false,
          limit: 200,
          page: this.pageSizeBang,
          railNo: this.bangRailNoSearch
        };
        let _this = this;
        this.http.post('/InfRail/notBangRailNo', params)
          .then(res => {
            let data = res.data.list;
            for (let i = 0; i < data.length; i++) {
              _this.railNoList.push(data[i]);
            }
            _this.bangTotal = res.data.total;
            if(_this.bangSearchType) {
              this.$message({
                message: '加载完成',
                type: 'success',
                center: true
              })
            }
          })
          .catch(err => {})
      },

      // 选择抄表段
      selectNoBangRailNo(data) {
        this.form.railName = data.railNo
      },

      // 查看未绑定的抄表段
      noBangRailNo() {
        this.showRailNoModel = true;
      },

      // 重置
      reset: function() {
        this.form.railCoordinate = '';
        this.map.remove(this.overlays);
        this.map.clearMap();
      },

      // 保存
      submit() {
        if (this.form.railName == undefined || this.form.railName == null || this.form.railName == "") {  //判断围栏名称是否输入
          this.$message({
            message: '围栏名称不能为空',
            type: 'warning',
            center: true
          });
          return
        } else if (this.form.railCoordinate == '') {  //判断是否绘制围栏
          this.$message({
            message: '请绘制围栏',
            type: 'warning',
            center: true
          });
          return
        }

        let params = {
          showLoading: false,
          railNo: this.form.railName,
        };
        let _this = this;
        this.http.post('/InfRail/isRailNoBang', params)
          .then(res => {
            _this.submitEnd();
          })
          .catch(err => {
            this.$message({
              message: '该抄表段不存在',
              type: 'warning',
              center: true
            });
          })
      },

      submitEnd() {
        let url = '';
        let params = null;
        if(this.showEdit == false) {
          url = '/InfRail/addInfRail';
          params = {
            showLoading: false,
            divisionId: this.regionId,
            railNo: this.form.railName,
            railCoordinate: this.form.railCoordinate,
            type: 2
          };
        } else {
          url = '/InfRail/updateInfRail';
          params = {
            showLoading: false,
            id: this.form.id,
            divisionId: this.regionId,
            railNo: this.form.railName,
            railCoordinate: this.form.railCoordinate,
            type: 2
          };
        }
        let _this = this;
        this.http.post(url, params)
          .then(res => {
            let data = res.msg;
            this.$message({
              message: data,
              type: 'success',
              center: true
            });
            this.reset();
          })
          .catch(err => {
            this.$message({
              message: err.msg,
              type: 'warning',
              center: true
            });
          })
      },

      // 围栏回显
      showRail(data) {
        // this.reset();
        this.railType = 1;
        this.railPosition = true;
        this.railData = JSON.parse(data.railCoordinate);
        this.map.remove(this.polygon);
        this.showCellClick = true;
        this.showRailDetail(data);
      },

      //展示围栏--高德
      showRailDetail(data) {
        let polygonPaths = [];
        let colorType='';
        if( this.railType == 1) {
          colorType = '#00706b'
        } else {
          colorType = '#CDDABF'
        }
        let _this = this;
        for (let i = 0; i < _this.railData.length; i++) {
          let polygonPath = [];
          let lng3 = _this.railData[i].lng;
          let lat3 = _this.railData[i].lat;
          polygonPath.push(lng3);
          polygonPath.push(lat3);
          polygonPaths.push(polygonPath);
        }
        _this.polygon = new AMap.Polygon({
          path: polygonPaths,
          borderWeight: 1,
          strokeColor: "#405f5b",
          strokeOpacity: 1,
          strokeWeight: 1,
          strokeOpacity: 0.2,
          fillOpacity: 0.4,
          strokeStyle: 'solid',
          strokeDasharray: [10, 10],
          // 线样式还支持 'dashed'
          fillColor: colorType,
          zIndex: 50,
        })
        this.polygon.on('click', function (param) {
          _this.numName = data.railNo;
          if(_this.showCellClick == true) {
            _this.map.remove(_this.polygon);
          }
          _this.showCellClick = true;
          _this.pageSize = 1;
          _this.refreData = false;
          _this.allListDataMsg = false;
          _this.getNews();
        })
        _this.map.add(_this.polygon)
        // 缩放地图到合适的视野级别
        if(this.railPosition) {
          _this.map.setFitView([_this.polygon])
        }
      },

      // 监听滚动
      watchScroll() {
        this.$nextTick(() => {
          var bady = document.getElementById("newsListBox");
          bady.onscroll = () => {
            // 获取距离顶部的距离
            var scrollTop = bady.scrollTop;
            // 获取可视区的高度
            var windowHeight = bady.clientHeight;
            // 获取滚动条的总高度
            var scrollHeight = bady.scrollHeight;
            // console.log("距顶部"+scrollTop+"可视区高度"+windowHeight+"滚动条总高度"+scrollHeight);
            if (scrollTop + windowHeight + 2 >= scrollHeight) {
              this.pageSize++;
              this.refreData = true;
              this.allListDataMsg = false;
              this.showCellClick = false;
              this.getNews();
            }
          }

          // 未绑定的抄表号
          if(this.showRailNoModel) {
            var bang = document.getElementById("bangRailNoBody");
            bang.onscroll = () => {
              // 获取距离顶部的距离
              var scrollTop = bady.scrollTop;
              // 获取可视区的高度
              var windowHeight = bady.clientHeight;
              // 获取滚动条的总高度
              var scrollHeight = bady.scrollHeight;
              // console.log("距顶部"+scrollTop+"可视区高度"+windowHeight+"滚动条总高度"+scrollHeight);
              if (scrollTop + windowHeight + 2 >= scrollHeight) {
                this.pageSizeBang++;
                this.bangSearchType = false;
                this.getRailNoList();
              }
            }
          }
        });
      },

      // 新建围栏-围栏列表盒子
      changeRailBox(data) {
        this.showRailBox = !this.showRailBox;
        if(data == 1) {
          this.railBoxStyle.bottom = 'calc(-50% + 4rem)'
        } else {
          this.railBoxStyle.bottom = 0
        }
      },

      // 新建围栏-围栏列表切换
      changeLabel(data) {
        // 清除绘制
        this.closeDraw()
        this.reset();
        if(data == 1) {
          this.railShow = true;
          this.addRailList = true;
          this.showEdit = false;
          this.numName = '';
          this.form.railName = '';
          this.railPosition = true;
          this.ifStartDraw = true;
        } else {
          this.railShow = false;
          this.addRailList = false;
          this.numName = '';
          this.pageSize = 1;
          this.newsList = [];
          this.allListDataMsg = false;
          this.showCellClick = false;
          this.getNews();
          this.getAllRail();
          this.railPosition = false;
          this.ifStartDraw = false;
        }
      },

      // 显示所有围栏
      getAllRail() {
        let _this = this;
        this.http.post('/InfRail/selectInfUserRail', )
          .then(res => {
            let data = res.data;
            for(let i = 0; i < data.length; i++ ) {
              _this.railType = data[i].type;
              _this.railData = JSON.parse(data[i].railCoordinate);
              _this.showRailDetail(data[i]);
            }
          })
          .catch(err => {})
      },

      // 搜索围栏
      getRail() {
        this.pageSize = 1;
        this.refreData = false;
        this.allListDataMsg = false;
        this.showCellClick = false;
        this.getNews();
      },

      // 所有围栏
      allListData() {
        this.numName = '';
        this.pageSize = 1;
        this.refreData = false;
        this.allListDataMsg = true;
        this.showCellClick = false;
        this.getNews();
      },

      // 获取围栏列表
      getNews() {
        let params = {
          showLoading: false,
          regionId: this.regionId,
          limit: 20,
          page: this.pageSize,
          railNo: this.numName
        };
        let _this = this;
        this.http.post('/InfRail/selectInfRail', params)
          .then(res => {
            let data = res.data.list;
            if (_this.refreData) {
              for (let i = 0; i < data.length; i++) {
                _this.newsList.push(data[i]);
              }
            } else {
              _this.newsList = data;
            }
            if(_this.allListDataMsg == true) {
              this.$message({
                type: 'success',
                center: true,
                message: '搜索全部围栏成功'
              })
            }
            if(_this.showCellClick) {
              _this.railType = 1;
              _this.railPosition = false;
              _this.railData = JSON.parse(data[0].railCoordinate);
              _this.showRailDetail(data[0]);
            }
          })
          .catch(err => {})
      },

      // 用户信息
      userInfo(data) {
        this.$router.push({
          path: "/userInfo",
          query: {
            title: this.title,
            regionId: this.regionId,
            page: this.page,
            typeBtn: this.typeBtn,
            railNo: data.railNo
          }
        });
      },

      // 点击详情
      toDetail(data) {
        this.detailNews = data;
        this.showDetailModel = true;
      },

      // 编辑
      editRail(data) {
        this.form.id = data.id;
        this.form.railName = data.railNo;
        this.form.railCoordinate = data.railCoordinate,
          this.addRailList = true;
        this.showEdit = true;
        this.ifStartDraw = true;
        this.reset();
        this.showRail(data);
      },

      // 返回围栏列表
      retRailList() {
        this.railShow = false;
        this.addRailList = false;
        this.numName = '';
        this.pageSize = 1;
        this.newsList = [];
        this.reset();
        this.allListDataMsg = false;
        this.showCellClick = false;
        this.getNews();
      },

      // 删除
      delRail(data) {
        this.showModel = true;
        this.delId = data.id;
      },

      // 关闭
      closeDel() {
        this.showModel = false;
        this.showDetailModel = false;
        this.showRailNoModel = false;
        this.bangSearchType = false;
      },

      // 确定
      deterDel() {
        let params = {
          showLoading: false,
          id: this.delId
        };
        this.http.post('/InfRail/deleteInfRail', params)
          .then(res => {
            this.showModel = false;
            this.$message({
              type: 'success',
              message: "删除成功",
              center: true
            })
            // 获取战区动态
            this.refreData = false;
            this.pageSize = 1;
            this.newsList = [];
            this.allListDataMsg = false;
            this.showCellClick = false;
            this.getNews();
          })
          .catch(err => {
            this.showModel = false;
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
  .containerNewsMove {
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

    /*地理围栏*/
    .module {
      width: calc(100% - 0rem);
      height: calc(100% - 7rem);
      margin: 0rem;
      border-radius: 1rem;
      background: #FFFFFF;
      position: relative;
      .moduleLabel {
        width: 100%;
        padding: 1rem 0rem;
        display: flex;
        align-items: center;
        span:nth-child(1) {
          display: inline-block;
          width: 0.4rem;
          height: 1.6rem;
          background: #00706B;
          margin-left: 2rem;
        }
        span:nth-child(2) {
          font-size: 1.6rem;
          color: #00706B;
          margin-left: 1rem;
          font-weight: bold;
        }
      }
      .myMap {
        width: 100%;
        height: calc(100% - 0rem);
        margin-left: 0rem;
      }
      /*新建围栏-围栏列表*/
      .railBox {
        width: 100%;
        height: 50%;
        position: absolute;
        left: 0rem;
        background: #FFFFFF;
        .railLabel {
          width: 100%;
          height: 4rem;
          position: relative;
          p {
            position: absolute;
            top: -1.6rem;
            left: 50%;
            margin-left: -1.5rem;
            background: #fff;
            border-radius: 2rem 2rem 0 0;
            cursor: pointer;
            i {
              width: 3rem;
              height: 1.6rem;
              font-size: 2rem;
              display: flex;
              justify-content: center;
              align-items: center;
            }
          }
          span {
            float: left;
            display: inline-block;
            width: 50%;
            height: 4rem;
            line-height: 4rem;
            text-align: center;
            color: #536844;
            font-size: 1.4rem;
          }
        }
        .railBoxBody {
          width: 100%;
          height: calc(100% - 4rem);
          .addRail {
            width: 90%;
            height: 100%;
            margin-top: 1rem;
            margin-left: 3%;
            overflow: auto;
            input {
              color: #cecece;
              border: 1px solid #b9c9aa;
            }
            span {
              display: inline-block;
              color: #878686;
              font-size: 1.2rem;
              margin-top: 0.6rem;
              line-height: 2.6rem!important;
            }
            button {
              width: 5.6rem;
              height: 3rem;
              text-align: center;
              line-height: 3rem;
              padding: 0;
              background: #cddabf;
            }
            .noBangList {
              color: #536844;
              padding: 0.4rem 1rem;
              background: #cddabf;
              border-radius: 0.4rem;
            }
          }
          .railList {
            width: 100%;
            height: 100%;
            .railListSearch {
              width: 100%;
              margin-top: 1rem;
              margin-bottom: 1rem;
              position: relative;
              input {
                border: 1px solid #b9c9aa;
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
                cursor: pointer;
              }
            }
            /*表头*/
            .listTitle {
              width: 100%;
              height: 3.2rem;
              background: #f8f8f8;
              p {
                display: inline-block;
                width: 30%;
                height: 3.2rem;
                line-height: 3.2rem;
                text-align: center;
                font-size: 1.4rem;
                color: #95979d;
                float: left;
              }
              p:nth-child(3) {
                width: 40%;
              }
            }
            /*动态列表*/
            .newsListBox {
              width: 100%;
              height: calc(100% - 9.2rem);
              background: #f8f8f8;
              overflow-y: auto;
              ul {
                width: 100%;
                .list-item {
                  height: 3.2rem;
                  line-height: 3.2rem;
                  margin-top: 1rem;
                  position: relative;
                  -webkit-transition: all 0.2s;
                  transition: all 0.2s;
                  .itemTitle {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    justify-content: center;
                    font-size: 1.4rem;
                    .item-desc {
                      width: 100%;
                      height: 100%;
                      & > p {
                        display: inline-block;
                        width: 30%;
                        height: 100%;
                        text-align: center;
                        color: #95979d;
                        float: left;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                      }
                      p:nth-child(3) {
                        display: inline-block;
                        width: 40%;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        span {
                          float: left;
                          color: #536844;
                          margin-left: 0.6rem;
                        }
                      }
                    }
                  }
                }
              }

            }
          }
        }
      }

      /*开始绘制*/
      .startDraw {
        position: absolute;
        top: 0rem;
        right: 0;
        width: 10rem;
        height: 6rem;
        border-radius: 0.4rem;
        font-size: 1.4rem;
        border: 1px solid #ccc;
        z-index: 100;
        /*display: flex;*/
        /*justify-content: center;*/
        p {
          width: 100%;
          height: 3rem;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          img {
            width: 1.4rem;
            height: 1.4rem;
          }
          span {
            margin-left: 0.4rem;
          }
        }
        p {
          background: #fff;
        }
      }

      /*所有围栏*/
      .allRailImg {
        position: absolute;
        right: 1rem;
        top: 2rem;
        width: 2rem;
        height: 2rem;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }

    /*提示框-详情-删除*/
    .model {
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.6);
      z-index: 999;
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
      /*查看未绑定抄表号*/
      .bangRailNoBox {
        width: 80%;
        height: 80%;
        background: #fff;
        border-radius: 1rem;
        position: relative;
        .railListSearch {
          width: 90%;
          margin-top: 1rem;
          margin-left: 5%;
          margin-bottom: 1rem;
          position: relative;
          input {
            border: 1px solid #b9c9aa;
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
            cursor: pointer;
          }
        }
        .bangTitle {
          width: 100%;
          height: 4rem;
          line-height: 4rem;
          span {
            float: left;
            display: inline-block;
            height: 4rem;
            line-height: 4rem;
            text-align: center;
            font-size: 1.4rem;
            font-weight: bold;
          }
          span:nth-child(1) {
            width: 40%;
          }
          span:nth-child(2) {
            width: 60%;
          }
        }
        .bangRailNoBody {
          width: 100%;
          height: calc(100% - 14rem);
          overflow-y: auto;
          ul {
            width: 100%;
            li {
              width: 100%;
              height: 3.2rem;
              cursor: pointer;
              span {
                float: left;
                height: 3.2rem;
                line-height: 3.2rem;
                text-align: center;
                font-size: 1.4rem;
              }
              span:nth-child(1) {
                width: 40%;
              }
              span:nth-child(2) {
                width: 60%;
              }
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
          }
          button:nth-child(1) {
            background: #eee;
            color: rgba(0, 0, 0, 0.73);
          }
        }
        .bangTotal {
          position: absolute;
          bottom: 1rem;
          right: 1rem;
          font-size: 1.4rem;
        }
      }
    }
  }
</style>
