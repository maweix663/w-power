<template>
  <div class="containerRail">
    <div class="backHome">
      <img src="../../../static/img/fanhui.png" alt="" style="font-size: 16px;font-weight: 800;cursor: pointer" @click="back">
    </div>
    <div class="header">
      <div class="title">地理围栏</div>
    </div>
    <div class="main">
      <div class="mapRail">
        <div id="railMap" class="railMap"></div>
        <!--操作框-->
        <div v-show="isDraw">
          <el-radio-group fill="#cddabf" text-color="#536844" v-model="radio" @change="agreeChange" style="position:absolute;top:15px;right: 10px;">
            <!--                <el-radio-button :label="1"><img class="shape" src="static/img/yuan.png">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;画圆</el-radio-button>-->
            <el-radio-button :label="2"><img class="shape" src="static/img/juxing.png">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;画矩形</el-radio-button>
            <el-radio-button :label="3"><img class="shape" src="static/img/duobianxing.png">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;画多边形</el-radio-button>
            <el-radio-button :label="4">清除绘图</el-radio-button>
          </el-radio-group>
        </div>
        <div v-show="!isDraw && userPower != 3" @click="exportExcel" style="position:absolute;top:15px;right: 10px;cursor: pointer;background: #fff;">
          <img src="../../../static/img/xiazaiRail.png" alt="下载围栏" title="下载围栏">
        </div>
      </div>
      <div class="right" v-show="isShowRight">
        <div class="rightRadio">
          <el-radio-group fill="#cddabf" @change="changeRail" text-color="#536844" v-model="isCollapse" size="big" style="width: 100%">
            <el-radio-button :label="true">新建围栏</el-radio-button>
            <el-radio-button :label="false">围栏列表</el-radio-button>
          </el-radio-group>
          <el-input
            v-show="!isShow"
            style="width: 80%;margin-top:10px;"
            placeholder="请输入抄表段或者台区号进行搜索"
            size="small"
            v-model="input2"
            clearable>
            <el-button size="small" slot="append" icon="el-icon-search" @click="railList"></el-button>
          </el-input>
        </div>
        <!--新建围栏-->
        <div v-show="isShow" class="rightContent">
          <div class="content">
            <div class="top">
              <el-form ref="form" :model="form" label-width="80px" style="width: 75%;margin-left: 10%">
                <el-form-item label="抄表段">
                  <el-input v-model="form.railName" clearable  placeholder="请输入抄表段名称"
                  ></el-input>
                </el-form-item>
                <el-form-item label="绘制说明">
                  <span>填写好抄表段名称后，通过选择地图上的围栏类型，然后用鼠标绘制一个需要的围栏。</span>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="nextRail">保存</el-button>
                  <el-button type="primary" v-show="userPower != 3" @click="importFile">导入文件</el-button>
                </el-form-item>
              </el-form>
            </div>
            <div class="bottom">
              <el-input
                style="width: 80%;margin-top:10px;margin-left: 10%;"
                placeholder="请输入抄表段或者台区号进行搜索"
                size="small"
                v-model="input1"
                clearable>
                <el-button size="small" slot="append" icon="el-icon-search" @click="unrailList"></el-button>
              </el-input>
              <el-table
                :data="tableRailData"
                stripe
                @row-click="handleCurrentChange"
                highlight-current-row
                height="calc(100% - 92px)"
                style="width: 90%;margin-left: 5%;">
