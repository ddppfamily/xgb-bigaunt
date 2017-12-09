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
module.exports = {
  formatTime: formatTime,
  compareDate: compareDate,
  formatDate: formatDate,
  formatDateArr: formatDateArr
}
