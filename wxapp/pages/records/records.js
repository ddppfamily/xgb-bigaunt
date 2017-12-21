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
    currentStatus: '',
    displayDate: '',
    displayYear: '',
    displayMonth: '',
    displayWeek: '',
    displayYMD: '',
    clickYMD: '',
    ////预测
    estimateStartDate: 0,
    estimateEndDate: 0,
    ////手动确定时间
    startDate: 0,
    endDate: 0,
    ////预测的周期数组
    estimateDates: [],
    ////区间日期
    dates: [],
    year_ping: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    year_run: [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    /**
     * 排期计算方式
     * 下次的第1天算起，
     * 倒数14天或减去14天就是排卵日，
     * 排日及其前5天和后4天加在一起称为排期
     */
    ovulationDate: '',
    easyPregnancyTime: [],///易期区间
    /**
     * [[1,2,3,4,5,6,7]]
     * 数组的数组，子数组代表一行，始终1号开始
     * 由于要判断上一个月和下一个月，本月，所以存对象
     * {
     *   ymd: '',///年月日记录
     *   date: '',
     *   status: '',//0代表安全，1代表开始，2代表进行中，3代表结束，
     *                4代表排期，5代表排日
     *   monthTag: '' ///-1代表上个月，0代表当前月，1代表下一月,
     *   selected: true|fasle //点击选中，默认当天选中
     * }
     */
    dateArr:[],
    dateData: [],
    ////每个时期状态解释
    statusMap : {
      '0': {
        'desc': '可以放心爱爱哦',
        'name': '推算当日是安全期'
      },
      '1': {
        'desc': '准备好带翅膀的巾巾，多注意保暖哦',
        'name': '推算当日是月经开始'
      },
      '2': {
        'desc': '不要生冷辛辣，多休息哦',
        'name': '推算当日是月经期'
      },
      '3': {
        'desc': '终于熬过了几天痛苦的日子',
        'name': '推算当日是月经结束'
      },
      '4': {
        'desc': '造人关键时机',
        'name': '推算当日是排卵期'
      },
      '5': {
        'desc': '造人关键时机',
        'name': '推算当日是排卵日'
      }
    },
    ////点击每个日期，出现下方的文本提示
    currentDateTip: {
      name: '',
      desc: ''
    },
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
    },
    tipVisible: false,
    ///第几次
    index: 1
    
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
       
       var index = this.data.index - 1
       this.compute(index)
     } else {
       ///下一个月
       displayYear = displayMonth === 12 ? displayYear + 1 : displayYear
       displayMonth = displayMonth === 12 ? '01' : ((displayMonth + 1) >= 10 ? (displayMonth + 1) : '0' + (displayMonth + 1))
       this.setData({
         displayYear: displayYear,
         displayMonth: displayMonth
       })
       var index = this.data.index + 1
       this.compute(index)
     }
     this.setData({
       index: index
     })
     this.setCalender(displayYear, displayMonth)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initDate()

    ////测试
    this.mock()

    this.compute(1)

    this.setArr()

    this.initDateTip()
   // var date = this.data.dateData.join(',')
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
   * 初始化选中提示
   */
  initDateTip () {
    var ymd = this.data.currentDate,
      status = this.data.currentStatus,
      statusMap = this.data.statusMap,
      name = statusMap[status].name,
      desc = statusMap[status].desc,
      dateArr = this.data.dateArr
     this.setData({
       tipVisible: true,
       currentDateTip: {
         name: name,
         desc: desc
       }
     })
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
      gapDays: 25,
      endDate: '2017-11-01',
      year: 2017,
      month: 11,
      preMonthPause: 1
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
   // var dateData = []
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
      //dateData.push(preMonth.year + '-' + preMonth.month + '-' + preMonthDaysTemp)
    
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
      //dateData.push(qyear + '-' + qmonth + '-' + i)
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
     // dateData.push(qyear + '-' + (qmonth+1) + '-' + i)
    }
  
    tempArr = tempArr.concat(qTempArr)
    
    ///分5或者6行
    while (tempArr.length > 0) {
      dateArr.push(tempArr.splice(0, 7))
    }
    
    console.log(dateArr)

    this.setData({
      dateArr: dateArr
    })

    this.addStatusCalender(dateArr)
  },
  /**
   * 排日,易期计算，传入下个月预测开始时间
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
   * 根据当前指定月份结束日期，获取下一个的第一天
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
   * 传入上次基本信息，预测下一次信息
   * 应该和当前月份无关，只有次数
   * 默认把基本参考时间作为第0次
   */
  computeNext (base,index) {
        var baseEndDate = base.endDate,
          gapDays = base.gapDays,
          baseEndDateObj = new Date(baseEndDate),
          continueDays = base.continueDays,
          endDateTimestamp = baseEndDateObj.getTime() + (gapDays + continueDays) * 24 * 60 * 60 * 1000 * index,
          startDateTimestamp = endDateTimestamp - continueDays * 24 * 60 * 60 * 1000,
          endDateObj = new Date(endDateTimestamp),
          startDateObj = new Date(startDateTimestamp)

        return {
          startDate: Utils.formatDate(startDateObj, 'yyyy-MM-dd'),
          endDate: Utils.formatDate(endDateObj, 'yyyy-MM-dd')
        }

  },
  
  /**
   * 根据上次结束时间和间隔天数，来推算本次开始，结束时间，可能一个月出现两次
   * 往前是push数据，根据当前月，来保留或删除之前的数据
   * 是推算
   */
  compute (index) {
    var base = wx.getStorageSync('base'),
        dates = this.data.dates || [],
        currentMonth = this.data.displayMonth,
        currentYear = this.data.displayYear,
        newDates = [],
        computeDate,
        index = 1
      
    ///根据上次参考时间，推算第一次出现时间
    var computeDate1 = this.computeNext(base, index)
    ///计算第一次持续时间区间
    var computeDateRange1 = Utils.formatDateArr(computeDate1.startDate, computeDate1.endDate)
    ///根据上次参考时间，继续推算下一次时间
    var computeDate2 = this.computeNext(base, (index+1))
    ///计算下一次持续时间区间
    var computeDateRange2 = Utils.formatDateArr(computeDate2.startDate, computeDate2.endDate)

    do{
      computeDate = this.computeNext(base, index)
      index += 1
    } while (Utils.isTheNext(computeDate.endDate, ))
    console.log(computeDateRange1)
    console.log(computeDateRange2)
    ///根据当前月，来保留或删除之前的历史数据
    var  displayMonth = this.data.displayMonth
    if (dates.length > 0) {
      dates.forEach((item) => {
        if (this.hasSameMonth(currentMonth, item)) {
          newDates.push(item)
        }
      })
    }
    ///判断预测的区间，是否在当前月中，如果在当前月中，则加到newDates数组中
    if (this.hasSameMonth(currentMonth, computeDateRange1)) {
      newDates.push(computeDateRange1)
    }
    if (this.hasSameMonth(currentMonth, computeDateRange2)) {
      newDates.push(computeDateRange2)
    }
  
    var  easyPregnancyTime = []

    ///易期计算,也是数组
    //循环新日期区间数组
    newDates.forEach((dates) => {
      var maxIndex = dates.length,
          endDate = dates[maxIndex - 1]
      easyPregnancyTime.push(this.getEasyPregnancyTime(endDate))    
    })
    

    this.setData({
        // estimateStartDate: startDate,
        // estimateEndDate: endDate,
        // estimateDates: dateArr,
         dates: newDates,
         setDates: newDates,
        // startDate: startDate,
        // endDate: endDate,
         easyPregnancyTime: easyPregnancyTime
    })

  },
  /**
   * 根据初始配置，循环计算到本月，得出本月所预测的所有周期
   */
  computeAll () {
     
  },
  /**
   * 查日期数组中，是否有同月的数据
   */
  hasSameMonth (month,arr) {
    var month = parseInt(month) < 10 ? ('0' + parseInt(month)) : parseInt(month),
        rs = false
       for(var i = 0, len = arr.length; i < len; i++) {
         if (arr[i].indexOf('-' + month + '-') > -1) {
           rs = true
           break
         }
       }

        return rs
  },
  /**
   * 循环日历，把状态加上，开始，持续，结束
   * 一个月可能会有2次或者多次区间
   * arr 日期数据
   */
  addStatusCalender (arr) {
    var //startDate = opts.startDate,
        base = wx.getStorageSync('base'),
        dates = this.data.dates,//开始日期，结束日期的区间数组，[[...],[...]]
        currentYMD = this.data.currentYMD,
        currentStatus = '',
        _this = this

      arr.forEach(function(item){
          item.forEach(function(cell){

            ///打状态标签
            cell.status =  _this.addStatus2Date(cell.ymd, dates)

            if (cell.ymd == currentYMD) {
              cell.selected = true
              currentStatus = cell.status
            }
            
          })
      })
      this.setData({
        dateArr:arr,
        currentStatus: currentStatus
      })
  },
  /**
   * 日期打状态标签
   * date 某天
   * dates 区间数组 [[...],[...]]
   */
  addStatus2Date (date,dates) {
     var status = 0,
         easyPregnancyTime = this.data.easyPregnancyTime

     for (var i = 0, len = dates.length; i < len; i++) {
       var range = dates[i]
       ///当前日期属于期间
       if (range.indexOf(date) > -1) {
         //第一天
         if (date == range[0]) {
           status = 1
         } else if (date == range[range.length - 1]) {
           //结束日期
           status = 3
         } else {
           status = 2
         }
       } else {
         ///是否是在排期
         for (var j = 0, len = easyPregnancyTime.length; j < len; j++) {
           var item = easyPregnancyTime[j]
           if (item.easyPregnancyTime.indexOf(date) > -1) {
             status = 4
             if (date == item.ovulationDate) {
               status = 5
             }
             break
           }
         }
       }
     }
    return status
    //  cell.status = status
  },
  /**
   * 追溯历史，传入年月日
   */
  getHistory () {
     
  },
  /**
   * 点击日期,下方出现解释和注意事项
   */
  handleDateTap (e) {
     var ymd = e.currentTarget.dataset.ymd,
       status = e.currentTarget.dataset.status,
       statusMap = this.data.statusMap,
       name = statusMap[status].name,
       desc = statusMap[status].desc,
       dateArr = this.data.dateArr
        
     console.log(ymd)
    //  for (var i = 0, len=dateArr.length; i < len; i++) {
    //    var arr = dateArr[0]
    //    for(var j = 0, len2 = arr.length; j < len2; j++) {
    //      if (arr[j].ymd == ymd) {
    //          arr[j].selected = true
    //      }
    //    }
    //  }

     this.setData({
       tipVisible: true,
       displayYMD: ymd,
       currentDateTip: {
         name: name,
         desc: desc
       }
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
    this.addStatusCalender(this.data.dateArr)
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