<!--                　<el-table-column label="选择" width="50" center>-->
<!--                　　　　　　<template slot-scope="scope">-->
<!--                　　　　　　　　<el-radio-->
<!--                　　　　　　　　　　class="radio"-->
<!--                　　　　　　　　　　v-model="radio1"-->
<!--                　　　　　　　　　　:label="scope.$index"-->
<!--                　　　　　　　　　　:disabled="scope.row.select">-->
<!--                　　　　　　　　&nbsp;</el-radio>-->
<!--                　　　　　　</template>-->
<!--                　　　　</el-table-column>-->
                <el-table-column
                  align="center"
                  prop="railNo"
                  label="抄表段">
                </el-table-column>
                <el-table-column
                  align="center"
                  prop="areaNo"
                  label="台区号">
                </el-table-column>
              </el-table>
              <paging2 class="pagingChild2" ref="pageChildData2" :total2="total2" @pageFinish2="pageGroup2"
                       style="float: left;margin-top: 10px;"></paging2>
            </div>
          </div>
        </div>
        <div v-show="!isShow" class="rightContent">
          <el-table
            :data="tableData"
            @cell-click="cellClick"
            stripe
            height="calc(100% - 52px)"
            style="width: 80%;margin-left: 10%;height:calc(100% - 52px)">
            <el-table-column
              align="center"
              prop="railNo"
              label="抄表段">
            </el-table-column>
            <el-table-column
              align="center"
              prop="areaNo"
              label="台区号">
            </el-table-column>
            <el-table-column
              align="center"
              width="200"
              label="操作">
              <template slot-scope="scope">
                <el-button @click="handleSelect(scope.row)" type="text" size="small">查看用户信息</el-button>
                <el-button @click="handleEdit(scope.row)" v-show="scope.row.type == 1" type="text" size="small">编辑</el-button>
                <el-button @click="handledel(scope.row)" v-show="scope.row.type == 1" type="text" size="small" style="color: #ff7461">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <paging class="pagingChild" ref="pageChildData" :total="total" @pageFinish="pageGroup"
                  style="margin-left:10%;float: left;margin-top: 10px;"></paging>
        </div>
      </div>
      <div class="right1" v-show="!isShowRight">
        <div class="return" @click="returnBtn">
          <img src="../../../static/img/fanhui.png" alt="" style="font-size: 16px;font-weight: 800;cursor: pointer" >
        </div>
        <div class="railForm">
          <el-form ref="form" :model="form" label-width="80px" style="width: 75%;margin-left: 10%">
            <el-form-item label="抄表段">
              <el-input v-model="form.railName" clearable placeholder="请输入抄表段名称"></el-input>
            </el-form-item>
            <el-form-item label="区域">
              <el-input :disabled="true" v-model="titleText"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="edit">确认修改</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <!-- 批量导入 -->
    <el-dialog class="showTableData" :title="excelTitle" :visible.sync="dialogImport" :before-close="closeExcel"
               :close-on-click-modal=false>
      <el-row style="margin-bottom: 20px;">
      </el-row>
      <el-upload
        class="upload-demo"
        ref="upload"
        accept=".xlsx"
        :limit=1
        :action="excelUrl"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :on-success="handlesuccess"
        :file-list="fileList"
        :headers = "headers"
        :before-upload="beforeUpload"
        :auto-upload="false">
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传文件</el-button>
        <div slot="tip" class="el-upload__tip">只能同时上传<strong>一个xlsx文件</strong>，且不超过<strong>100M</strong></div>
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
  import Paging from '../../components/paging'
  import Paging2 from '../../components/paging2'
  export default {
    name: "rail",
    inject:['reload'],
    components: {
      Paging,
      Paging2,
    },
    data(){
      return {
        // 用户权限
        userPower: null,
        // 地图
        map: Object,
        circle: Object,
        rectangle: Object,
        polygon: Object,
        rectangle1: Object,
        polygon1: Object,
        radio: '',
        mouseTool: null,//鼠标绘图工具
        isDraw: true, //是否显示画围栏的操作栏
        overlays: [],//存放画的围栏图形
        overlaysType: '',//围栏的类型--圆形、矩形、多边形
        paths: [],
        path: {},
        allPt2: [],
        getAllPt2: {},
        pt2: {}, //用来存放每个点的坐标
        //围栏列表
        isCollapse: true,
        isShow:true, //显示新建围栏界面
        isShowRight:true,
        rowData:{},
        // 回显所有围栏
        railType: null,
        railData: null,
        // 点击抄表段回显围栏
        showCellClick: false,
        //搜索抄表段
        form:{
          railName: '',//抄表段名称
          railType:'', //抄表段类型
          railCoordinate:'', //抄表段坐标
          divisionId:'',//区域id
          id:'',
          status:'',
        },
        railData:'',//放解析后的坐标
        tableData:[],
        total: 0,
        list:{
          limit: this.GLOBAL.limit,
          page: 1,
        },
        listRail:{
          limit: this.GLOBAL.limit,
          page: 1,
        },
        titleText:'',
        regionId:'',//存放传过来的地区id
        typeBtn:'',
        input1:'',
        input2:'',
        tableRailData:[],
        total2:0,
        radio1: false,
        showtableDataType:'',
        showtableDataCoordinate:'',
        // 批量导入、更新相关路径
        headers: {
          'Authorization': localStorage.token
        },
        excelUrl: '/api/InfRail/importRailExcel',
        excelTitle: '导入文件',
        dialogImport: false,
        fileList: [],
        fileInfo: null,
      }
    },
    created() {
      this.titleText = this.$route.query.area;
      this.regionId = this.$route.query.regionId;
      this.typeBtn = this.$route.query.type;
      this.page = this.$route.query.page;
      //未绑定围栏抄表段查询
      this.unrailList();
      // 用户权限
      this.getUserPower();
    },
    mounted() {
      this.loadmap();
      this.$refs.pageChildData.pageChild.currentPage = 1;
      this.$refs.pageChildData.pageChild.pagesize = 20;
      this.$refs.pageChildData2.pageChild.currentPage = 1;
      this.$refs.pageChildData2.pageChild.pagesize = 20;
    },
    methods:{
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
      returnBtn(){
        this.clearOverlays()
        this.isShowRight = true;
        this.isDraw = true;
        this.isShow = true;
        this.isCollapse = true;
        this.form.railType='';
        this.form.railName ='';
        this.form.railCoordinate = '';
        this.form.id = '';
        this.form.status = '';
      },
      // 用户权限
      getUserPower() {
        let params = {
          showLoading: false,
        };
        this.http.post('/InfRail/railPermissions', params)
          .then(res => {
            this.userPower = res.data;
          })
          .catch(err => {})
      },
      // 地图
      loadmap() {
        this.map = new AMap.Map('railMap', {
          resizeEnable: true,
          zoom: 16,
          center: [114.341743, 30.546034],
          mapStyle: 'amap://styles/normal',
        });
        this.mouseTool = new AMap.MouseTool(this.map);
        this.listenOverlaysMouse();
      },
      //监听绘制覆盖物
      listenOverlaysMouse: function () {
        let _this = this;
        _this.mouseTool.on('draw', function (e) {
          _this.paths = []
          _this.path = {}
          if (_this.overlays.length == 0) { //要求围栏只能有一个
            _this.overlays.push(e.obj);
          } else {
            _this.map.remove(_this.overlays[0]);
            _this.overlays.splice(0, 1);
            _this.overlays.push(e.obj);
          }
          if (_this.overlaysType == 1) {  //围栏类型为圆形
            _this.path.radius = _this.overlays[0].getRadius();//半径
            _this.path.center = {};//中心点坐标
            _this.path.center.lng = _this.overlays[0].getCenter().lng
            _this.path.center.lat = _this.overlays[0].getCenter().lat
            _this.paths.push(_this.path);
          } else if (_this.overlaysType == 2 || _this.overlaysType == 3) {  //围栏类型为矩形或者多边形
            _this.allPt2 = [];
            _this.getAllPt2 = _this.overlays[0].getPath();  //取得矩形或者多边形每个点的坐标
            for (let n = 0; n < _this.getAllPt2.length; n++) {
              _this.pt2 = {
                'lng': _this.getAllPt2[n].lng,
                'lat':  _this.getAllPt2[n].lat
              }
              _this.allPt2.push(_this.pt2);  //每个点的集合
            }
            _this.path.data = _this.allPt2;
            _this.path.center = {
              // 'lng': _this.wgs84togcj02(_this.overlays[0].Le.map.B.center.lng, _this.overlays[0].Le.map.B.center.lat)[0],
              // 'lat': _this.wgs84togcj02(_this.overlays[0].Le.map.B.center.lng, _this.overlays[0].Le.map.B.center.lat)[1]
            }
            _this.paths.push(_this.path)
          }
          _this.form.railCoordinate = JSON.stringify(_this.paths[0].data);
          console.log(_this.form)
        })
      },
      //绘制围栏
      agreeChange: function (val) {
        this.overlaysType = val;
        // this.form.railType = String(val);  //围栏类型
        this.map.clearMap();
        if (val == 1) {  //画圆
          this.mouseTool.circle({
            fillColor: '#00706b',
            strokeColor: '#405f5b'
          });
        } else if (val == 2) {  //画矩形
          this.mouseTool.rectangle({
            fillColor: '#00706b',
            strokeColor: '#405f5b'
          });
          this.form.railType = 1;
        } else if(val==3) {   //画多边形
          this.mouseTool.polygon({
            fillColor: '#00706b',
            strokeColor: '#405f5b'
          });
          this.form.railType = 2;
        }else{
          this.clearOverlays();
        }
      },
      //清空围栏
      clearOverlays: function () {
        this.radio='';
        this.overlays=[];
        this. overlaysType = '';
        this.map.remove(this.overlays);
        this.map.clearMap();
        if(this.mouseTool) {
          this.mouseTool.close(true)
        }
      },
      //展示围栏--高德
      showRailDetail: function (row) {
        let _this = this;
        let lat0 = "";
        let lng0 = "";
        // _this.map.clearMap();
        if (_this.form.railType == 0) {  //如果围栏类型是圆形
          lng0 = _this.railData.center.lng
          lat0 = _this.railData.center.lat
          _this.circle = new AMap.Circle({
            center: [lng0, lat0],
            radius: _this.railData.radius,
            borderWeight: 1,
            strokeColor: "#405f5b",
            strokeOpacity: 1,
            strokeWeight: 1,
            strokeOpacity: 0.2,
            fillOpacity: 0.4,
            strokeStyle: 'solid',
            strokeDasharray: [10, 10],
            // 线样式还支持 'dashed'
            fillColor: '#00706b',
            zIndex: 50,
          })
          _this.circle.setMap(_this.map)
          // 缩放地图到合适的视野级别
          _this.map.setFitView([_this.circle])
        } else if (_this.form.railType == 1) { //围栏类型是矩形
          let southWest = new AMap.LngLat(_this.railData[1].lng, _this.railData[1].lat)
          let northEast = new AMap.LngLat(_this.railData[3].lng, _this.railData[3].lat)
          let bounds = new AMap.Bounds(southWest, northEast)
          _this.rectangle = new AMap.Rectangle({
            bounds: bounds,
            borderWeight: 1,
            strokeColor: "#405f5b",
            strokeOpacity: 1,
            strokeWeight: 1,
            strokeOpacity: 0.2,
            fillOpacity: 0.4,
            strokeStyle: 'solid',
            strokeDasharray: [10, 10],
            // 线样式还支持 'dashed'
            fillColor: '#00706b',
            zIndex: 50,
          })
          this.rectangle.on('click', function (param) {
            if(_this.showCellClick == true) {
              _this.map.remove(_this.rectangle);
              _this.map.remove(_this.polygon);
            }
            _this.list.limit = 20;
            _this.list.page = 1;
            _this.input2 = row.railNo;
            _this.showCellClick = true;
            _this.railList();
          })
          _this.rectangle.setMap(_this.map)
          // 缩放地图到合适的视野级别
          _this.map.setFitView([_this.rectangle])
        }
        else if (_this.form.railType == 2) { //围栏是多边形
          let polygonPaths = [];
          for (let i = 0; i < _this.railData.length; i++) {
            let polygonPath = [];
            let lng3 = _this.railData[i].lng;
            let lat3 = _this.railData[i].lat
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
            fillColor: '#00706b',
            zIndex: 50,
          })
          this.polygon.on('click', function (param) {
            if(_this.showCellClick == true) {
              _this.map.remove(_this.rectangle);
              _this.map.remove(_this.polygon);
            }
            _this.list.limit = 20;
            _this.list.page = 1;
            _this.input2 = row.railNo;
            _this.showCellClick = true;
            _this.railList();
          })
          _this.map.add(_this.polygon)
          // 缩放地图到合适的视野级别
          _this.map.setFitView([_this.polygon])
        }
      },
      //按钮切换
      changeRail(lable){
        if(lable){
          this.clearOverlays()
          this.isDraw = true; //绘制框可见
          this.isShow = true;//显示新建围栏界面
          this.input1 = '';
        }else {
          //围栏列表查询
          this.input2 = '';
          this.showCellClick = false;
          this.railList();
          this.isDraw = false;//绘制框不可见
          this.isShow = false;//显示围栏列表界面
          this.clearOverlays();
          // 回显所有围栏
          this.getAllRail();
          // this.drawAll();
        }
      },

      /*创建围栏*/
      nextRail:function () {
        if(this.form.railName == ''){
          this.$message({
            message: '请输入抄表段',
            type: 'warning'
          });
        }else if(this.form.railCoordinate == ''){
          this.$message({
            message: '请绘制电子围栏',
            type: 'warning'
          });
        }else{
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
        }
      },

      submitEnd() {
        let params = {
          showLoading: false,
          divisionId:this.regionId,
          railCoordinate:this.form.railCoordinate,
          railNo:this.form.railName,
          type:this.form.railType
        };
        this.http.post('/InfRail/addInfRail', params)
          .then(res => {
            if (res.code == 0){
              this.$message({
                message: '创建围栏成功',
                type: 'success'
              });
            }
            this.form.railName = "";
            this.form.railType = ""
            this.form.railCoordinate = "";
            this.isShow = false;
            this.isDraw = false;
            this.isCollapse = false;
            this.clearOverlays();
            this.showCellClick = false;
            this.railList();
            this.unrailList()
          })
          .catch(err => {})
      },

      /*导入文件*/
      importFile:function(){
        this.dialogImport = true
      },
      closeExcel:function(){
        this.fileList = []
        this.fileInfo = null
        this.dialogImport = false
      },
      // 上传文件
      submitUpload () {
        this.$refs.upload.submit()
      },
      // 文件列表移除文件
      handleRemove (multfile, fileList) {
        console.log(multfile, fileList)
      },

      // 上传前判断
      beforeUpload (multfile) {
        console.log(multfile)
        let testmsg = multfile.name.substring(multfile.name.lastIndexOf('.') + 1)
        let extension = testmsg === 'xls'
        let extension2 = testmsg === 'xlsx'
        let isLt2M = multfile.size / 1024 / 1024 < 100     //这里做文件大小限制
        if (!extension && !extension2) {
          this.$message({
            message: '上传文件只能是 xls、xlsx格式!',
            type: 'warning'
          })
        }
        if (!isLt2M) {
          this.$message({
            message: '上传文件大小不能超过 100MB!',
            type: 'warning'
          })
        }
        return extension || extension2 && isLt2M
      },

      // 文件上传成功
      handlesuccess (response, multfile, fileList) {

        if (response.code === 0) {
          this.fileInfo = response.data.uploadFile;
          let url = "/api/"+this.fileInfo;
          window.location.href = url;
          this.closeExcel();
          this.reload();
        }
        this.$message({
          type: 'success',
          message: response.msg,
          center: true
        })
      },

      // 点击已上传的文件链接时的钩子, 可以通过 file.response 拿到服务端返回数据
      handlePreview (multfile) {
        console.log(multfile)
      },

      // 点击抄表段
      cellClick(row, column, cell, event) {
        this.form.railCoordinate = row.railCoordinate
        this.railData = JSON.parse(this.form.railCoordinate);
        this.form.railType = row.railType;
        this.isDraw = true;
        if(column.property == 'railNo') {
          this.map.remove(this.polygon);
          this.showRailDetail(row);
        }
      },

      //查看用户信息
      handleSelect:function(row){
        this.$router.push({
          path: '/selectCust',
          query:{
            railNo: row.railNo,
            area:this.titleText,
            page: this.page,
            regionId:this.regionId,
            type:this.typeBtn
          }
        });
      },
      //编辑围栏信息
      handleEdit(row){
        console.log(row);
        this.form.railName = row.railNo
        this.form.divisionId = row.divisionId
        this.form.railCoordinate = row.railCoordinate
        this.railData = JSON.parse(this.form.railCoordinate);
        console.log(this.railData)
        this.form.railType = row.railType
        this.radio = parseInt(this.form.railType);
        this.form.id = row.id
        this.form.status = row.status
        this.isShowRight = false;
        this.isDraw = true;
        this.showRailDetail();
      },
      edit(){
        let params = {
          divisionId:this.form.divisionId,
          railCoordinate:this.form.railCoordinate,
          id:this.form.id,
          railNo:this.form.railName,
          status:this.form.status,
          type:this.form.railType,
        };
        this.http.post('/InfRail/updateInfRail', params)
          .then(res => {
            if (res.code == 0) {
              this.$message({
                message: '修改围栏信息成功',
                type: 'success'
              });
              this.showCellClick = false;
              this.railList();//刷新围栏列表
            }
          })
          .catch(err => {
            this.$message.error('修改围栏信息失败');
          })
      },
      //删除围栏信息
      handledel(row){
        let params = {
          id:row.id,
        };
        this.$confirm('您确认删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.http.post('/InfRail/deleteInfRail', params)
            .then(res => {
              if (res.code == 0) {
                this.$message({
                  message: '删除围栏信息成功',
                  type: 'success'
                });
                this.showCellClick = false;
                this.railList();//刷新围栏列表
                this.unrailList();//刷未绑定围栏列表
              }
            })
            .catch(err => {
              this.$message.error('删除围栏信息失败');
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
            center: true
          });
        });
      },
      // 分页组件
      pageGroup: function (data) {
        this.list.limit = data.pagesize;
        this.list.page = data.currentPage;
        this.showCellClick = false;
        this.railList();
      },
      // 分页组件
      pageGroup2: function (data) {
        this.listRail.limit = data.pagesize;
        this.listRail.page = data.currentPage;
        this.radio1 = false;
        this.unrailList();
      },
      //围栏列表
      railList(){
        let params = {
          showLoading: false,
          limit:this.list.limit,
          page :this.list.page,
          regionId:this.regionId,
          railNo: this.input2
        };
        let _this = this;
        this.http.post('/InfRail/selectInfRail', params)
          .then(res => {
            this.tableData = res.data.list;
            this.total = res.data.total;
            // this.drawAll();
            if(this.showCellClick) {
              _this.railType = _this.tableData[0].type;
              _this.railData = JSON.parse(_this.tableData[0].railCoordinate);
              _this.showAllRailArea(_this.tableData[0]);
            }
          })
          .catch(err => {})
      },

      //获取所有围栏
      getAllRail(){
        let params = {
          showLoading: false,
        };
        let _this = this;
        this.http.post('/InfRail/selectInfUserRail', params)
          .then(res => {
            let data = res.data;
            for(let i = 0; i < data.length; i++ ) {
              _this.railType = data[i].type;
              _this.railData = JSON.parse(data[i].railCoordinate);
              _this.showAllRailArea(data[i]);
            }
          })
          .catch(err => {})
      },

      //展示围栏--高德
      showAllRailArea(data) {
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
          strokeColor: "#79948F",
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
          if(_this.showCellClick == true) {
            _this.map.remove(_this.polygon);
          }
          _this.list.limit = 20;
          _this.list.page = 1;
          _this.input2 = data.railNo;
          _this.showCellClick = true;
          _this.railList();
        })
        _this.map.add(_this.polygon);
        // _this.map.setFitView([_this.polygon])
      },

      //未绑定围栏抄表段查询
      unrailList(){
        let params = {
          showLoading: false,
          limit: this.listRail.limit,
          page : this.listRail.page,
          railNo:this.input1
        };
        this.http.post('/InfRail/notBangRailNo', params)
          .then(res => {
            this.tableRailData = res.data.list;
            this.total2 = res.data.total;
          })
          .catch(err => {

          })
      },

      handleCurrentChange(val) {
        if (val != ''){
          this.form.railName = val.railNo;
        }else{
          this.form.railName = ""
        }
      },

      //画所有的围栏
      drawAll(){
        this.map.clearMap();
        for (let i = 0; i < this.tableData.length; i++) {
          this.showtableDataType = this.tableData[i].railType
          this.showtableDataCoordinate = JSON.parse(this.tableData[i].railCoordinate)
          this.form.railType = this.tableData[i].railType
          this.railData = JSON.parse(this.tableData[i].railCoordinate)
          console.log(this.showtableDataCoordinate)
          this.showAllRail();
          // this.showRailDetail();
        }
      },
      //展示所有围栏
      showAllRail(){
        let _this = this;
        let lat0 = "";
        let lng0 = "";
        if (_this.showtableDataType == 1) {  //如果围栏类型是圆形
          lng0 = _this.showtableDataCoordinate.center.lng
          lat0 = _this.showtableDataCoordinate.center.lat
          _this.circle = new AMap.Circle({
            center: [lng0, lat0],
            radius: _this.railData.radius,
            borderWeight: 3,
            strokeColor: "#405f5b",
            strokeOpacity: 1,
            strokeWeight: 6,
            strokeOpacity: 0.2,
            fillOpacity: 0.4,
            strokeStyle: 'solid',
            strokeDasharray: [10, 10],
            // 线样式还支持 'dashed'
            fillColor: '#00706b',
            zIndex: 50,
          })
          _this.circle.setMap(_this.map)
          // 缩放地图到合适的视野级别
          _this.map.setFitView([_this.circle])
        } else if (_this.showtableDataType == 2) { //围栏类型是矩形
          let southWest = new AMap.LngLat(_this.showtableDataCoordinate[1].lng, _this.showtableDataCoordinate[1].lat)
          let northEast = new AMap.LngLat(_this.showtableDataCoordinate[3].lng, _this.showtableDataCoordinate[3].lat)
          let bounds = new AMap.Bounds(southWest, northEast)
          _this.rectangle1 = new AMap.Rectangle({
            bounds: bounds,
            borderWeight: 3,
            strokeColor: "#405f5b",
            strokeOpacity: 1,
            strokeWeight: 6,
            strokeOpacity: 0.2,
            fillOpacity: 0.4,
            strokeStyle: 'solid',
            strokeDasharray: [10, 10],
            // 线样式还支持 'dashed'
            fillColor: '#00706b',
            zIndex: 50,
          })
          _this.rectangle1.setMap(_this.map)
          // 缩放地图到合适的视野级别
          // _this.map.setFitView([_this.rectangle1])
        }
        else if (_this.showtableDataType == 3) { //围栏是多边形
          let polygonPaths = [];
          for (let i = 0; i < _this.showtableDataCoordinate.length; i++) {
            let polygonPath = [];
            let lng3 = _this.showtableDataCoordinate[i].lng;
            let lat3 = _this.showtableDataCoordinate[i].lat
            polygonPath.push(lng3);
            polygonPath.push(lat3);
            polygonPaths.push(polygonPath);
          }
          _this.polygon1 = new AMap.Polygon({
            path: polygonPaths,
            borderWeight: 3,
            strokeColor: "#405f5b",
            strokeOpacity: 1,
            strokeWeight: 6,
            strokeOpacity: 0.2,
            fillOpacity: 0.4,
            strokeStyle: 'solid',
            strokeDasharray: [10, 10],
            // 线样式还支持 'dashed'
            fillColor: '#00706b',
            zIndex: 50,
          })
          _this.map.add(_this.polygon1)
          // 缩放地图到合适的视野级别
          // _this.map.setFitView([_this.polygon1])
        }
      },

      // 批量导出
      exportExcel: function () {
        window.location.href = "/api/InfRail/exportInfRail?regionId=" + this.regionId + "&railNo=" + this.input2 + "&userId=" + localStorage.userId;
      },
    }
  }
