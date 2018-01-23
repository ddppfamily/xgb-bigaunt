// set1.js
const Utils = require('../../utils/util.js')

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
   * 修改周期天数
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
  isInputComplete: function (e) {
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
       

    this.setData({
      gapDays: gapDays
    })  

    wx.setStorageSync('base', {
      endDate: endDate,
      continueDays: continueDays,
      gapDays: gapDays,
      period: period
    })
    wx.navigateTo({
      url: '/pages/set2/set2'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
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
    Utils.checkSetting()
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