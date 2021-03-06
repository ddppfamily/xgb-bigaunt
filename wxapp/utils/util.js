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
