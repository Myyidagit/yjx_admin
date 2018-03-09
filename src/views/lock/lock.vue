<template>
  <div id="lock">
    <div :class="outer">
      <div class="outerb">
        <div :class="pulse" @mouseenter="enterOrLeave(1)" @mouseleave="enterOrLeave(2)">
          <transition name="fade" mode='out-in'>
            <div class="lock_wenzi" v-show="pawd_show" @click="show_pasinput()">
              解锁
            </div>
          </transition>
        </div>
      </div>
      <div class="yisuo" v-show="suop">
        已锁定
      </div>
      <div :class="pass_input">
        <input type="text" placeholder="请输入密码" v-model="password" @keyup.13="keyup()">
        <span @click="backFward()"></span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'lock',
    data () {
      return {
        password: '', // 输入框输入的密码
        url: this.$store.state.url, // vuex中拿到的锁屏之前的url
        pawd_show: false,
        suop: true,
        pulse: 'lock_logo animated', // 添加圆圈放大动画
        outer: 'outer animated',  // 给最外层添加左移动画
        pass_input: 'password_input animated' // 给输入框添加又移动画
      }
    },
    methods: {
      // 解锁事件
      backFward () {
        if (this.password === localStorage.getItem('password')) {
          this.$store.commit('CHANGE_STATUS', true)
          location.href = this.url
        } else {
          this.open()
          this.pawd_show = false
          this.pawd_input = true
        }
      },
      open () {
        this.$notify.error({
          title: '错误',
          message: '输入的密码有误'
        })
      },
      // 鼠标放上和离开事件
      enterOrLeave (val) {
        if (val === 1) {
          this.pulse = this.pulse + ' pulse'
          this.pawd_show = true
        } else {
          this.pulse = this.pulse.split(' pulse').join('')
          this.pawd_show = false
        }
      },
      // 鼠标点击密码输入框弹出事件
      show_pasinput () {
        if (this.suop) {
          this.outer = this.outer + ' rubberBand car'
          setTimeout(() => {
            this.pass_input = this.pass_input + ' rubberBand pass_car'
          }, 500)
        }
        this.suop = false
      },
      // 键盘回车事件
      keyup () {
        this.backFward()
      }
    },
    created () {
      window.addEventListener('popstate', function () {
        history.pushState(null, null, document.URL)
      })
    }
  }
</script>

<style lang="scss">
  .fade-enter-active,
  .fade-leave-active {
    transition: all .2s ease;
  }

  .fade-enter,
  .fade-leave-active {
    opacity: 0;
  }

  #lock {
    width: 100%;
    height: 100%;
    position: relative;
    // background: #409EFF;
    background: #667aa6;
    overflow: hidden;
  }

  .car {
    animation-name: drive;
    animation-duration: 1s;
  }

  @keyframes drive {
    from {
      transform: translate(0);
    }
    to {
      transform: translate(-200px);
    }
  }

  .outer {
    width: 300px;
    height: 80px;
    line-height: 80px;
    margin: 20% auto;
    position: relative;
    // overflow: hidden;
    .outerb {
      width: 300px;
      height: 80px;
      z-index: 51;
      background: #667aa6;
      position: relative;
      left: -150px;
      z-index: 51;
      border-radius: 40px;
      .lock_logo {
        width: 80px;
        height: 80px;
        line-height: 80px;
        text-align: center;
        border-radius: 50%;
        border: 3px solid #667aa6;
        position: absolute;
        right: 0;
        top: 0;
        z-index: 51;
        background: url(../../assets/images/user.png) no-repeat;
        background-size: 100% 100%;
        .lock_wenzi {
          color: #fff;
          background: url(../../assets/images/suo.png) center center no-repeat;
          background-size: 20px;
          background-color: rgba(0, 0, 0, 0.5);
          border-radius: 50%;
          font-size: 0;
        }
      }
    }
    .yisuo {
      text-align: center;
      width: 216px;
      color: #fff;
    }

    .pass_car {
      animation-name: pass_drive;
      animation-duration: 1s;
    }

    @keyframes pass_drive {
      from {
        transform: translate(0);
      }
      to {
        transform: translate(260px);
      }
    }

    .password_input {
      position: absolute;
      left: -140px;
      top: 0;
      z-index: 49;
      input {
        width: 240px;
        height: 40px;
        border: none;
        outline: none;
        text-indent: 45px;
        background-color: #fff;
        border-radius: 20px;
      }
      span {
        display: inline-block;
        width: 60px;
        height: 40px;
        position: absolute;
        right: 1px;
        top: 21px;
        background: url(../../assets/images/yao.png) center center no-repeat;
        background-size: 20px;
        background-color: #409EFF;
        border-radius: 0 20px 20px 0;
      }
      span:hover {
        background-color: #88c2fd;
      }
    }
  }

</style>
