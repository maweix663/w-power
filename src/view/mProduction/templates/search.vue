<template>
  <div class="step" >
    <div class="box">
      <div class="head">
        明细查询
        <p></p>
      </div>

      <div class="body">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
          <el-form-item style="margin-bottom: 20px;" label="供电单位" prop="region">
            <el-select size="small" v-model="ruleForm.region" placeholder="请选择">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item size="small" style="margin-bottom: 20px;" label="供电单位" prop="region">
            <el-select v-model="ruleForm.region" placeholder="请选择">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item size="small" style="margin-bottom: 20px;" label="供电单位" prop="region">
            <el-select v-model="ruleForm.region" placeholder="请选择">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item size="small" style="margin-bottom: 20px;" label="供电单位" prop="region">
            <el-select v-model="ruleForm.region" placeholder="请选择">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
        </el-form>

        <div style="text-align: center;">
          <a @click="search" class="btn">搜索</a>
        </div>
        
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "step",
    data() {
      return {
        ruleForm: {
          region: ''
        },
        rules: {
          region: [
            { required: true, message: '请选择', trigger: 'change' }
          ]
        }
      }
    },
    created() {

    },
    mounted: function () {

    },
    methods: {
      search () {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            this.$router.push({
              path: '/mProduction/detail'
            })
          }
        })
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
      line-height: 40px;
      font-size: 16px;
      background: #fff;
      color: #3f6f6b;
      padding-left: 20px;

      p {
        position: absolute;
        width: 3px;
        height: 16px;
        left: 12px;
        top: 11px;
        background: #3f6f6b;
      }
    }

    .body {
      background: #fff;
      padding: 10px;
      box-sizing: border-box;

      .btn {
        border-radius: 15px;
        display: inline-block;
        width: 80px;
        background: #57a8a2;
        height: 30px;
        color: #fff;
        line-height: 30px;
        text-align: center;
        cursor: pointer;
      }
    }
  }
}
</style>
