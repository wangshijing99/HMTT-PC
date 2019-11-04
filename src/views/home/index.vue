<template>
  <el-container class="container-home">
    <el-aside :width="isOpen?'200px':'64px'">
      <!-- 通过类名的绑定来改变logo图片的切换 -->
      <div class="logo" :class="{smallLogo:!isOpen}"></div>
      <el-menu
        :default-active="$route.path"
        background-color="#002033"
        text-color="#fff"
        active-text-color="#ffd04b"
        style="border-right:none"
        :collapse="!isOpen"
        :collapse-transition="false"
        router
      >
        <el-menu-item index="/">
          <i class="el-icon-s-home"></i>
          <span slot="title">首页</span>
        </el-menu-item>
        <el-menu-item index="/article">
          <i class="el-icon-document"></i>
          <span slot="title">内容管理</span>
        </el-menu-item>
        <el-menu-item index="/images">
          <i class="el-icon-picture"></i>
          <span slot="title">素材管理</span>
        </el-menu-item>
        <el-menu-item index="/publish">
          <i class="el-icon-s-promotion"></i>
          <span slot="title">发布文章</span>
        </el-menu-item>
        <el-menu-item index="/comment">
          <i class="el-icon-chat-dot-round"></i>
          <span slot="title">评论管理</span>
        </el-menu-item>
        <el-menu-item index="/fans">
          <i class="el-icon-present"></i>
          <span slot="title">粉丝管理</span>
        </el-menu-item>
        <el-menu-item index="/setting">
          <i class="el-icon-setting"></i>
          <span slot="title">个人设置</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <img src alt class="el-icon-s-fold icon" @click="toggleMenu" />
        <span class="text">江苏传智播客科技教育有限公司</span>
        <el-dropdown class="dropdown">
          <span class="el-dropdown-link">
            <img class="headIcon" :src="userInfo.photo" alt />
            <span class="userName">{{userInfo.name}}</span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
          <!-- 把事件绑定在 组件解析后的原生dom上 -->
          <!-- 事件修饰符：prevent once stop  native意思是把事件绑定在原生dom上 -->
            <el-dropdown-item icon="el-icon-setting" @click.native="setting">个人设置</el-dropdown-item>
            <el-dropdown-item icon="el-icon-unlock" @click.native="loginout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-main>
        <!-- 二级路由容器 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import local from '@/utils/local'
export default {
  data () {
    return {
      isOpen: true,
      userInfo: {}
    }
  },
  methods: {
    toggleMenu () {
      // 切换左侧导航栏收起与展开
      this.isOpen = !this.isOpen
    },
    setting () {
      this.$router.push('/setting')
    },
    loginout () {
      local.delUser()
      this.$router.push('/login')
    }
  },
  created () {
    // 设置用户信息
    const user = local.getUser()
    this.userInfo.name = user.name
    this.userInfo.photo = user.photo
  }
}
</script>

<style scoped lang='less'>
.container-home {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  .el-aside {
    background: #002033;
    .logo {
      width: 100%;
      height: 60px;
      background: #002244 url(../../assets/logo_admin.png) no-repeat center /
        140px auto;
    }
    .smallLogo {
      background: #002244 url(../../assets/logo_admin_01.png) no-repeat center /
        36px auto;
    }
  }
  .el-header {
    border-bottom: 1px solid #ddd;
    line-height: 60px;
    .icon {
      font-size: 30px;
      vertical-align: middle;
    }
    .text {
      margin-left: 10px;
      vertical-align: middle;
    }
    .dropdown {
      float: right;
      .headIcon {
        width: 30px;
        height: 30px;
        vertical-align: middle;
      }
      .userName {
        font-weight: bold;
        vertical-align: middle;
        margin-left: 5px;
      }
    }
  }
}
</style>
