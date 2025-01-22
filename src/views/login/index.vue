<template>
  <div class="login-container">
    <div class="wrapper">
      <div class="box-card">
        <div class="right-div">
          <div class="logo-image">
            <img src="~@/assets/all_image/logo-pag.png" style="width: 100%; height: 100%">
          </div>

          <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">

            <div class="title-container">
              <h1 class="title">Sistem Sparepart</h1>
            </div>

            <div class="input-container">
              <el-form-item prop="username">
                <span class="svg-container">
                  <svg-icon icon-class="user" />
                </span>
                <el-input
                  ref="username"
                  v-model="loginForm.username"
                  style="width: 85%"
                  placeholder="Username"
                  name="username"
                  type="text"
                  tabindex="1"
                  autocomplete="on"
                />
              </el-form-item>

              <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
                <el-form-item prop="password">
                  <span class="svg-container">
                    <svg-icon icon-class="password" />
                  </span>
                  <el-input
                    :key="passwordType"
                    ref="password"
                    v-model="loginForm.password"
                    :type="passwordType"
                    style="width: 85%"
                    placeholder="Password"
                    name="password"
                    tabindex="2"
                    autocomplete="on"
                    @keyup.native="checkCapslock"
                    @blur="capsTooltip = false"
                    @keyup.enter.native="handleLogin"
                  />
                  <span class="show-pwd" @click="showPwd">
                    <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
                  </span>
                </el-form-item>
              </el-tooltip>
            </div>

            <el-button :loading="loading" type="info" style="width:100%; margin-top: 15px;" @click.native.prevent="handleLogin">LOGIN</el-button>
          </el-form>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import jsCookie from 'js-cookie'

// import { validUsername } from '@/utils/validate'
// import SocialSign from './components/SocialSignin'

