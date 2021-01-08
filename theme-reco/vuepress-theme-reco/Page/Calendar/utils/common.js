/**
 * 日历的工具库
 *
 * global moment Chance chance jquery
 */

/**
 * 获取日历当前展示时间
 *
 * day: 2021.01.08
 * month: 2021.01
 * other：2021.01.03 ~ 01.16
 *
 * @param {*} cal 日历实例
 */
export function getRenderRangeText(cal) {
  var options = cal.getOptions();
  var viewName = cal.getViewName();
  var html = [];
  if (viewName === "day") {
    html.push(
      moment([
        cal.getDate().getFullYear(),
        cal.getDate().getMonth(),
        cal.getDate().getDate()
      ]).format("YYYY.MM.DD")
    );
  } else if (
    viewName === "month" &&
    (!options.month.visibleWeeksCount || options.month.visibleWeeksCount > 4)
  ) {
    html.push(
      moment([
        cal.getDate().getFullYear(),
        cal.getDate().getMonth(),
        cal.getDate().getDate()
      ]).format("YYYY.MM")
    );
  } else {
    html.push(moment(cal.getDateRangeStart().getTime()).format("YYYY.MM.DD"));
    html.push(" ~ ");
    html.push(moment(cal.getDateRangeEnd().getTime()).format(" MM.DD"));
  }
  return html.join("");
}
