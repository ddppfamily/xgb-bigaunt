// records.js
const Utils = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentDate: '',
    currentYear: '',
    currentMonth: '',
    currentWeek: '',
    currentYMD: '',
    displayDate: '',
    displayYear: '',
    displayMonth: '',
    displayWeek: '',
    displayYMD: '',
    ////预测
    estimateStartDate: 0,
    estimateEndDate: 0,
    ////手动确定时间
    startDate: 0,
    endDate: 0,
    ////预测的周期数组
    estimateDates: [],
    ////改动日期
    dates: [],
    year_ping: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    year_run: [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    /**
     * 排卵期计算方式
     * 下次月经来潮的第1天算起，
     * 倒数14天或减去14天就是排卵日，
     * 排卵日及其前5天和后4天加在一起称为排卵期(容易受孕期)
     */
    ovulationDate: '',
    easyPregnancyTime: [],///易孕期区间
    /**
     * [[1,2,3,4,5,6,7]]
     * 数组的数组，子数组代表一行，始终1号开始
     * 由于要判断上一个月和下一个月，本月，所以存对象
     * {
     *   ymd: '',///年月日记录
     *   date: '',
     *   status: '',//0代表安全期，1代表开始，2代表进行中，3代表结束，
     *                4代表排卵期，5代表排卵日，6代表安全期
     *   monthTag: '' ///-1代表上个月，0代表当前月，1代表下一月,
     *   selected: true|fasle //点击选中，默认当天选中
     * }
     */
    dateArr:[],
    dateData: [],
    ///手动确定是否来了，或者是结束了
    submitBtn:false,
    ///手动确定模型
    handSubmit: {
      ///确定的开始日期
      submitStartDate: '',
      ///确定的结束日期
      submitEndDate: '',
      startDesc: '开始',
      endDesc: '结束',
      tip: '',
      show: false
    }
    
  },
  /**
   * change ，前后月切换
   */
  change (e) {
     var tag = e.currentTarget.dataset.tag,
       displayYear = this.data.displayYear,
       displayMonth = parseInt(this.data.displayMonth)
     
     if (tag === 'pre') {
       ///上一个月
       displayYear = displayMonth === 1 ? displayYear - 1 : displayYear
       displayMonth = displayMonth === 1 ? 12 : ((displayMonth - 1) >= 10 ? (displayMonth - 1) : '0' + (displayMonth - 1))
       this.setData({
         displayYear: displayYear,
         displayMonth: displayMonth
       })
     } else {
       ///下一个月
       displayYear = displayMonth === 12 ? displayYear + 1 : displayYear
       displayMonth = displayMonth === 12 ? 1 : ((displayMonth + 1) >= 10 ? (displayMonth + 1) : '0' + (displayMonth + 1))
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
    this.initDate()

    ////测试
    this.mock()

    this.compute()

    this.setArr()
    var date = this.data.dateData.join(',')
    // wx.showModal({
    //   title: '提示',
    //   content: date,
    //   success: function (res) {
    //     if (res.confirm) {
    //       console.log('用户点击确定')
    //     } else if (res.cancel) {
    //       console.log('用户点击取消')
    //     }
    //   }
    // })
  },
  /**
   * 初始化显示日期和当前日期
   */
  initDate () {
    var date = this.getCurrentDate(new Date())
    this.setData({
      currentDate: date.date,
      currentYear: date.year,
      currentMonth: date.month,
      currentWeek: date.week,
      currentYMD: date.year + '-' + date.month + '-' + date.date,
      displayYMD: date.year + '-' + date.month + '-' + date.date,
      displayDate: date.date,
      displayYear: date.year,
      displayMonth: date.month,
      displayWeek: date.week
    })
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
   * 组装日期数组
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
    var date1 = new Date(qyear + '-' + qmonth + '-01')///手机上必须是01，要不getDay（）NAN
    var year_ping = this.data.year_ping
    var year_run = this.data.year_run
    var week1 = date1.getDay()
    var dateArr = []
    var dateData = []
    var tempArr = []
    var preYear = qyear - 1
    var preMonth = {}
    var year = year_ping
    var qTempArr = []
    var qmonth = parseInt(qmonth)

    if (this.isRunYear(qyear)) {
      year = year_run
    }
    
    var maxDays = year[qmonth - 1]///当前指定月的天数
    ///本月最后一天周几
    var lastDayObj = new Date(qyear + '-' + qmonth + '-' + maxDays)
    var lastDayWeek = lastDayObj.getDay()
    var nextDays = 6 - lastDayWeek  ///需要填充的天数
    ///上个月
    preMonth.month = qmonth == 1 ? 12 : qmonth - 1
    preMonth.year = qmonth == 1 ? qyear - 1 : qyear
    preMonth.days = year[preMonth.month - 1]
     var preMonthDaysTemp = preMonth.days
    ///先存上一个月
    for (var i = 0, len = week1; i < len; i++) {
      tempArr.push({
        ymd: '',
        monthTag: -1,
        status: 0,
        date: 0,
        selected: false
      })
      dateData.push(preMonth.year + '-' + preMonth.month + '-' + preMonthDaysTemp)
    
    }
    //本月
    for (var i = 1, len = (maxDays + 1); i < len;i++) {
      qTempArr.push({
        ymd: qyear + '-' + (qmonth >= 10 ? qmonth : ('0' + qmonth)) + '-' + (i >= 10 ? i : ('0' + i)),
        monthTag: 0,
        status: 0,
        date: i,
        selected: false
      })
      dateData.push(qyear + '-' + qmonth + '-' + i)
    }
    ///下个月
    for (var i = 0, len = nextDays; i < len;i++) {
      qTempArr.push({
        ymd: '',
        monthTag: 1,
        status: 0,
        date: 0,
        selected: false
      })
      dateData.push(qyear + '-' + (qmonth+1) + '-' + i)
    }
  
    tempArr = tempArr.concat(qTempArr)
    console.log(dateData)
    ///分5或者6行
    while (tempArr.length > 0) {
      dateArr.push(tempArr.splice(0, 7))
    }
    
    console.log(dateArr)

    this.setData({
      dateArr: dateArr,
      dateData: dateData
    })

    this.addStatusCalender(dateArr, {
      startDate: this.data.estimateStartDate,
      dates: this.data.estimateDates
    })
  },
  /**
   * 排卵日,易孕期计算，传入下个月预测开始时间
   */
  getEasyPregnancyTime(endDate) {
    var nextFirstObj = new Date(this.getNextFirst(endDate)),
        ovulationDateObj = '',
        easyPregnancyStartObj = '',
        easyPregnancyEndObj = '',
        easyPregnancyStart = '',
        easyPregnancyEnd = '',
        easyPregnancyTime = []

    ovulationDateObj = new Date(nextFirstObj.getTime() - 14*24*60*60*1000)
    easyPregnancyStartObj = new Date(ovulationDateObj.getTime() - 5*24 * 60 * 60 * 1000)
    easyPregnancyEndObj = new Date(ovulationDateObj.getTime() + 4 * 24 * 60 * 60 * 1000)
   
    easyPregnancyStart = Utils.formatDate(easyPregnancyStartObj, 'yyyy-MM-dd')
    easyPregnancyEnd = Utils.formatDate(easyPregnancyEndObj, 'yyyy-MM-dd')

    easyPregnancyTime = Utils.formatDateArr(easyPregnancyStart, easyPregnancyEnd)

   return {
     ovulationDate: Utils.formatDate(ovulationDateObj,'yyyy-MM-dd'),
     easyPregnancyStart: easyPregnancyStart,
     easyPregnancyEnd: easyPregnancyEnd,
     easyPregnancyTime: easyPregnancyTime
   }
  },
  /**
   * 根据当前指定月份结束日期，获取下一个的月经第一天
   */
  getNextFirst (endDate) {
    var base = wx.getStorageSync('base'),
        gapDays = base.gapDays,
        endDateObj = new Date(endDate),
        nextFirstObj = ''
    nextFirstObj = new Date(endDateObj.getTime() + gapDays*24*60*60*1000)
    return Utils.formatDate(nextFirstObj,'yyyy-MM-dd')
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
        endDateObj = new Date(baseTimestamp + (((this.data.displayYear - year) * 12 + (this.data.displayMonth - month)) * (gapDays + continueDays))* 24 * 60 * 60 * 1000),
        startDate = Utils.formatDate(computeDateObj,'yyyy-MM-dd'),
        endDate = Utils.formatDate(endDateObj,'yyyy-MM-dd'),
        
        ///开始日期，进行期，结束期，组成数组
      
        dateArr = Utils.formatDateArr(startDate, endDate),
        easyPregnancyTime
        
    ///易孕期计算    
    easyPregnancyTime = this.getEasyPregnancyTime(endDate).easyPregnancyTime

       this.setData({
         estimateStartDate: startDate,
         estimateEndDate: endDate,
         estimateDates: dateArr,
         dates: dateArr,
         startDate: startDate,
         endDate: endDate,
         easyPregnancyTime: easyPregnancyTime
       })

  },
  /**
   * 循环日历，把状态加上，开始，持续，结束
   */
  addStatusCalender (arr,opts) {
    var startDate = opts.startDate,
        base = wx.getStorageSync('base'),
        dates = opts.dates,//开始日期，结束日期的区间数组
        displayDate = this.data.displayDate,
        easyPregnancyTime = this.data.easyPregnancyTime
    // wx.showModal({
    //   title: '提示',
    //   content: easyPregnancyTime.join(','),
    //   success: function (res) {
    //     if (res.confirm) {
    //       console.log('用户点击确定')
    //     } else if (res.cancel) {
    //       console.log('用户点击取消')
    //     }
    //   }
    // })
      arr.forEach(function(item){
          item.forEach(function(cell){
            if (cell.ymd == displayDate) {
               cell.selected = true
            }
            ///当前日期属于例假期间
            if (dates.indexOf(cell.ymd) > -1) {
               //第一天
               if (cell.ymd == dates[0]) {
                 cell.status = 1
               } else if (cell.ymd == dates[dates.length - 1]) {
                 //结束日期
                 cell.status = 3
               } else {
                 cell.status = 2
               }
               
            } else if (easyPregnancyTime.indexOf(cell.ymd) > -1) {
              wx.showToast({
                title: cell.ymd,
                icon: 'success',
                duration: 2000
              })
              ///易孕期，排卵期
              cell.status = 4
              ///排卵日

            }else {
              cell.status =0
            }
          })
      })
      this.setData({
        dateArr:arr
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
     var ymd = e.currentTarget.dataset.ymd,
         submitStartDate = this.data.handSubmit.submitStartDate,
         submitEndDate = this.data.handSubmit.submitEndDate,
         tip = ''

     console.log(ymd)

     ////如果是点击的日期就是已经设置过的开始或者结束日期
     ////则需要置为是的状态，选择否，则取消此日期
     if (ymd == submitStartDate || ymd == submitEndDate) {
       this.setData({
         submitBtn: true
       })
     } else {
       this.setData({
         submitBtn: false
       })
     }
     ///出现手动开始或者结束按钮，如果已经有手动日期了，则出现结束日期
     
     if (submitStartDate) {
       ///已经设置了手动开始
       ////如果是点击的日期小于已经设置的开始日期，则还是继续开始日期
       if (Utils.compareDate(submitStartDate,ymd)) {
         tip = this.data.handSubmit.startDesc
       } else {
         tip = this.data.handSubmit.endDesc
       }
     } else {
         tip = this.data.handSubmit.startDesc
     }

     this.setData({
       displayYMD: ymd,
       'handSubmit.tip': tip,
       'handSubmit.show': true
     })
     
  },
  /**
   * 手动点击确定是开始还是结束
   */
  handleHandSubmit (e) {
    var type = e.currentTarget.dataset.type,
        displayYMD = this.data.displayYMD,///点击的日期
        submitStartDate = this.data.handSubmit.submitStartDate,
        submitEndDate = this.data.handSubmit.submitEndDate,
        submitBtn

    submitBtn = type === 'y' ? true : false
    this.setData({
      submitBtn: submitBtn
    })
   
    ////本地记录日期
    if (type === 'y') {
      if (submitStartDate) {
        ////当前小于开始时间
        if (Utils.compareDate(submitStartDate, displayYMD)) {
          
          this.setData({
            'startDate': displayYMD,
            'handSubmit.submitStartDate': displayYMD
          })
          
        } else {
          ///大于开始时间，则认为是结束日期
          this.setData({
            'endDate': displayYMD,
            'handSubmit.submitEndDate': displayYMD
          })

        }
        
      } else {
        
        this.setData({
          'startDate': displayYMD,
          'handSubmit.submitStartDate': displayYMD
        })
        
      }
     
    } else {
      ///回到预测区间
      this.setData({
        'startDate': this.data.estimateStartDate,
        'endDate': this.data.estimateEndDate,
        'handSubmit.submitStartDate': '',
        'handSubmit.submitEndDate': ''
      })
    }
    ///重新计算区间数组
    //var endDate = submitEndDate ? submitEndDate : estimateEndDate
    var dataArr = Utils.formatDateArr(this.data.startDate, this.data.endDate)
    this.setData({
      dates: dataArr
    })
    ////重新刷新日历
    this.addStatusCalender(this.data.dateArr, {
      startDate: this.data.startDate,
      dates: dataArr
    })
    ////异步请求保存日期
    
  },
  /**
   * 
   */
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