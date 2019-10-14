var momenttz = require('moment-timezone');

function mtzFromDateTimeTZ(dateutc, timeStr, tzStr) {
  var parts = timeStr.split(':');
  var hrs = parts[0];
  var mins = parts[1];
  var secs = parts[2];
  var mDate = momenttz.utc(dateutc).tz(tzStr);
  mDate.set({ hour: hrs, minute: mins, second: secs, millisecond: 0 });
  return mDate;
}


module.exports = {
  mtzFromDateTimeTZ: mtzFromDateTimeTZ,
}
