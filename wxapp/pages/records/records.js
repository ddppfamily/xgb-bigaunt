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
    /**
     * [[1,2,3,4,5,6,7]]
     * 数组的数组，子数组代表一行，始终1号开始
     */
    dateArr:[]
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
   //判断1号是星期几
    var date1 = new Date(this.data.currentYear + '-' + this.data.currentMonth + '-1')
    var year_ping = [31,28,31,30,31,30,31,31,30,31,30,31]
    var year_run = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    var week1 = date1.getDay()
    var dateArr = []
    var tempArr = [] 
    var year = year_ping

    if (this.isRunYear(this.data.currentYear)) {
      year = year_run
    }
     for(var i = 1 ; i < 36; i++) {
       if (i > year[this.data.currentMonth - 1]){
         tempArr.push('')
       } else {
         tempArr.push(i)
       }
       
     }
     ///前面空缺位置补充
     for(var i = 0; i < week1; i++) {
       tempArr.unshift(' ')
     }
     tempArr = tempArr.slice(0,35)
     console.log(tempArr)
     ///分5行
     while(tempArr.length > 0) {
       dateArr.push(tempArr.splice(0,7))
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