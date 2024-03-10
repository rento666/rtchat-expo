const dateUtils = {
  formatTime: (inputTime) => {
    return formatTime(inputTime);
  },
  generateCurrentTime: ()=> {
    return generateTime();
  }
};

const formatTime = (inputTime) => {
  var currentTime = new Date();
  var targetTime = new Date(inputTime);
  // 判断是否是今天
  if (isSameDay(currentTime, targetTime)) {
    return formatHHmm(targetTime);
  }

  // 判断是否是昨天
  var yesterday = new Date(currentTime);
  yesterday.setDate(currentTime.getDate() - 1);
  if (isSameDay(yesterday, targetTime)) {
      return "昨天 " + formatHHmm(targetTime);
  }

  // 判断是否是一星期之内
  var daysDiff = Math.floor((currentTime - targetTime) / (24 * 3600 * 1000));
  if (daysDiff < 7) {
      return formatWeekday(targetTime);
  }

  // 判断是否是今年
  if (currentTime.getFullYear() === targetTime.getFullYear()) {
      return formatDateMMDD(targetTime);
  }

  // 其余情况
  return formatDateYYMMDD(targetTime);
}

function isSameDay(date1, date2) {
  return date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate();
}

function formatHHmm(date) {
  var hours = date.getHours().toString().padStart(2, '0');
  var minutes = date.getMinutes().toString().padStart(2, '0');
  return hours + ":" + minutes;
}

function formatWeekday(date) {
  var weekdays = ["日", "一", "二", "三", "四", "五", "六"];
  var weekdayIndex = date.getDay();
  return "星期" + weekdays[weekdayIndex];
}

function formatDateMMDD(date) {
  var month = (date.getMonth() + 1).toString().padStart(2, '0');
  var day = date.getDate().toString().padStart(2, '0');
  return month + "-" + day;
}

function formatDateYYMMDD(date) {
  var year = date.getFullYear().toString().substr(2, 2);
  var month = (date.getMonth() + 1).toString().padStart(2, '0');
  var day = date.getDate().toString().padStart(2, '0');
  return year + "-" + month + "-" + day;
}

// 生成当前时间字符串的函数
const generateTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

export default dateUtils;