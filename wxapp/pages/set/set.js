// set1.js
const app = getApp();
// console.log('1.code=' + app.globalData.code + '; encryptedData=' + app.globalData.encryptedData + '; iv=' + app.globalData.iv)
Page({

  /**
   * 页面的初始数据
   */
  data: {
    endDate: '',
    continueDays: '',
    gapDays:'',
    period: '',
    continueDaysArr: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17],
    gapDaysArr:[31,30,29,28,27,26,25,24,23,22,21,20,19,18,17,16,15],
    nextVisible: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     this.initData()
     if (this.isInputComplete()) {
       this.handleDisplayNext()
     }
  },
  /**
   * 初始化数据
   */
  initData () {
    var base = wx.getStorageSync('base');
    // var app = getApp();
    // console.log('>>>>>>>' + app.globalData.userInfo)
    this.setData({
      endDate: base.endDate,
      continueDays: base.continueDays,
      period: base.period,
      gapDays: base.gapDays
    })
  },
  /**
   * 修改结束时间
   */
  handleStartDateChangeTap: function (e) {
       var val = e.detail.value
       this.setData({
         endDate: val
       })
       if(this.isInputComplete()){
         this.handleDisplayNext()
       }
  },
  /**
   * 修改持续天数
   */
  handleContinueDaysChangeTap: function (e) {
    var val = e.detail.value
    this.setData({
      continueDays: this.data.continueDaysArr[val]
    })
    if (this.isInputComplete()) {
      this.handleDisplayNext()
    }
  },
  /**
   * 修改间隔天数
   */
  handleGapDaysChangeTap: function (e) {
    var val = e.detail.value
    this.setData({
      period: this.data.gapDaysArr[val]
    })
    if (this.isInputComplete()) {
      this.handleDisplayNext()
    }
  },
  /**
   * 显示可点击的下一步按钮
   */
  handleDisplayNext () {
     this.setData({
       nextVisible: true
     })
  },
  /**
   * 检查所有的项目已经填写完整
   * @return true/false
   */
  isInputComplete: function () {
    var endDate = this.data.endDate,
        continueDays = this.data.continueDays,
        period = this.data.period

    if (endDate && continueDays && period) {
      return true
    } 
    
    return false   
  },
  /**
   * 下一步
   */
  handleNextStep () {
    var endDate = this.data.endDate,
      continueDays = this.data.continueDays,
      period = this.data.period,
      gapDays = this.data.period - continueDays

    //  console.log('enddate:' + endDate + '; continueDays:' + continueDays + '; period:' + period + '; gapDays:' + gapDays);
     
    //  console.log('code=' + app.globalData.code);
    wx.setStorageSync('base', {
      endDate: endDate,
      continueDays: continueDays,
      gapDays: gapDays,
      period: period
    })
    ////peizhi
    // 更新配置
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log(res)
        app.globalData.code = res.code
        // 获取用户信息
        wx.getSetting({
          success: res => {
            //if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            wx.getUserInfo({
              withCredentials: true,
              success: res => {
                // 可以将 res 发送给后台解码出 unionId
                console.log(res);
                app.globalData.userInfo = res.userInfo;
                app.globalData.encryptedData = res.encryptedData;
                app.globalData.iv = res.iv;
                console.log('1.1.code=' + app.globalData.code + '; encryptedData=' + app.globalData.encryptedData + '; iv=' + app.globalData.iv);

                wx.request({
                  url: 'https://h5.xiaoguaibao.com/bigaunt/update',
                  data: {
                    code: app.globalData.code,
                    encryptedData: app.globalData.encryptedData,
                    iv: app.globalData.iv,
                    menstrualCycle: period,
                    menstrualEndDate: endDate,
                    numberOfDays: continueDays
                  },
                  header: {
                    'content-type': 'application/json' // 默认值
                  },
                  success: function (res) {
                    ///跳转
                    wx.reLaunch({
                      url: '/pages/records/records'
                    })
                  },
                  fail: function () {
                    wx.hideLoading()
                  }
                });
              }
            })
          }
        })
      }
    });
    
    /*
    wx.reLaunch({
      url: '/pages/records/records'
    })*/
  },
  

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})