<template>
  <div class="step" >
    <div class="box">
      <div class="head">
        明细查询
        <p></p>
      </div>

      <div class="body">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
          <el-form-item style="margin-bottom: 20px;" label="供电单位" prop="county">
            <el-select size="small" v-model="ruleForm.county" @change="getPowerStations" placeholder="请选择">
              <el-option
                v-for="item in lists.countys"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item size="small" style="margin-bottom: 20px;" label="供电所" prop="powerStation">
            <el-select v-model="ruleForm.powerStation" placeholder="请选择">
              <el-option
                v-for="item in lists.powerStations"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item size="small" style="margin-bottom: 20px;" label="时间" prop="time">
            <el-select v-model="ruleForm.time" placeholder="请选择">
              <el-option
                v-for="item in lists.times"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item size="small" style="margin-bottom: 20px;" label="行业类别" prop="industry">
            <el-select v-model="ruleForm.industry" placeholder="请选择">
              <el-option
                v-for="item in lists.industrys"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
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
    props: {
      typeId: {
        type: String
      }
    },
    data() {
      return {
        lists: {
          countys: [],
          powerStations: [],
          times: [],
          industrys: []
        },
        ruleForm: {
          county: '',
          powerStation: '',
          time: '',
          industry: ''
        },
        rules: {
          county: [
            { required: true, message: '请选择', trigger: 'change' }
          ],
          powerStation: [
            { required: true, message: '请选择', trigger: 'change' }
          ],
          time: [
            { required: true, message: '请选择', trigger: 'change' }
          ],
          industry: [
            { required: true, message: '请选择', trigger: 'change' }
          ]
        }
      }
    },
    created() {

    },
    watch: {
      typeId (val) {
        this.getTabsData({
          enterpriseId: val
        })
      }
    },
    mounted: function () {

    },
    methods: {
      // 获取明细参数
      getTabsData (params) {
        this.http.post('/resumeWork/detailsParame', params)
          .then(res => {
            this.lists.countys = res.data.countys
            this.lists.times = res.data.times
            this.lists.industrys = res.data.industrys
          })
          .catch(err => {})
      },

      // 供电公司选择
      getPowerStations (val) {
        this.http.post('/resumeWork/listPowerStation', {
          county: val,
          enterpriseId: this.typeId
        })
          .then(res => {
            this.lists.powerStations = res.data
          })
          .catch(err => {})
      },

      // 搜索
      search () {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            this.$router.push({
              path: '/mProduction/detail',
              query: {
                ...this.ruleForm,
                enterpriseId: this.typeId
              }
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
