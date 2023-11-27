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
      <el-menu class="el-menu-title" mode="horizontal" :default-active="defaultUrl" :router="true">
        <el-menu-item index="/index">首页</el-menu-item>
        <el-menu-item index="/paper/index">试卷中心</el-menu-item>
        <el-menu-item index="/record/index">考试记录</el-menu-item>
        <el-menu-item index="/question/index">错题本</el-menu-item>
      </el-menu>
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
import { mapMutations, mapState } from 'vuex'
import loginApi from '@/api/login'
import userApi from '@/api/user'

export default {
  name: 'Layout',
  data () {
    return {
      defaultUrl: '/index',
      userInfo: {
        imagePath: null
      }
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
    ...mapMutations('user', ['clearLogin'])
  },
  computed: {
    ...mapState('user', { messageCount: state => state.messageCount }),
    ...mapState('user', ['studentUserName'])
  }
}
</script>

<style lang="scss" scoped>

</style>
