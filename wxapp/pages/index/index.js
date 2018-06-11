//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    year: '',
    month: '',
    date: ''
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  //进入配置1
  handleGoSet1: function () {
      wx.navigateTo({
        url: '../set1/set1',
      })
  },
  //
  handleGoSet2: function () {
      wx.navigateTo({
        url: '../set2/set2',
      })
  },
  onLoad: function () {
    //this.isSetInitData()
    ////新流程，直接到日历去
    wx.redirectTo({
      url: '/pages/records/records'
    })
    let date = this.getDate()
    this.setData({
      year: date.year,
      month: date.month,
      date: date.day
    })
    /**
     * v0.02 新增底部tab，默认展现当天的姨妈概况
     */
    // if (app.globalData.userInfo) {
    //   this.setData({
    //     userInfo: app.globalData.userInfo,
    //     hasUserInfo: true
    //   })
    //   this.isSetInitData()
    // } else if (this.data.canIUse){
    //   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //   // 所以此处加入 callback 以防止这种情况
    //   app.userInfoReadyCallback = res => {
    //     this.setData({
    //       userInfo: res.userInfo,
    //       hasUserInfo: true
    //     })
    //     this.isSetInitData()
    //   }
    // } else {
    //   // 在没有 open-type=getUserInfo 版本的兼容处理
    //   wx.getUserInfo({
    //     success: res => {
    //       app.globalData.userInfo = res.userInfo
    //       this.setData({
    //         userInfo: res.userInfo,
    //         hasUserInfo: true
    //       })
    //       this.isSetInitData()
    //     }
    //   })
    // }
  },
  /**
   * 当天日期
   */
  getDate () {
    let d = new Date()
    let year = d.getFullYear()
    let month = d.getMonth() + 1
    let day = d.getDate()
    return {
      year,
      month,
      day
    }
  },
  /**
   * 判断是否已经设置了初始化数据
   */
  isSetInitData() {
    var initData = wx.getStorageSync('base')
    if (initData && initData.endDate) {
      wx.redirectTo({
        url: '/pages/records/records'
      })
      
    } else {
      wx.redirectTo({
        url: '/pages/set1/set1'
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
