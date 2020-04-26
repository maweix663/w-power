<template>
  <div id="app">
    <router-view v-if="isRouterAlive"></router-view>
  </div>
</template>

<script>
  export default {
    name: 'App',
    provide () {    //父组件中通过provide来提供变量，在子组件中通过inject来注入变量。
      return {
        reload: this.reload
      }
    },
    data() {
      return {
        isRouterAlive: true
      }
    },
    destroyed () {
      window.removeEventListener('beforeunload', e => this.beforeunloadHandler(e))
    },
    methods: {
      // 判断移动端还是pc端
      _isMobile(){
        let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
        return flag;
      },
      reload () {
        this.isRouterAlive = false;            //先关闭，
        this.$nextTick(function () {
          this.isRouterAlive = true;         //再打开
        })
      },
    },
    mounted: function() {
      let time = (new Date()).getTime();
      let ifTime = localStorage.getItem('timeNum');
      if(ifTime) {
        if(parseInt(time) > parseInt(ifTime) + 60*1000) {
          if (this._isMobile()) {
            this.$router.replace('/loginMove');
          }else {
            this.$router.replace('/');
          }
          localStorage.setItem('timeNum', time);
        } else {
          if (this._isMobile()) {
            this.$router.replace('/loginMove');
          }else {
            this.$router.replace('/');
          }
        }
      } else {
        localStorage.setItem('timeNum', time);
        if (this._isMobile()) {
          this.$router.replace('/loginMove');
        }else {
          this.$router.replace('/');
        }
      }


    }
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;

  }

  html, body {
    width: 100%;
    height: 100%;
    font-size: 62.5%;
    position: relative;
    overflow: hidden;
    padding:0;
    margin:0;
  }
</style>
