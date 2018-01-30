//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        // console.log(res);
        //console.log('31.code>>>>' + res.code);
        this.globalData.code = res.code;
        // 获取用户信息
        wx.getSetting({
          success: res => {
            // console.log(res.authSetting['scope.userInfo']);
            if (res.authSetting['scope.userInfo']) {
              // console.log(2);
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            wx.getUserInfo({
              // withCredentials: true,
              success: res => {
                // 可以将 res 发送给后台解码出 unionId
                console.log(res)
                this.globalData.userInfo = res.userInfo
                // console.log('1.encryptedData>>>>' + res.encryptedData );
                // console.log('2.iv>>>>' + res.iv);
                // console.log('3.code>>>>' + res.code);
                // this.globalData.encryptedData = res.encryptedData
                // this.globalData.iv = res.iv
                // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                // 所以此处加入 callback 以防止这种情况
                // if (this.userInfoReadyCallback) {
                //   this.userInfoReadyCallback(res)
                // }
              }
            })
            } /* else {
              wx.openSetting({
                success: function success(res) {
                  // console.log('openSetting success', res.authSetting);
                  console.log('1.encryptedData>>>>' + res.encryptedData);
                  console.log('2.iv>>>>' + res.iv);
                  console.log('3.code>>>>' + res.code);
                  console.log('no auth and success');
                }
              });
              console.log('else 1');
              this.globalData.userInfo = {
                nickName: ''
              }
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback({
                  userInfo: {
                    nickName: ''
                  }
                })
              }
              console.log('else 2');
            } */
          }
        })
      }
    })
    
   
  },
  globalData: {
    userInfo: {
      nickName: ''
    },
    code: '',
    encryptedData: '',
    iv: ''
  }
})