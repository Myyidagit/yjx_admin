<template>
  <el-row class="login_bg">
    <el-col :xs="{span: 20,offset: 2}" :sm="{span: 7,offset: 15}" :md="{span: 6,offset: 16}" :lg="{span: 5,offset: 17}">
      <el-row class="login-container">
        <el-col class="title">
          <h3><i class="fa fa-arrow-circle-o-right fa-lg"></i>登录系统</h3>
        </el-col>
        <el-col class="login_form">
          <el-form :model="login_form" :rules="rules" ref="verify">
            <el-form-item prop="account" required>
              <el-input v-model="login_form.account" placeholder="请输入登录账户">
                <template slot="prepend"><i class="fa fa-user-circle-o fa-lg"></i></template>
              </el-input>
            </el-form-item>
            <el-form-item prop="password" required>
              <el-input v-model="login_form.password" type="password" placeholder="请输入登录密码">
                <template slot="prepend"><i class="fa fa-key fa-fw fa-lg"></i></template>
              </el-input>
            </el-form-item>
            <el-checkbox v-model="checked" checked>记住密码</el-checkbox>
            <el-form-item>
              <el-button type="primary" size="medium" style="width: 100%;" @click="submit_login">登录</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
  import { login } from '../api/api'

  export default {
    name: 'Login',
    data () {
      return {
        checked: true,
        login_form: {
          account: '',
          password: ''
        },
        rules: {
          account: [
            {required: true, message: '请输入账号', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      // 判断是否需要记住账户密码，如果选择记住，则存储账户密码，否则清除以往的账户密码
      rememberPassword () {
        if (this.checked) { // 记住密码
          localStorage.setItem('account', this.login_form.account)
          localStorage.setItem('password', this.login_form.password)
        } else { // 不记住密码
          localStorage.removeItem('account')
          localStorage.removeItem('password')
        }
      },
      // 错误提示
      open_error (message) {
        this.$notify.error({
          title: '错误提示',
          message: message,
          duration: 2000
        })
      },
      // 提交登录数据
      submit_login () {
        this.$refs.verify.validate((valid) => {
          if (valid) { // 通过验证，提交表单
            var params = new URLSearchParams()
            params.append('account', this.login_form.account)
            params.append('password', this.login_form.password)
            login(params).then(data => {
              if (data.status) {
                console.log(data)
                window.sessionStorage.setItem('admin', JSON.stringify(data.data))
                console.log(window.sessionStorage.getItem("admin"))
                this.$router.push({path: '/'})
              } else {
                this.open_error(data.msg)
              }
            })
            // 记住密码
            this.rememberPassword()
          } else { // 未通过验证，不提交表单
            return false
          }
        })
      }
    },
    mounted () {
      this.login_form.account = localStorage.getItem('account')
      this.login_form.password = localStorage.getItem('password')
    }
  }
</script>

<style>
  .login_bg {
    width: 100%;
    height: 100%;
    background-image: url("../assets/images/login_bg.jpg");
    background-size: 100% 100%;
  }

  .login-container {
    margin: 60% auto;
    border-radius: 5px;
    background-color: #fff;
  }

  .title {
    background-color: #FDFDFD;
    padding-left: 10px;
    margin-bottom: 20px;
    border-top-right-radius: 5px;
    border-top-left-radius: 5px;
    border-bottom: 1px solid #DDDDDD;
  }

  .title i {
    margin-right: 5px;
  }

  .login_form {
    padding-left: 15px;
    padding-right: 15px;
  }
</style>
