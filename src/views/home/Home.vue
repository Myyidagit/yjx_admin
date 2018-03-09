<template>
  <el-container>
    <!-- 左侧导航栏 -->
      <el-menu :collapse="collapse" :unique-opened="true" class="el-menu-vertical-demo" background-color="#495060"
               text-color="#ffffff" active-text-color="#ffd04b" @select="addTab" router>
        <el-submenu v-for="(item, index) in menu" :index="index+''">
          <template slot="title">
            <i :class="item.icon"></i>
            <span slot="title">{{item.name}}</span>
          </template>
          <el-menu-item v-for="(child, indexTwo) in item.child" :index="indexTwo+''" :route="{path: child.link}">
            <i :class="child.icon"></i>
            <span slot="title">{{child.name}}</span>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    <el-container>
      <!-- 顶部导航 -->
      <el-header>
        <i class="fa fa-th-list fa-lg" @click="collapse_operation"></i>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>活动管理</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="right_nav">
          <el-tooltip v-if="!screen" class="item" effect="dark" content="全屏" placement="bottom">
            <i class="fa fa-arrows-alt fa-lg" @click="requestFullScreen"></i>
          </el-tooltip>
          <el-tooltip v-else class="item" effect="dark" content="退出全屏" placement="bottom">
            <i class="fa fa-arrows-alt fa-lg" @click="exitFullscreen"></i>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="锁屏" placement="bottom" @click.native="lock()">
            <i is-dot class="fa fa-lock fa-lg"></i>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="通知消息" placement="bottom">
            <el-badge is-dot class="fa fa-bell fa-lg"></el-badge>
          </el-tooltip>
          <!-- <i class="fa fa-bell fa-lg"></i> -->
          <!-- 导航右侧下拉菜单 -->
          <el-dropdown>
            <span class="el-dropdown-link">
              下拉菜单<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>个人中心</el-dropdown-item>
              <el-dropdown-item>退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <img src="../../assets/images/login_bg.jpg" alt="">
          </div>
      </el-header>
      <!-- 正文 -->
      <el-main>
        <el-tabs v-model="tabs_number" type="border-card" @tab-remove="removeTab" @tab-click="onTabClick" editable>
          <el-tab-pane v-for="(item, index) in tabs" :key="item.name" :label="item.title" :name="item.name"
                       :closable="item.closable">
            <router-view></router-view>
          </el-tab-pane>
        </el-tabs>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  import { getMenu } from '../../api/api'

  export default {
    name: 'Home',
    data () {
      return {
        collapse: false, // 菜单状态 false-展开，true-收起
        screen: false, // 全屏状态 false-不是全屏，true-全屏
        menu: [],
        tabs_number: '9999', // 当前选中tab的name
        tabs: [
          {
            title: '首页',
            name: '9999',
            closable: false
          }
        ]
        // tabs: this.$store.state.numeList
      }
    },
    methods: {
      // 折叠展开菜单
      collapse_operation () {
        // 修改菜单当前状态
        this.collapse = !this.collapse
      },
      // 进入全屏模式
      requestFullScreen () {
        var de = document.documentElement
        if (de.requestFullscreen) {
          de.requestFullscreen()
        } else if (de.mozRequestFullScreen) {
          de.mozRequestFullScreen()
        } else if (de.webkitRequestFullScreen) {
          de.webkitRequestFullScreen()
        }
        this.screen = true
      },
      // 退出全屏模式
      exitFullscreen () {
        var de = document
        if (de.exitFullscreen) {
          de.exitFullscreen()
        } else if (de.mozCancelFullScreen) {
          de.mozCancelFullScreen()
        } else if (de.webkitCancelFullScreen) {
          de.webkitCancelFullScreen()
        }
        this.screen = false
      },
      // 添加tab
      addTab (index, indexPath) {
        let menuGrupIndex = indexPath[0] // 获取到一级目录的下标
        let menuIndex = indexPath[1] // 获取到一级目录下的二级目录下标
        let tabIndex = menuGrupIndex + '-' + menuIndex // 计算tabs的name
        let isAdd = true // 是否添加新的标签  true-添加，false-已存在，不添加切换到该tabs
        // 判断tabs是否已存在
        for (let num = 0; num < this.tabs.length; num++) {
          if (this.tabs[num].name === tabIndex) {
            isAdd = false
          }
        }
        // 添加新tab
        if (isAdd) {
          let menuInfo = this.menu[menuGrupIndex].child[menuIndex]
          this.tabs.push({
            title: menuInfo.name,
            name: tabIndex,
            closable: true
          })
        // const tabsList = {
        //   title: menuInfo.name,
        //   name: tabIndex,
        //   closable: true,
        //   link: menuInfo.link
        // }
        // this.$store.commit('CHANGE_MENUlIST', tabsList)
        }
        // 切换到当前tabs
        this.tabs_number = tabIndex
      },
      // 删除tab
      removeTab (targetName) {
        let tabs = this.tabs
        let activeName = this.tabs_number
        if (activeName === targetName) {
          this.$store.commit('REMOVE_MENUlIST', targetName)
          tabs.forEach((tab, index) => {
            console.log(tab)
            if (tab.name === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1]
              if (nextTab) {
                activeName = nextTab.name
              }
            }
          })
        }
        this.tabs_number = activeName
        this.tabs = tabs.filter(tab => tab.name !== targetName)
        // 切换页面内容
        this.switchTab(activeName)
      },
      // tab点击事件
      onTabClick (index) {
        this.switchTab(index.name)
      },
      // 切换tab内容
      switchTab (tabName) {
        if (tabName === '9999') { // 首页直接跳转
          this.$router.push({ path: '/' })
        } else {
          let menuGrupIndex = tabName.split('-')[0] // 获取到一级目录的下标
          let menuIndex = tabName.split('-')[1] // 获取到一级目录下的二级目录下标
          let menuInfo = this.menu[menuGrupIndex].child[menuIndex]
          this.$router.push({ path: menuInfo.link })
        }
      },
      lock () {
        // 锁屏时将url保存到vuex
        this.$store.commit('CHANGE_URL', location.href)
        this.$router.push({
          name: 'lock'
        })
      },
      open (msg) {
        this.$notify({
          title: '警告',
          message: msg,
          type: 'warning'
        })
      },
      brash () {
        this.$router.push({
          name: 'BaseIndex'
        })
      }
    },
    created () {
      // 当页面刷新的时候回到首页
      window.onunload = this.brash()
    },
    mounted () {
      // 获取到目录
      getMenu(null).then(data => {
        if (data.code === 9001) {
          this.open('登录超时请重新登陆')
          this.$router.push({
            name: 'Login'
          })
        } else {
          this.menu = data.data
        }
      })
    }
  }
</script>

<style lang="scss">
  body .el-container {
    // 左侧目录
    height: 100%;
    .el-menu-vertical-demo:not(.el-menu--collapse) {
      width: 200px;
      // min-height: 400px;
      .el-menu {
        border: none;
        .el-menu-item {
          background-color: #303A54 !important;
        }
      }
    }
    // 顶部导航栏
    .el-header {
      background-color: #D8DCE5;
      line-height: 60px;
      // 修改头部导航面包屑样式
      .el-breadcrumb {
        height: 12px;
        font-size: 14px;
        line-height: 1em;
        display: inline-block;
        margin-left: 15px;
      }
      .right_nav{
        display: inline-block;
        float: right;
        i{
          font-size: 20px;
          margin-right: 20px;
        }
        img{
          width: 40px;
          height: 40px;
          border-radius: 50%;
          vertical-align: middle;
        }
        .el-badge{
          margin-right: 40px;
        }
        .el-row{
          display: inline-block;
          height: 15px;
          line-height: 15px;
        }
      }


    }
    // 正文背景颜色
    .el-main {
      padding: 0;
      .el-tabs--border-card>.el-tabs__content{
        background: #f1f4f5;
      }
    }
  }
</style>
