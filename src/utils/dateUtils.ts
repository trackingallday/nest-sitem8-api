var momenttz = require('moment-timezone');

export function mtzFromDateTimeTZ(dateutc, timeStr, tzStr) {
  var parts = timeStr.split(':');
  var hrs = parts[0];
  var mins = parts[1];
  var secs = parts[2];
  var mDate = momenttz(dateutc).tz(tzStr).utc();
  mDate.set({ hour: hrs, minute: mins, second: secs, millisecond: 0 });
  return mDate;
}

export function mtzFromTimeStr(timeStr) {
  const parts = timeStr.split(':');
  var hrs = parts[0];
  var mins = parts[1];
  return momenttz().hour(hrs).minute(mins).second(0);
}

