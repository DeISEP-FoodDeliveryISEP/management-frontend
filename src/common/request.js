import axios from 'axios';

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8';

export const $axios = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true,
  timeout: 1000000
});

$axios.interceptors.request.use(config => {
    if (config.method === 'get' && config.params) {
      let url = config.url + '?';
      for (const propName of Object.keys(config.params)) {
        const value = config.params[propName];
        var part = encodeURIComponent(propName) + "=";
        if (value !== null && typeof(value) !== "undefined") {
          if (typeof value === 'object') {
            for (const key of Object.keys(value)) {
              let params = propName + '[' + key + ']';
              var subPart = encodeURIComponent(params) + "=";
              url += subPart + encodeURIComponent(value[key]) + "&";
            }
          } else {
            url += part + encodeURIComponent(value) + "&";
          }
        }
      }
      url = url.slice(0, -1);
      config.params = {};
      config.url = url;
    }
    return config
  }, error => {
      console.log(error)
      Promise.reject(error)
    }
)

$axios.interceptors.response.use(res => {
    console.log('---response interceptor---',res)
      // if code not set, default to success
      const code = res.data.code;
      // retrieve error message
      const msg = res.data.msg
      console.log('---code---',code)
      if (res.data.code === 0 && res.data.msg === 'NOTLOGIN') { // redirect to login page
        console.log('---login!---',code)
        localStorage.removeItem('userInfo')
        return res.data
        // window.top.location.href = '/backend/page/login/login.html'
      } else {
        return res.data
      }
    },
    error => {
      console.log('err' + error)
      let { message } = error;
      if (message == "Network Error") {
        message = "Network Error!";
      }
      else if (message.includes("timeout")) {
        message = "Timeout!";
      }
      else if (message.includes("Request failed with status code")) {
        // message = "System " + message.substr(message.length - 3) + "error";
        message = message;
      }
      
      alert("API error");
      console.log("error", {
        message: message,
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(error)
    }
)
