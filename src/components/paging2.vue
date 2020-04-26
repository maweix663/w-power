<template>
  <div>
    <div class="block">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageChild.currentPage"
                     small      :page-sizes="[20, 50, 200, 500]" :pager-count="5" :page-size="pageChild.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total2">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        pageChild: {
          pagesize: 20,
          currentPage: 1,
        }
      };
    },
    props: ["total2"],
    methods: {
      handleSizeChange(val) {
        this.pageChild.pagesize = val;
        this.$emit('pageFinish2', this.pageChild);
        // this.$parent.dataList();

      },
      handleCurrentChange(val) {
        this.pageChild.currentPage = val;
        this.$emit('pageFinish2', this.pageChild);
        // this.$parent.dataList();
      }
    },
  }
</script>

<style>
</style>
