import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// import VueSocketIO from 'vue-socket.io'
// import SocketIO from 'socket.io-client'

// import websocket from 'vue-native-websocket';
 
// Vue.use(websocket, '', {
//     connectManually: true, // 手动连接
//     format: 'json', // json格式
//     reconnection: true, // 是否自动重连
//     reconnectionAttempts: 5, // 自动重连次数
//     reconnectionDelay: 2000, // 重连间隔时间
// });
Vue.config.productionTip = false
 
// const SOCKETIO = new VueSocketIO({
//   debug: true, // true开启
//   connection: SocketIO('http://127.0.0.1:5000/llm'), // 里面写socket服务器地址
//   // 使用vuex
//   vuex: {
//     store,
//     // 定义vuex函数的时候，用来区分普通函数还是socket函数。
//     actionPrefix: 'SOCKET_',
//     mutationPrefix: 'SOCKET_'
//   },
//   options: {
//     autoConnect: false, // 关闭自动连接，一般是在用户登录过后才进行手动连接
//   }
// })
 
// Vue.use(SOCKETIO)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
