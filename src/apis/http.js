import Axios from 'axios'
import router from '../router'
import qs from 'qs'
import { Message, Loading } from 'element-ui';

//定义loading变量
let loading;

//加载效果
function startLoading() {
  loading = Loading.service({
    lock: true,
    text: '加载数据中……',
    background: 'rgba(0, 0, 0, 0.3)'
  })
}

//加载效果-清除
function endLoading() {
  loading.close()
}

//那么 showFullScreenLoading() tryHideFullScreenLoading() 要干的事儿就是将同一时刻的请求合并。
//声明一个变量 needLoadingRequestCount，每次调用showFullScreenLoading方法 needLoadingRequestCount + 1。
//调用tryHideFullScreenLoading()方法，needLoadingRequestCount - 1。needLoadingRequestCount为 0 时，结束 loading。
let needLoadingRequestCount = 0
export function showFullScreenLoading() {
  if (needLoadingRequestCount === 0) {
    startLoading()
  }
  needLoadingRequestCount++
}

export function tryHideFullScreenLoading() {
  if (needLoadingRequestCount <= 0) return
  needLoadingRequestCount--
  if (needLoadingRequestCount === 0) {
    endLoading()
  }
}

Axios.defaults.timeout = 1000*60*5
Axios.defaults.baseURL = ''

//http request 拦截器
Axios.interceptors.request.use(
  config => {
    if (config.method === 'post') { //支持2种方法，默认使用Form Data
      if (config.data.useRequestBody) {
        //参数需要带上useRequestBody
        //如果useRequestBody=true, 支持Request Payload，
        //SpringMVC Controller 中需要使用@RequestBody
        delete config.data.useRequestBody;
        config.headers = {
          'Content-Type': 'application/json;charset=UTF-8',
          'Authorization': `${localStorage.token}`
        }
      } else {
        //如果useRequestBody=false, 默认支持Form Data
        //SpringMVC Controller 中不需要使用@RequestBody，默认使用@RequestParam
        config.data = qs.stringify(config.data);
        config.headers = {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          'Authorization': `${localStorage.token}`
        }
      }
    } else if (config.method === 'get') {
      let newParams = {}
      for (let key in config.params) {
        // newParams[key] = encodeURIComponent(config.params[key])
        newParams[key] = config.params[key]
      }
      config.params = newParams
      config.headers = {
        'Content-Type': 'application/json;charset=UTF-8',
        'Authorization': `${localStorage.token}`
      }
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

//http response 拦截器
Axios.interceptors.response.use(
  response => {
    let data = response.data
    //隐藏等待框
    tryHideFullScreenLoading()
    if (data.code === 0) {
      return Promise.resolve(data)
    } else if(data.code === 401) {
      let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
      if(flag) {
        router.push({name: 'loginMove'})
      } else {
        router.push({name: 'login'})
      }
    } else  {
      return Promise.reject(data)
    }
  },
  error => {
    return Promise.reject(error)
  }
)

/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */
const get = function get(url, params = {}) {
  return new Promise((resolve, reject) => {
    params.showLoading && showFullScreenLoading() //显示等待框
    let paramsData = params;
    delete(paramsData['showLoading']);
    Axios.get('/api' + url, {
      params: paramsData
    })
      .then(response => {
        params.showLoading && tryHideFullScreenLoading() //隐藏等待框
        resolve(response);
      })
      .catch(err => {
        params.showLoading && tryHideFullScreenLoading() //隐藏等待框
        reject(err)
      })
  })
}

/**
 * 封装post请求
 * @param url
 * @param params
 * @returns {Promise}
 */
const post = function post(url, params = {}) {
  return new Promise((resolve, reject) => {
    params.showLoading && showFullScreenLoading() //显示等待框
    let paramsData = params;
    delete(paramsData['showLoading']);
    Axios.post('/api' + url, paramsData)
      .then(response => {
        params.showLoading && tryHideFullScreenLoading() //隐藏等待框
        resolve(response);
      }, err => {
        params.showLoading && tryHideFullScreenLoading() //隐藏等待框
        reject(err)
      })
  })
}

/**
 * 封装patch请求
 * @param url
 * @param data
 * @returns {Promise}
 */
const patch = function patch(url, data = {}) {
  return new Promise((resolve, reject) => {
    Axios.patch('/api' + url, data)
      .then(response => {
        resolve(response);
      }, err => {
        reject(err)
      })
  })
}

/**
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
 */
const put = function put(url, data = {}) {
  return new Promise((resolve, reject) => {
    Axios.put('/api' + url, data)
      .then(response => {
        resolve(response);
      }, err => {
        reject(err)
      })
  })
}

export default {
  post,
  get,
  patch,
  put
}
