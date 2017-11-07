// set2.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    regularity:{
      value: 1,
      options: [{
        label: '正常',
        value: 1
      }, {
        label: '偶尔',
        value: 2
        }, {
          label: '不正常',
          value: 3
        }]
    },
    level: {
      value: 1,
      options: [{
        label: '轻',
        value: 1
      }, {
        label: '中',
        value: 2
      }, {
        label: '重',
        value: 3
      }]
    },
    symptom: {
      value: 1,
      options: [{
        label: '没有',
        value: 1
      }, {
        label: '偶尔',
        value: 2
      }, {
        label: '经常',
        value: 3
      }]
    }
  },
  /**
   * 
   */
  handleRegularityTap: function (e) {
    console.log(e)
    var val = e.currentTarget.dataset.value
    this.setData({
      'regularity.value': val
    })
  },
  /**
   * 
   */
  handleLevelTap: function (e) {
    console.log(e)
    var val = e.currentTarget.dataset.value
    this.setData({
      'level.value': val
    })
  },
  /**
   * 
   */
  handleSymptomTap: function (e) {
    console.log(e)
    var val = e.currentTarget.dataset.value
    this.setData({
      'symptom.value': val
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