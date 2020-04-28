<template>
  <div class="step" >
    <div class="box">
      <div class="head">
        {{ objDetail.name }}
        <p></p>

        <div v-if="objDetail.search" class="head-btn">
          <a :class="{'btnLeft': true, 'active': isActive == 1}" @click="changeActive(isActive)">按供电区域</a>
          <a :class="{'btnRight': true, 'active': isActive == 2}" @click="changeActive(isActive)">按行业类别</a>
        </div>
      </div>

      <div class="body">
        <el-table
        :data="tableData"
        style="width: 100%"
        height="300"
        :default-sort = "{prop: 'date', order: 'descending'}"
        >
        <el-table-column
          v-for="(v, i) in objDetail.columns"
          :key="i" 
          :label="v.label" 
          :prop="v.prop" 
          :width="v.width" 
          :min-width="v.minWidth" 
          :align="v.align || 'center'" 
          :show-overflow-tooltip="!v.noTooltip"
          :sortable="v.sortable"
          width="180">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
      </el-table>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "step",
    props: {
      objDetail: {
        type: Object
      }
    },
    data() {
      return {
        tableData: [
          {
            data: '111'
          },
          {
            data: '222'
          }
        ],
        isActive: 1
      }
    },
    created() {

    },
    mounted: function () {

    },
    methods: {
      // 切换查询条件
      changeActive (active) {
        if (active == 1) {
          this.isActive = 2
        } else {
          this.isActive = 1
        }
      } 
    },
  }
</script>

<style lang="scss" scoped>
.step {
  margin-bottom: 10px;

  .box {
    overflow: hidden;
    border-radius: 5px;

    .head {
      position: relative;
      line-height: 23px;
      font-size: 16px;
      background: #fff;
      color: #3f6f6b;
      font-weight: bold;
      padding: 20px 0 0 30px;
      font-weight: bold;

      p {
        position: absolute;
        width: 4px;
        height: 23px;
        left: 12px;
        top: 20px;
        background: #3f6f6b;
      }

      .head-btn {
        position: absolute;
        line-height: 23px;
        right: 10px;
        top: 18px;
        font-size: 12px;

        a {
          height: 23px;
          display: inline-block;
          line-height: 18px;
          padding: 2px 5px;
          box-sizing: border-box;
          border: 1px solid #e3e3e3;
          float: left;
          cursor: pointer;
        }
        a.active{
          background: rgba(79, 137, 133, 0.3);
        }

        .btnLeft {
          border-radius: 3px 0 0 3px;
        }
        .btnRight {
          border-radius: 0 3px 3px 0;
          border-left: 0;
        }
      }
    }

    .body {
      background: #fff;
      padding: 10px;
      box-sizing: border-box;
    }
  }
}
</style>
