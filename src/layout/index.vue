<template>
  <el-container>
    <el-header height="61" class="student-header">
      <div class="head-user">
        <el-dropdown trigger="click" placement="bottom">
          <el-badge :is-dot="messageCount!==0">
            <el-avatar class="el-dropdown-avatar" size="medium"
                       :src="userInfo.imagePath === null ? require('@/assets/avatar.png') : userInfo.imagePath"></el-avatar>
          </el-badge>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="$router.push({path:'/user/index'})">个人中心</el-dropdown-item>
            <!--            <el-dropdown-item @click.native="$router.push({path:'/user/message'})">-->
            <!--              <el-badge :value="messageCount" v-if="messageCount!==0">-->
            <!--                <span>消息中心</span>-->
            <!--              </el-badge>-->
            <!--              <span  v-if="messageCount===0">消息中心</span>-->
            <!--            </el-dropdown-item>-->
            <el-dropdown-item @click.native="logout" divided>退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="random-problem">
        <el-button type="primary" @click="dialogVisible = true">随机一题<i class="el-icon-trophy el-icon--right"></i></el-button>
        <el-dialog
          title="随机一题"
          :visible.sync="dialogVisible"
          width="30%"
          :before-close="handleClose"
        >
          <span v-if="!problemOK && !generating">随机生成一道判断题<br></span>
          <span v-if="generating">生成中，请稍后</span>
          <el-skeleton :rows="3" animated v-if="generating"/>
          <div v-if="problemOK && !generating">题目描述：{{problem}}</div>
          <hr>
          <div v-if="problemOK && !generating">
            <el-radio v-model="radio" label="1" border>正确</el-radio>
            <el-radio v-model="radio" label="2" border>错误</el-radio>
            <el-button type="primary" @click="checkAnswer">提交答案</el-button>
          </div>
          <span slot="footer" class="dialog-footer" v-if="!problemOK">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="randomProblem">确 定</el-button>
          </span>
        </el-dialog>
      </div>
      <div>
        <el-menu class="el-menu-title" mode="horizontal" :default-active="defaultUrl" :router="true">
          <el-menu-item index="/index">首页</el-menu-item>
          <el-menu-item index="/paper/index">试卷中心</el-menu-item>
          <el-menu-item index="/record/index">考试记录</el-menu-item>
          <el-menu-item index="/question/index">错题本</el-menu-item>
        </el-menu>
      </div>
      <div>
        <a href="/"><img src="@/assets/logo.png" height="56"/></a>
      </div>
    </el-header>
    <el-main class="student-main">
      <router-view/>
    </el-main>
    <el-footer height="340" class="student-footer">
      <div class="foot-container">
        <div class="footer-main">
          <h4>更多信息</h4>
          <a href="https://github.com/Jiffies-64/dsa-final-frontend" target="_blank"
             class="footer-main-link">前端仓库</a>
          <a href="https://github.com/Jiffies-64/dsa-final-backend" target="_blank"
             class="footer-main-link">后端仓库</a>
          <a href="https://jhiu583gze.feishu.cn/docx/SDUydmnn8oAmwzxGxx1c2u77npe" target="_blank"
             class="footer-main-link">概要设计文档</a>
        </div>
        <div class="footer-main">
          <h4>参考资料</h4>
          <a href="https://github.com/FudanDISC/DISC-LawLLM" target="_blank" class="footer-main-link">[Github]
            DISC-LawLLM (https://github.com/FudanDISC/DISC-LawLLM)</a>
          <a href="https://github.com/yuelinan/FedJudge" target="_blank" class="footer-main-link">[Github] FedJudge
            (https://github.com/yuelinan/FedJudge)</a>
          <a href="https://github.com/AndrewZhe/lawyer-llama" target="_blank" class="footer-main-link">[Github]
            lawyer-llama (https://github.com/AndrewZhe/lawyer-llama)</a>
        </div>
      </div>
    </el-footer>
    <div class="foot-copyright">
      <span></span>
    </div>
  </el-container>
</template>

<script>
/* eslint-disable */
import { mapMutations, mapState } from 'vuex'
import loginApi from '@/api/login'
import userApi from '@/api/user'
import {io} from "socket.io-client";

export default {
  name: 'Layout',
  data () {
    return {
      defaultUrl: '/index',
      userInfo: {
        imagePath: null
      },
      dialogVisible: false,
      problem: "",
      problemOK: false,
      radio: "",
      answer: true,
      generating: false,
      socket: null,
      connected: false,
      chatMessages: [{ role: 'robot', content: 'Hello! What can I do for U?' }],
    }
  },
  created () {
    let _this = this
    this.defaultUrl = this.routeSelect(this.$route.path)
    // this.getUserMessageInfo()
    userApi.getCurrentUser({ 'user_name': this.studentUserName }).then(re => {
      _this.userInfo = re.response
    })
  },
  watch: {
    $route (to, from) {
      this.defaultUrl = this.routeSelect(to.path)
    }
  },
  methods: {
    routeSelect (path) {
      let topPath = ['/', '/index', '/paper/index', '/record/index', '/question/index']
      if (topPath.indexOf(path)) {
        return path
      }
      return null
    },
    logout () {
      let _this = this
      loginApi.logout().then(function (result) {
        if (result && result.code === 1) {
          _this.clearLogin()
          _this.$router.push({ path: '/login' })
        }
      })
    },
    // ...mapActions('user', ['getUserMessageInfo']),
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.problemOK = false
          done();
        })
        .catch(_ => {});
    },
    randomProblem() {
      this.problemOK = false
      this.chatMessages.push({ role: 'user', content: "请为我生成一个法律相关的判断题，要求题干描述二十字以内，要求生成的题目描述一个空格后，附加正确与否" })
      this.sendMessage()
      this.answer = true
    },
    checkAnswer() {
      if (this.radio === null || this.radio === "") {
        alert("未提交答案！请重新选择")
        return
      }
      if (this.radio === "1" && this.answer) {
        alert("恭喜您，回答正确！")
      } else if (this.radio === "2" && !this.answer) {
        alert("恭喜您，回答正确！")
      } else {
        alert("很遗憾，回答错误")
      }
    },
    sendMessage () {
      this.socket.emit('prompt', { message: this.chatMessages.filter(x => x.role === 'user') })
      this.generating = true
      this.problemOK = false
    },
    handleMessage (msg) {
      if (msg === '<Start>') {
        this.chatMessages.push({ role: 'robot', content: '' })
      } else if (msg === '<End>') {
        let str = this.chatMessages[this.chatMessages.length - 1].content.split("\n")
        this.problem = str[0]
        console.log(str)
        if (str[1].search("正确")) {
          this.answer = true
        } else {
          this.answer = false
        }
        this.generating = false
        this.problemOK = true
      } else if (msg === '<Irpt>') {
        this.chatMessages[this.chatMessages.length - 1].content += '...'
        this.generating = false
      } else {
        this.chatMessages[this.chatMessages.length - 1].content += msg
      }
      console.log(this.chatMessages[this.chatMessages.length - 1].content)
    },
    ...mapMutations('user', ['clearLogin'])
  },
  computed: {
    ...mapState('user', { messageCount: state => state.messageCount }),
    ...mapState('user', ['studentUserName'])
  },
  mounted () {
    // 连接socket
    this.socket = io('http://127.0.0.1:8000/llm', {
      transports: ['websocket'],
    })

    // 监听连接成功的事件
    this.socket.on('connect', () => {
      this.connected = true
      console.log('connected!')
    })

    // 设置监听
    this.socket.on('response', (data) => {
      console.log('received!!')
      this.handleMessage(data.message)
    })

    // // 设置心跳
    // setInterval(() => {
    //   this.socket.connect();
    // }, 5000);
  },
  beforeDestroy () {
    // 在组件销毁前关闭WebSocket连接
    if (this.socket) {
      this.socket.close()
      this.connected = false
    }
    this.socket = null
  },
}
</script>

<style lang="scss" scoped>

</style>