</script>

<style lang="scss" scoped>
  .containerRail {
    background: #f2f4e7;
    width: 100%;
    height: 100%;

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
  }

  .main {
    width: calc(100% - 40px);
    height: calc(100% - 70px);
    padding: 0px 20px 20px 20px;
    /*padding-top: 30px;*/
    & > div {
      height: 100%;
      float: left;
    }
    .mapRail {
      width: calc(70% - 24px);
      margin-right: 20px;
      border-radius: 15px;
      position: relative;
      border: 1px solid #b9b9aa;
    }
    .right , .right1{
      width: 30%;
      background:#ffffff;
      border-radius: 15px;
      border: 1px solid #b9b9aa;
    }
  }

  .rightRadio {
    margin-top: 50px;
    text-align: center;
    height: 10%;
  }

  .rightRadio .el-radio-button{
    width:40%
  }

  .rightRadio .el-radio-button .el-radio-button__inner{
    width:100%;
    font-size: 18px;
    font-width: 600;
  }

  .railMap {
    width: 100%;
    height: 100%;
    border-radius: 15px;
  }

  .rightContent{
    width: 100%;
    height: calc(90% - 50px);
  }
  .content{
    height: 100%;
    .top{
      height: 30%;
    }
    .bottom{
      height: 70%;
      width: 100%;
      border-radius:15px;border:1px solid #b9b9aa;
    }
  }
  .backHome{
    position: absolute;
    left:15px;
    color: #536844;
    top: 5px;
    z-index: 10;
    cursor: pointer;
  }
  .right1{
    .return{
      height: 10%;
      width: 100%;
      margin-left: 10px;
      margin-top: 10px;
      cursor: pointer;
      color: #536844;
    }
    .railForm{
      height: calc(90% - 10px);
    }
  }

  .shape{
    position:absolute;
    top:calc(50% - 10px);
    width: 20px;
    height: 20px;
  }

  ::-webkit-scrollbar {
    width: 0.25rem;
    height: 0.25rem;
    background-image: linear-gradient(135deg, #cad5ba 0%, #cad5ba 72%, #cad5ba 100%);
  }
  ::-webkit-scrollbar-track {
    border-radius: 0;
  }
  ::-webkit-scrollbar-thumb {
    border-radius: 0;
    background-image: linear-gradient(135deg, #536844 0%, #536844 72%, #536844 100%);
    transition: all .2s;
    border-radius: 0.25rem;
  }
  ::-webkit-scrollbar-thumb:hover {
    background-color: rgba(95, 95, 95, 0.7);
  }
</style>
