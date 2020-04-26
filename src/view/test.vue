<template>
  <div class="container">
    <div class="dataList">
      <el-table :data="tableData" height="250" border style="width: 100%">
        <el-table-column prop="date" label="日期" width="180"></el-table-column>
        <el-table-column prop="name" label="姓名" width="180"></el-table-column>
        <el-table-column prop="address" label="地址"></el-table-column>
      </el-table>
    </div>
    <div class="work1">
      <p>111</p>
      <span>222</span>
      <p>555</p>
    </div>
  </div>
</template>

<script>
  export default {
    name: "test",
    data() {
      return {
        test: '测试',
        tableData: [
          {date: '2016-05-03', name: '王小虎', address: '上海市普陀区金沙江路 1518 弄'},
          {date: '2016-05-02', name: '王小虎', address: '上海市普陀区金沙江路 1518 弄'},
          {date: '2016-05-04', name: '王小虎', address: '上海市普陀区金沙江路 1518 弄'},
          {date: '2016-05-01', name: '王小虎', address: '上海市普陀区金沙江路 1518 弄'},
          {date: '2016-05-08', name: '王小虎', address: '上海市普陀区金沙江路 1518 弄'},
          {date: '2016-05-06', name: '王小虎', address: '上海市普陀区金沙江路 1518 弄'},
          {date: '2016-05-07', name: '王小虎', address: '上海市普陀区金沙江路 1518 弄'}
        ],
      }
    },
    created() {
      this.getData();
    },
    mounted() {
      $(".dataList").find(".el-table").find(".el-table__body-wrapper").mCustomScrollbar({axis: "xy"});
    },
    methods: {
      getData: function () {  let params = {
        showLoading: true,
        showapi_appid: '133069',
        showapi_sign: '459fe648c0b04d97b665265fe67f48e1',
        mobile: '15527102203',
      };
        this.http.put('/1502-1', params)
          .then(response => {
            console.log(response);
          })
          .catch(err => {
            console.log(err)
          })

      }
    },
  }
</script>

<style lang="scss" scoped>
  @mixin boxWH {
    width: 100%;
    height: 40px;
  }

  @mixin boxWH($width, $height) {
    width: $width;
    height: $height;
  }

  .dataList {
    width: 90%;
    height: 400px;
  }

  .work1 {
    & > p {
      color: yellow;
    }
    & > span {
      @include boxWH(100%, 100px);
      display: inline-block;
      color: red;
      border: 1px solid red;
    }
  }
</style>
