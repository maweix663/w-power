<template>
  <div class="containerWork" >
    <div class="header">
      <div class="title" :style="title">复工复产</div>
      <div @click="uploadFile" class="upload"><img src="../../../static/img/upload.png"></div>
    </div>


    <!--展示区-->
    <div class="main">

    </div>

    <!--返回武汉按钮-->
    <div class="typeBtnBox" @click="returnBtn">
      <img src="../../../static/img/fanhui.png" alt="">
    </div>

    <!-- 批量导入 -->
    <el-dialog class="showTableData" :title="excelTitle" :visible.sync="dialogImport" :before-close="closeExcel"
               :close-on-click-modal=false>
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
    name: "work",
    data() {
      return {

        // 标题
        title: {
          fontSize: '20px'
        },

        // 批量导入、更新相关路径
        headers: {
          'Authorization': localStorage.token
        },
        excelUrl: '/api/resumeWork/importResumeExcel',
        excelTitle: '导入文件',
        dialogImport: false,
        fileList: [],
        fileInfo: null,

      }
    },
    created() {

    },
    mounted: function () {

    },
    methods: {
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

<style lang="scss" scoped>
  .containerWork {
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
      .title {
        width: 100%;
        text-align: center;
        color: #4C8497;
        font-weight: bold;
      }

      .upload {
        position: absolute;
        top: 5px;
        right: 10px;
        cursor: pointer;
        img {
          width: 20px;
          height: 20px;
        }
      }

    }

    /*展示区*/
    .main {
      width: calc(100% - 40px);
      height: calc(100% - 90px);
      padding: 20px;
      /*background: #00356f;*/
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

  }
</style>
