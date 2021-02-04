/**
 * 日历的工具库
 *
 * global moment Chance chance jquery
 *
 *
 * getViewName：Get current view name('day', 'week', 'month')
 * toggleSchedules(calendarId, toHide, render)：Toggle schedules' visibility by calendar ID
 *    render | boolean = true | set true then render after change visible property each models
 * toggleTaskView(enabled)：There is no milestone, task, so hide those view panel
 */

/**
 * 获取日历当前展示时间
 *
 * 这个是定制化的
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

/**
 * 日历类型选择菜单的下拉框的显示内容
 *
 * 这个是定制化
 *
 * @param {*} cal 日历实例
 */
export function getDropdownCalendarType(cal) {
  var options = cal.getOptions();
  var type = cal.getViewName();
  var iconClassName;

  console.log("type", type);
  if (type === "day") {
    type = "Daily";
    iconClassName = "calendar-icon ic_view_day";
  } else if (type === "week") {
    type = "Weekly";
    iconClassName = "calendar-icon ic_view_week";
  } else if (options.month.visibleWeeksCount === 2) {
    type = "2 weeks";
    iconClassName = "calendar-icon ic_view_week";
  } else if (options.month.visibleWeeksCount === 3) {
    type = "3 weeks";
    iconClassName = "calendar-icon ic_view_week";
  } else {
    type = "Monthly";
    iconClassName = "calendar-icon ic_view_month";
  }

  return {
    type,
    iconClassName
  };
}

/**
 * 获取目标元素的data-{type}
 *
 * @param {*} target 元素
 * @param {*} type data-{type}
 */
export function getDomData(target, type) {
  return target.dataset
    ? target.dataset[type]
    : target.getAttribute("data-" + type);
}
