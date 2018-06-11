const app = getApp()
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
///传入天数，基于参考天数计算日期
const cDate = (date,days) => {
   var dateObj1 = new Date(date),
       cDateObj = new Date(dateObj1.getTime() + days*24*60*60*1000),
       ymd = formatDate(cDateObj,'yyyy-MM-dd')
   return ymd
}
///日期比较
////yyyy-MM-dd
////前比后大，返回true
const compareDate = (date1,date2) => {
   var timestamp1 = + new Date(date1),
       timestamp2 = + new Date(date2)
   return timestamp1 >= timestamp2 ? true : false    
}

///时间，返回yyyy-MM-dd格式，MM{01，12}
const formatDate = (dateObj,format) => {
  var cDate = dateObj,
      year = cDate.getFullYear(),
      month = cDate.getMonth() + 1 < 10 ? '0' + (cDate.getMonth() + 1) : (cDate.getMonth() + 1),
      date = cDate.getDate() < 10 ? '0' + cDate.getDate() : cDate.getDate(),
      week = cDate.getDay()
  return format.replace('yyyy',year)
               .replace('MM', month)
               .replace('dd',date)
}
////传入开始时间，结束时间，生成区间日期数组
const formatDateArr = (startDate, endDate) => {
  var arr = [],
      startDateObj = new Date(startDate),
      endDateObj = new Date(endDate),
      tempTimestamp = + new Date(startDate)

  for (var i = 0, len = 60; i < len; i++) {
    if (tempTimestamp <= endDateObj.getTime()) {
      arr.push(formatDate(new Date(startDateObj.getTime() + i * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'))
      tempTimestamp += 24 * 60 * 60 * 1000
      console.log()
    } else {
      break
    }
  }

  return arr
}
const computeNext = (base, index) => {
  var baseEndDate = base.endDate,
    gapDays = base.gapDays,
    baseEndDateObj = new Date(baseEndDate),
    continueDays = base.continueDays - 1,
    endDateTimestamp = baseEndDateObj.getTime() + (gapDays + continueDays) * 24 * 60 * 60 * 1000 * index,
    startDateTimestamp = endDateTimestamp - continueDays * 24 * 60 * 60 * 1000,
    endDateObj = new Date(endDateTimestamp),
    startDateObj = new Date(startDateTimestamp)

  return {
    startDate: Utils.formatDate(startDateObj, 'yyyy-MM-dd'),
    endDate: Utils.formatDate(endDateObj, 'yyyy-MM-dd')
  }

}
const getEasyPregnancyTime = (endDate)=> {
  var nextFirstObj = new Date(this.getNextFirst(endDate)),
    ovulationDateObj = '',
    easyPregnancyStartObj = '',
    easyPregnancyEndObj = '',
    easyPregnancyStart = '',
    easyPregnancyEnd = '',
    easyPregnancyTime = []

  ovulationDateObj = new Date(nextFirstObj.getTime() - 14 * 24 * 60 * 60 * 1000)
  easyPregnancyStartObj = new Date(ovulationDateObj.getTime() - 5 * 24 * 60 * 60 * 1000)
  easyPregnancyEndObj = new Date(ovulationDateObj.getTime() + 4 * 24 * 60 * 60 * 1000)

  easyPregnancyStart = Utils.formatDate(easyPregnancyStartObj, 'yyyy-MM-dd')
  easyPregnancyEnd = Utils.formatDate(easyPregnancyEndObj, 'yyyy-MM-dd')

  easyPregnancyTime = Utils.formatDateArr(easyPregnancyStart, easyPregnancyEnd)

  return {
    ovulationDate: Utils.formatDate(ovulationDateObj, 'yyyy-MM-dd'),
    easyPregnancyStart: easyPregnancyStart,
    easyPregnancyEnd: easyPregnancyEnd,
    easyPregnancyTime: easyPregnancyTime
  }
} 

const compute = (base) => {
  let dates = [], //this.data.dates ||
    formatDate = new Date(),
    currentMonth = formatDate.getMonth() + 1,
    currentYear = formatDate.getFullYear(),
    displayYMD = '',
    newDates = [],
    computeDate,
    computeDateRange,
    dateData = [],
    // computeTag = 'plus',
    index = 0
  
  ///如果是显示月份大于base月份，是加一
  if (this.compareYM(displayYMD, base.endDate) == 1 || this.compareYM(displayYMD, base.endDate) == 0) {
    if (this.compareYM(displayYMD, base.endDate) == 0) {
      index = 0

    }
    do {
      // console.log('computeTag ===', computeTag)
      computeDate = this.computeNext(base, index)
      computeDateRange = this.formatDateArr(computeDate.startDate, computeDate.endDate)
      ////
      dateData.push(computeDateRange)
      /////
      if (this.isTheNext(computeDate.endDate, currentYear, currentMonth) == 0 || this.isTheNext(computeDate.startDate, currentYear, currentMonth) == 0) {
        dates.push(computeDateRange)
      }
      ///加一
      index += 1

      if (this.isTheNext(computeDate.endDate, currentYear, currentMonth) == 1 && this.isTheNext(computeDate.startDate, currentYear, currentMonth) == 1) {
        break
      }

    } while (true)
  }

  if (this.compareYM(displayYMD, base.endDate) == -1) {
    // 
    do {
      // console.log('computeTag ===', computeTag)
      computeDate = this.computeNext(base, index)
      computeDateRange = this.formatDateArr(computeDate.startDate, computeDate.endDate)
      ////
      dateData.push(computeDateRange)
      /////
      if (this.isTheNext(computeDate.endDate, currentYear, currentMonth) == 0 || this.isTheNext(computeDate.startDate, currentYear, currentMonth) == 0) {
        dates.push(computeDateRange)
      }

      index -= 1
      console.log('index ===', index)
      if (this.isTheNext(computeDate.endDate, currentYear, currentMonth) == -1 && this.isTheNext(computeDate.startDate, currentYear, currentMonth) == -1) {
        break
      }

    } while (true)
  }

  var easyPregnancyTime = []

  ///易期计算,也是数组
  //循环新日期区间数组
  ///本次的之前也要计算
  dates.forEach((dates) => {
    var maxIndex = dates.length,
      endDate = dates[maxIndex - 1],
      startDate = dates[0],
      preEndDate = this.cDate(startDate, -base.gapDays)
    easyPregnancyTime.push(this.getEasyPregnancyTime(preEndDate))
    easyPregnancyTime.push(this.getEasyPregnancyTime(endDate))
  })


  return {
    dates: dates,
    setDates: dates,
    dateData: dateData,
    easyPregnancyTime: easyPregnancyTime
  }

}
////传入日期，计算出当前状态
/////data:yyyy-MM-dd
/////base: Object
const getDateStatus = (date,base) => {
  let compute = this.compute(base)
  let dates = compute.dates || []
  let status = 0
  let easyPregnancyTime = compute.easyPregnancyTime

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
      easyPregnancyTime.forEach(function (easyPregnancyTime) {
        var item = easyPregnancyTime.easyPregnancyTime
        if (status == 0) {
          if (item.indexOf(date) > -1) {
            status = 4
            if (date == easyPregnancyTime.ovulationDate) {
              status = 5
            }
          }
        }

      })

    }
  }
  return status
}
///yyyy-MM-dd  ，反解析年月日单独输出
const compilerYmd = (ymd) => {
  if (ymd) {
    var arr = ymd.split('-')
    return {
      year: arr[0],
      month: arr[1],
      date: arr[2]
    }
  }
  
}

///对比年月,ym1 > ym2 返回1，相等 0，小于-1
const compareYM = function (ym1,ym2) {
  var ym1 = compilerYmd(ym1),
      ym2 = compilerYmd(ym2),
      y1 = ym1.year,
      m1 = ym1.month,
      y2 = ym2.year,
      m2 = ym2.month
  if (y1 == y2) {
     if (m1 > m2) {
       return 1
     }
     if (m1 == m2) {
       return 0
     }
     if (m1 < m2) {
       return -1
     }
  }
  if(y1 > y2) {
    return 1
  } 

  if (y1 < y2) {
    return -1
  }  
}
////判断yyyy-MM-dd，是否是给定的月份中
///如果是下一个月了或者是下一年，则返回1
////如果是上一个月，则返回-1
///1.年相同，比较月份
///2.年不同，比较年就可
const isTheNext = (ymd,year,month) => {
  var ymd1 = compilerYmd(ymd),
    y = parseInt(ymd1.year),
    m = parseInt(ymd1.month),
    d = parseInt(ymd1.date)

  if (y == year) {
     if (month < m) {
       console.log(ymd, year, month,1)
       return 1
     } else if(month == m) {
       console.log(ymd, year, month, 0)
       return 0
     } else {
       console.log(ymd, year, month, -1)
       return -1
     }
  } else if (y < year) {
    console.log(ymd, year, month, -1)
     return -1
  } else if (y  > year) {
    console.log(ymd, year, month, -1)
    return 1
  } 
}
/**
 * getUser
 */
const getUser = ()=>{
  // 登录
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
                console.log(res)
                app.globalData.userInfo = res.userInfo
                app.globalData.encryptedData = res.encryptedData
                app.globalData.iv = res.iv
                // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                // 所以此处加入 callback 以防止这种情况
                // if (this.userInfoReadyCallback) {
                //   this.userInfoReadyCallback(res)
                // }
              }
            })
          // } else {
          //   wx.openSetting({
          //     success: function success(res) {
          //       console.log('openSetting success', res.authSetting);
          //     }
          //   })
            // this.globalData.userInfo = {
            //   nickName: ''
            // }
            // if (this.userInfoReadyCallback) {
            //   this.userInfoReadyCallback({
            //     userInfo: {
            //       nickName: ''
            //     }
            //   })
            // }
          //}
        }
      })
    }
  })
}
/**
 * 是否是空对象
 */
const isEmptyObject = (obj) => {
   var t = ''
   for (t in obj){
     return false
   }
   return true
}
/**
  * 检测用户授权状态
  */
const checkSetting = ()=> {
  wx.getSetting({
      success: (res) => {
        var authSetting = res.authSetting
        if (isEmptyObject(authSetting)) {
          console.log('authSetting empty')
          //打开授权
          getUser()
         
        } else {
          console.log(authSetting)
          if (authSetting['scope.userInfo'] === false) {
            wx.openSetting({
              success: function success(res) {
                console.log('openSetting success', res.authSetting);
              }
            })
          }
        }
      }
  })
}
module.exports = {
  formatTime: formatTime,
  formatNumber: formatNumber,
  compareDate: compareDate,
  formatDate: formatDate,
  formatDateArr: formatDateArr,
  compilerYmd: compilerYmd,
  isTheNext: isTheNext,
  compareYM: compareYM,
  cDate: cDate,
  checkSetting: checkSetting,
  getUser: getUser
}
