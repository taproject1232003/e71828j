function init() {
  const BaaS = window.BaaS

  new Vue({
    el: '#root',
    data: function () {
      return {
        isLogin: false,
        isAnonymousLogin: BaaS.storage.get('is_anonymous_user') == 1,
        loginForm: {
          email: '',
          username: '',
          password: '',
        },
        registerForm: {
          email: '',
          username: '',
          password: '',
        },
        passwordChangeForm: {
          password: '',
          newPassword: ''
        },
        forgetPassword: {
          email: ''
        },
        userInfoForm: {
          email: '',
          username: '',
          password: '',
        },
        modalText: '',
        sms: {
          phone: '',
          code: '',
        }
      }
    },
    methods: {
      login: function () {
        window.BaaS.auth.login(_.pickBy(this.loginForm, function (v) {return !!v})).then(function (res) {
          console.log(res)
          this.isLogin = true
        })
      },
      register: function () {
        window.BaaS.auth.register(_.pickBy(this.registerForm, function (v) {return !!v})).then(function (res) {
          console.log(res)
          this.isLogin = true
        })
      },
      logout: function () {
        window.BaaS.auth.logout().then(function (res) {
          this.isLogin = false
          console.log(res)
        })
      },
      anonymousLogin: function () {
        BaaS.auth.anonymousLogin().then(function (user) {
          this.isAnonymousLogin = true
          console.log('user.toJSON ', user.toJSON())
          console.log('isAnonymousUser ', user.get('isAnonymousUser'))
        })
      },
      currentUser: function () {
        BaaS.auth.getCurrentUser().then(function (res) {
          console.log(res)
        })
      },
      requestPasswordReset: function () {
        BaaS.auth.requestPasswordReset({email: this.forgetPassword.email}).then(function (res) {
          console.log(res)
        })
      },
      updatePassword: function () {
        BaaS.auth.getCurrentUser().then(function (user) {
          user.updatePassword(this.passwordChangeForm).then(function (res) {
            console.log(res)
          })
        })
      },
      updateUserinfo: function () {
        BaaS.auth.getCurrentUser().then(function (user) {
          console.log('user', user.toJSON())
          if (this.userInfoForm.username) {
            user.setUsername({
              username: this.userInfoForm.username,
              password: this.userInfoForm.password,
            }).then(function (res) {
              console.log(res)
            })
          } else if (this.userInfoForm.email) {
            user.setEmail({
              email: this.userInfoForm.email,
              password: this.userInfoForm.password,
            }, {sendVerificationEmail: false}).then(function (res) {
              console.log(res)
            })
          }
        })
      },
      requestEmailVerification: function () {
        BaaS.auth.getCurrentUser().then(function (user) {
          user.requestEmailVerification().then(function (res) {
            console.log(res)
          })
        })

      },
      showModal: function (content) {
        this.modalText = content
        $('#myModal').modal('show')
      },

      helloWorld: function () {
        BaaS.invokeFunction('helloWorld', undefined, false).then(function (res) {
          notie.alert({type: 1, text: JSON.stringify(res.data)})
        }, function (err) {
          notie.alert({type: 3, text: '请求失败'})
          console.log('err', err)
        })
      },

      testRequest: function () {
        BaaS.invokeFunction('testRequest').then(function (res) {
          notie.alert({type: 1, text: JSON.stringify(res.data)})
        }, function (err) {
          console.log('err', err)
          notie.alert({type: 3, text: '请求失败'})
        })
      },
      sendSMSCode: function () {
        BaaS.sendSmsCode({phone: this.sms.phone}).then(function (res) {
          // success
          console.log(res)
        }).catch(function (err) {
          // err
          console.log(err)
        })
      },
      verifyPhone: function () {
        BaaS.verifySmsCode({phone: this.sms.phone, code: this.sms.code}).then(function (res) {
          console.log(res)
        })
      },
      thirdPartyLogin: function () {
        BaaS.auth.loginWithThirdParty('oauth-wechat-mp', '/auth.html', {
          debug: true,
          windowFeatures: 'left=100,top=100,width=800,height=600,menubar=yes,resizable=yes,scrollbars=yes,status=yes',
        })
          .then(function (res) {console.log(res)})
          .catch(function (err) {console.log('err: ', err)})
      },
      thirdPartyLoginIframe: function () {
        BaaS.auth.loginWithThirdParty('oauth-wechat-mp', '/auth.html', {
          iframe: true,
          debug: true,
          authModalStyle: {
            container: {
              background: 'gray',
            },
            iframe: {
              // background: 'red',
            },
            closeButton: {
              // right: '50%',
            }
          },
        })
          .then(function (res) {console.log(res)})
          .catch(function (err) {console.log('err: ', err)})
      },
    },
    computed: {},
    mounted: function () {
      BaaS.auth.getCurrentUser().then(function (res) {
        console.log(res)
        this.isLogin = !!res
      })
    }
  })
}

window.addEventListener('load', init)
