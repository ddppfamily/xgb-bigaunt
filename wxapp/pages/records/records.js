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
    computeDate: '',
    manualStartDate: '',///手动开始日期
    manualEndDate: '',///手动结束日期
    manualBtn: 'y',  ///n 代表是出现否，y代表是出现是
    year_ping: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    year_run: [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    /**
     * [[1,2,3,4,5,6,7]]
     * 数组的数组，子数组代表一行，始终1号开始
     * 由于要判断上一个月和下一个月，本月，所以存对象
     * {
     *   ymd: '',///年月日记录
     *   date: '',
     *   status: '',//0代表普通，1代表开始，2代表进行中，3代表结束
     *   monthTag: '' ///-1代表上个月，0代表当前月，1代表下一月,
     *   selected: true|fasle //点击选中，默认当天选中
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
       this.setData({
         displayYear: displayYear,
         displayMonth: displayMonth
       })
     } else {
       ///下一个月
       displayYear = displayMonth === 12 ? displayYear + 1 : displayYear
       displayMonth = displayMonth === 12 ? 1 : displayMonth + 1
       this.setData({
         displayYear: displayYear,
         displayMonth: displayMonth
       })
       this.compute()
     }
    
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

    ////测试
    this.mock()

    this.compute()

    this.setArr()
  },
  /**
   * mock数据，测试所用
   */
  mock () {
    var base = {
      continueDays: 7,
      year: 2017,
      month: 10,
      preMonthPause: 21,
      gapDays: 25 
    }
    wx.setStorageSync('base', base)
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
    preMonth.year = qmonth == 1 ? qyear - 1 : qyear
    preMonth.days = year[preMonth.month - 1]
    var preMonthDaysTemp = preMonth.days

    for (var i = 1; i < 36; i++) {
      if (i > year[qmonth - 1]) {
        tempArr.push({
          ymd: '',
          monthTag: 1,
          status:0,
          date: '',
          selected: false
        })
      } else {
        tempArr.push({
          ymd: qyear + '-' + qmonth + '-' + i,
          monthTag: 0,
          status: 0,
          date: i,
          selected: false
        })
      }

    }
    ///前面空缺位置补充
    for (var i = 0; i < week1; i++) {
      //  tempArr.unshift(' ')
      tempArr.unshift({
        ymd: preMonth.year + '-' + preMonth.month + '-' + preMonthDaysTemp,
        monthTag: -1,
        status: 0,
        date: preMonthDaysTemp,
        selected: false
      })
      --preMonthDaysTemp
    }
    tempArr = tempArr.slice(0, 35)
    console.log(tempArr)
    ///分5行
    while (tempArr.length > 0) {
      dateArr.push(tempArr.splice(0, 7))
    }
    
    this.addStatusCalender(dateArr)
    console.log(dateArr)

    this.setData({
      dateArr: dateArr
    })
  },
  /**
   * 根据上个月结束时间和间隔天数，来推算本月开始，结束时间
   * 往前是推算（从本月开始），往后是接口记录数据
   */
  compute () {
    var base = wx.getStorageSync('base'),
        preMonthPause = base.preMonthPause,
        gapDays = base.gapDays,
        continueDays = base.continueDays,
        year = base.year,
        month = base.month,
        diffDays = ((this.data.displayYear - year) * 12 + (this.data.displayMonth - month)) * (gapDays + continueDays) - continueDays,
        baseYMD = year + '-' + month + '-' + preMonthPause,
        baseDate = new Date(baseYMD),
        baseTimestamp = baseDate.getTime(),
        computeDateObj = new Date(baseTimestamp + diffDays*24*60*60*1000),
        computeDate = computeDateObj.getDate()
        //computeYMD = this.data.displayYear + '-' + this.data.displayMonth + '-' + this.data.displayWeek, 
        //computeDate = new Date(computeYMD)

       this.setData({
         computeDate: computeDate
       })

  },
  /**
   * 循环日历，把状态加上，开始，持续，结束
   */
  addStatusCalender (arr) {
    var startDate = this.data.computeDate,
        base = wx.getStorageSync('base'),
        continueDays = base.continueDays,
        displayDate = this.data.displayDate,
        total = continueDays,
        status = ''

      arr.forEach(function(item){
          item.forEach(function(cell){
            if (cell.date == displayDate) {
               cell.selected = true
            }
              if (cell.date == startDate){
                cell.status = 1
                total--
                status = 2
              } else if (status == 2) {
                
                if (total >= 0) {
                  cell.status = total == 0 ? 3 : 2
                  total--
                } else {
                   status = ''
                }
               
              }
              console.log('total ===' + total)
             
          })
      })
  },
  /**
   * 追溯历史，传入年月日
   */
  getHistory () {
     
  },
  /**
   * 点击日期，选中，可以手动开始和结束
   */
  handleDateTap (e) {
     var ymd = e.currentTarget.dataset.ymd
     console.log(ymd)
     ///出现手动开始或者结束按钮，如果已经有手动日期了，则出现结束日期

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