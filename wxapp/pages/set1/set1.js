// set1.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    endDate: '',
    continueDays: '',
    gapDays:'',
    continueDaysArr: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17],
    gapDaysArr:[31,30,29,28,27,26,25,24,23,22,21,20,19,18,17,16,15,14,13,12,11,10,9,8,7,6,5,4,3,2,1],
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
  },
  /**
   * 修改持续天数
   */
  handleContinueDaysChangeTap: function (e) {
    var val = e.detail.value
    this.setData({
      continueDays: this.data.continueDaysArr[val]
    })
  },
  /**
   * 修改间隔天数
   */
  handleGapDaysChangeTap: function (e) {
    var val = e.detail.value
    this.setData({
      gapDays: this.data.gapDaysArr[val]
    })
  },

  /**
   * 检查所有的项目已经填写完整
   * @return true/false
   */
  isInputComplete: function (e) {
    var endDate = this.data.endDate,
        continueDays = this.data.continueDays,
        gapDays = this.data.gapDays

    if (endDate && continueDays && gapDays) {
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
      gapDays = this.data.gapDays
    wx.setStorageSync('base', {
      endDate: endDate,
      continueDays: continueDays,
      gapDays: gapDays
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