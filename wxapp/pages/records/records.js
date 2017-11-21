// records.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentDate: '',
    currentYear: '',
    currentMonth: '',
    currentWeek: '',
    displayDate: '',
    displayYear: '',
    displayMonth: '',
    displayWeek: '',
    year_ping: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    year_run: [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    /**
     * [[1,2,3,4,5,6,7]]
     * 数组的数组，子数组代表一行，始终1号开始
     * 由于要判断上一个月和下一个月，本月，所以存对象
     * {
     *   date: '',
     *   monthTag: '' ///-1代表上个月，0代表当前月，1代表下一月
     * }
     */
    dateArr:[]
  },
  /**
   * change ，前后月切换
   */
  change (e) {
     var tag = e.currentTarget.dataset.tag,
       displayYear = this.data.displayYear,
       displayMonth = this.data.displayMonth
     
     if (tag === 'pre') {
       ///上一个月
       displayYear = displayMonth === 1 ? displayYear - 1 : displayYear
       displayMonth = displayMonth === 1 ? 12 : displayMonth - 1
      
     } else {
       ///下一个月
       displayYear = displayMonth === 12 ? displayYear + 1 : displayYear
       displayMonth = displayMonth === 12 ? 1 : displayMonth + 1
      
     }
     this.setData({
       displayYear: displayYear,
       displayMonth: displayMonth
     })
     this.setCalender(displayYear, displayMonth)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var date = this.getCurrentDate(new Date())
    this.setData({
      currentDate: date.date,
      currentYear: date.year,
      currentMonth: date.month,
      currentWeek: date.week,
      displayDate: date.date,
      displayYear: date.year,
      displayMonth: date.month,
      displayWeek: date.week,
    })
    this.setArr()
  },
  /**
   * 某天的日期对象，包含，年，月，日，星期
   */
  getCurrentDate (dateObj) {
    var cDate = dateObj,
        year = cDate.getFullYear(),
        month = cDate.getMonth() + 1,
        date = cDate.getDate(),
        week = cDate.getDay()
    return {
      year: year,
      month: month,
      date: date,
      week: week
    }    
  },
  /**
   * 判断是否是闰年
   */
  isRunYear (year) {
     var rs = false
     if ((year % 400 == 0 || year % 4 ==0 && year % 100 != 0)){
        rs = true
     }
     return rs
  },
  /**
   * 组装日期数组，5行，35个元素
   */
  setArr () {
    this.setCalender(this.data.displayYear, this.data.displayMonth)
   
  },
  /**
   * 日历生成
   * 传入年月日
   */
  setCalender (qyear, qmonth) {
    //判断1号是星期几
    var date1 = new Date(qyear + '-' + qmonth + '-1')
    var year_ping = this.data.year_ping
    var year_run = this.data.year_run
    var week1 = date1.getDay()
    var dateArr = []
    var tempArr = []
    var preYear = qyear - 1
    var preMonth = {}
    var year = year_ping

    if (this.isRunYear(qyear)) {
      year = year_run
    }
    // if (this.isRunYear(this.data.currentYear)) {
    //   year = year_run
    // }
    ///上个月
    preMonth.month = qmonth == 1 ? 12 : qmonth - 1
    preMonth.days = year[preMonth.month - 1]
    var preMonthDaysTemp = preMonth.days

    for (var i = 1; i < 36; i++) {
      if (i > year[qmonth - 1]) {
        tempArr.push({
          monthTag: 1,
          date: ''
        })
      } else {
        tempArr.push({
          monthTag: 0,
          date: i
        })
      }

    }
    ///前面空缺位置补充
    for (var i = 0; i < week1; i++) {
      //  tempArr.unshift(' ')
      tempArr.unshift({
        monthTag: -1,
        date: preMonthDaysTemp
      })
      --preMonthDaysTemp
    }
    tempArr = tempArr.slice(0, 35)
    console.log(tempArr)
    ///分5行
    while (tempArr.length > 0) {
      dateArr.push(tempArr.splice(0, 7))
    }
    console.log(dateArr)

    this.setData({
      dateArr: dateArr
    })
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