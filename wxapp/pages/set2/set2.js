// set2.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    regularity:{
      value: '',
      options: [{
        label: '不规律',
        value: 1
      }, {
        label: '偶尔不规律',
        value: 2
        }, {
          label: '非常正常',
          value: 3
        }]
    },
    level: {
      value: '',
      options: [{
        label: '轻度',
        value: 1
      }, {
        label: '中度',
        value: 2
      }, {
        label: '重度',
        value: 3
      }]
    },
    symptom: {
      value: '',
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
    this.setSubmitStatus()
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
    this.setSubmitStatus()
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
    this.setSubmitStatus()
  },
  /**
   * 判断是否可以点击确认按钮
   */
  canTapSubmit: function (e) {
    var regularity = this.data.regularity.value,
      level = this.data.level.value,
      symptom = this.data.symptom.value
    if (regularity && level && symptom) {
       return true
    } else {
       return false
    }
  },
  /**
   * 根据状态设置按钮
   */
  setSubmitStatus: function (e) {
    if (this.canTapSubmit()) {
        this.setData({
          controlSubmit: true
        })
    } else {
        this.setData({
          controlSubmit: false
        })
    }
  },
  /**
   * 确定
   */
  handleSubmitTap () {
    ///异步后台保存配置数据
    var base = wx.getStorageSync('base'),
       endDate= base.endDate,
       continueDays = base.continueDays,
       gapDays = base.gapDays,
       period = base.period,
       nickName = app.globalData.userInfo.nickName
    console.log(nickName)
    ///发送配置
    wx.request({
      url: 'https://h5.xiaoguaibao.com/bigaunt/save',
      data: {
        nickName: nickName,
        dysmenorrhea: this.data.level.value,
        isLaw: this.data.regularity.value,
        menstrualCycle: period,
        menstrualEndDate: endDate,
        menstrualStratDate: '',
        numberOfDays: continueDays,
        otherAbnormal: ''
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        ///跳转
        wx.reLaunch({
          url: '/pages/records/records'
        })
      }
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