export default {
  name: 'Login',
  // components: { SocialSign },
  data() {
    return {
      loginForm: {
        username: '',
        password: '',
        type: ''
      },
      loginRules: {
        username: [{ required: true, message: 'Username harus diisi', trigger: 'blur' }],
        password: [{ required: true, message: 'Password harus diisi', trigger: 'blur' }],
        type: [{ required: true, message: '', trigger: 'change' }]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {},
      dialogForm: false,
      messageLogin: ''
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          console.log(this.redirect)
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    const getSessionAuth = window.localStorage.getItem('auth')
    const sessionAuth = JSON.parse(getSessionAuth)
    const isLoggedOut = jsCookie.get('logout')
    if (sessionAuth != null && sessionAuth !== '' && isLoggedOut !== '1') {
      this.loginForm = sessionAuth
      setTimeout(() => {
        this.handleLogin()
      }, 200)
    }
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    handleFocusType() {
      this.$nextTick(() => {
        const select = this.$refs.type
        select.showPopper = true
      })
    },
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      // STATIC
      // this.$refs.loginForm.validate(valid => {
      //   if (!valid) {
      //     console.log('error submit!!')
      //     return false
      //   }

      //   const roles = {
      //     'superadmin': '1',
      //     'owner': '2',
      //     'pusat': '3',
      //     'salesadmin': '4',
      //     'supervisor': '5',
      //     'cabang': '6'
      //   }
      //   jsCookie.set('roleLogin', roles[this.loginForm.username])
      //   this.$router.go({ path: this.redirect || '/', query: this.otherQuery })
      // })

      // INTEGRATE API
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          // console.log(this.loginForm.type);
          this.$store.dispatch('user/login', this.loginForm)
            .then(() => {
              // console.log(res);
              // console.log('Test o')
              const role = jsCookie.get('levelNum')

              const jumpToRoute = role === '3' ? '/tugas' : ''

              this.$router.go({ path: this.redirect || jumpToRoute, query: this.otherQuery })
              this.loading = false
            })
            .catch((err) => {
              console.error(err)
              this.$alert(err.error, err.message, {
                confirmButtonText: 'OK',
                type: 'error',
                center: true
              })
            }).finally(() => {
              this.loading = false
            })

          window.localStorage.setItem('auth', JSON.stringify(this.loginForm))
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
    // afterQRScan() {
    //   if (e.key === 'x-admin-oauth-code') {
    //     const code = getQueryObject(e.newValue)
    //     const codeMap = {
    //       wechat: 'code',
    //       tencent: 'code'
    //     }
    //     const type = codeMap[this.auth_type]
    //     const codeName = code[type]
    //     if (codeName) {
    //       this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
    //         this.$router.push({ path: this.redirect || '/' })
    //       })
    //     } else {
    //       alert('第三方登录失败')
    //     }
    //   }
    // }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
// $light_gray:#fff;
$light_gray:#dcdfe6;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  // .login-container .el-input input {
  //   // color: $cursor;
  // }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    // width: 85%;

    input {
      background: transparent;
      border: 0px;
      // -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      // color: $light_gray;
      height: 47px;
      // caret-color: $cursor;

      // &:-webkit-autofill {
      //   // box-shadow: 0 0 0px 1000px $bg inset !important;
      //   // -webkit-text-fill-color: $cursor !important;
      // }
    }
  }

  .el-form-item {
    border: 1px solid $light_gray !important;
    // background: rgba(0, 0, 0, 0.1);
    border-radius: 3px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;
$white: #fff;
$gray: #878788;

@font-face {
  font-family: Lato;
  src: url("~@/assets/font/lato-regular.woff") format("woff");
}

.login-container::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2);
}

.login-container {
  min-height: 100%;
  position: relative;
  width: 100%;
  background: url('~@/assets/all_image/login_bg.jpg');
  background-size: cover;
  background-position: center;
  overflow: hidden;
  display: flex;
  justify-content: center;

  .wrapper{
    display: flex;
    align-items: center;
    padding: 0 20px;

    .box-card{
      background-color: $white;
      width: 25rem;
      position: relative;
      z-index: 1;
      // height: auto;
      padding: 10px;
      border-radius: 12px;
      box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
      display: flex;

      .left-div{
        background-color: $gray;
        color: $white;
        text-align: center;
        width: 40%;
        padding: 20px;

        .header{
          h2{
            font-family: Lato;
            padding: 0;
            margin: 5px 0 8px 0;
          }
          p{
            padding: 0;
            margin: 0;
          }
        }

        .body{
          height: 65%;
          display: flex;
          justify-content: center;
          align-items: center;

          .image{
            max-width: 120px;
            max-height: 120px;
          }

          @media screen and (max-width: 840px) {
            .image{
              margin: 20px 0;
            }
          }
        }

        .footer{
          p{
            padding: 0;
            margin: 0 0 10px 0;
            font-weight: bold;
            font-size: 19px;
          }

          .contact{
            display: flex;
            justify-content: center;
            .icon{

              transition: 0.5s;
              margin: 0 7px;
              .item-icon{
                font-size: 38px;
              }

            }
            .icon:hover{
              transform: scale(1.2);
            }
          }
        }

        @media screen and (max-width : 600px){
          .body{
              display: none;
          }
          .footer{
              display: none;
          }
        }

        @media screen and (max-width : 375px){
          .header h2{
              font-size: 18px !important;
          }
          .header p{
              font-size: 15px !important;
          }
        }
      }

      .right-div{
        width: 100%;
        padding: 20px;
        position: relative;

        .logo-image{
          // position: absolute;
          margin: auto;
          width: 6rem;
          // height: 7rem;
          // padding: 5px;
          // border-radius: 50%;
          background: #fff;
        }

        .login-form {
          position: relative;
          max-width: 100%;
          margin: 0 auto;
          padding-top: 15px;
          overflow: hidden;
        }

        .svg-container {
          padding: 6px 5px 6px 15px;
          color: $dark_gray;
          vertical-align: middle;
          width: 30px;
          display: inline-block;
        }

        .title-container {
          position: relative;

          .title {
            // font-size: 26px;
            color: $gray;
            margin: 0px auto 30px auto;
            font-family: Poppins;
            text-align: center;
            font-weight: bold;
            font-size: 22px;
          }

          @media screen and (max-width: 375px) {
            .title {
              font-size: 25px !important;
            }
          }
        }

        .input-container {
          margin: 0 0 20px 0 !important;
        }

        .show-pwd {
          position: absolute;
          right: 10px;
          top: 7px;
          font-size: 16px;
          color: $dark_gray;
          cursor: pointer;
          user-select: none;
        }

        .thirdparty-button {
          position: absolute;
          right: 0;
          bottom: 6px;
        }

        .supported{

          .title-supported{
            font-weight: bold;
            color: $gray;
            text-align: center;
            font-size: 19px;
            font-family: Lato;
            margin: 0 0 18px 0;

            .text{
              padding: 0;
              margin: 0;
            }
          }

          .image-supported{
            display: flex;
            justify-content: center;

            .image1{
              max-width: 200px;
              max-height: 40.19px;
              margin: 0 20px;
            }
            .image2{
              max-width: 80px;
              max-height: 40px;
              margin: 0 20px;
            }
            .image3{
              max-width: 80px;
              max-height: 80px;
              margin: 0 20px;
            }

            @media screen and (max-width: 500px) {
              .image1 {
                max-width: 120px !important;
                max-height: 120px !important;
              }
              .image2 {
                max-width: 30px !important;
                max-height: 30px !important;
              }
              .image3 {
                max-width: 50px !important;
                max-height: 50px !important;
              }
            }

            @media screen and (max-width: 375px) {
              .image1 {
                max-width: 80px !important;
                max-height: 80px !important;
              }
              .image2 {
                max-width: 30px !important;
                max-height: 30px !important;
              }
              .image3 {
                max-width: 50px !important;
                max-height: 50px !important;
              }
            }
          }
        }
      }

      @media screen and (max-width : 840px) {
        .left-div{
          width: 100% !important;
        }
        .right-div{
          width: 100% !important;
        }
    }

    .dialog{
      text-align: center;

        i{
          font-size: 5vw;
          color: #F56C6C;
        }
        h1{
          font-size: 1.8vw;
          padding: 0;
          margin: 8px 0 10px 0;
        }
        p{
          font-size: 1vw;
          margin:0;
          padding:0;
        }

        @media screen and (max-width: 1250px) {
          i{
            font-size: 8vw;
          }
          h1{
            font-size: 2.8vw;
          }
          p{
            font-size: 1.8vw;
          }
        }
    }

      @media only screen and (max-width: 470px) {
        .thirdparty-button {
          display: none;
        }
      }
    }
  }

  @media screen and (max-width : 1000px) {
    .box-card{
      max-width: 800px !important
    }
  }
  @media screen and (max-width : 840px) {
    .box-card{
      max-width: 650px !important;
      display: block;
    }
  }

  @media screen and (max-width : 695px) {
    .box-card{
      max-width: 550px !important
    }
  }

  @media screen and (max-width : 600px) {
    .box-card{
      max-width: 450px !important
    }
  }

  @media screen and (max-width : 500px) {
    .box-card{
      max-width: 350px !important
    }
  }

  @media screen and (max-width : 375px) {
    .box-card{
      max-width: 250px !important
    }
  }
}
</style>
