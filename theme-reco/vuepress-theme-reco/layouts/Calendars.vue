<template>
  <!-- 公共布局 -->
  <Common class="calendar-wrapper-container" :Lnb="false">
    <!-- 日历 -->
    <ModuleTransition>
      <div style="height: calc(100vh - 100px);" class="calendar-wrapper">
        <div id="top">葡萄</div>
        <div id="lnb">
          <div class="lnb-new-schedule">
            <button
              id="btn-new-schedule"
              type="button"
              class="btn btn-default btn-block lnb-new-schedule-btn"
              data-toggle="modal"
            >New schedule</button>
          </div>
          <div id="lnb-calendars" class="lnb-calendars">
            <div>
              <div class="lnb-calendars-item">
                <label>
                  <input
                    class="tui-full-calendar-checkbox-square"
                    type="checkbox"
                    value="all"
                    checked
                  />
                  <span></span>
                  <strong>View all</strong>
                </label>
              </div>
            </div>
            <div id="calendarList" class="lnb-calendars-d1"></div>
          </div>
          <div class="lnb-footer">© NHN Corp.</div>
        </div>
        <div id="right">
          <div id="menu">
            <span class="dropdown">
              <button
                id="dropdownMenu-calendarType"
                class="btn btn-default btn-sm dropdown-toggle"
                type="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="true"
              >
                <i
                  id="calendarTypeIcon"
                  class="calendar-icon ic_view_month"
                  style="margin-right: 4px;"
                ></i>
                <span id="calendarTypeName">Dropdown</span>&nbsp;
                <i class="calendar-icon tui-full-calendar-dropdown-arrow"></i>
              </button>
              <ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu-calendarType">
                <li role="presentation">
                  <a class="dropdown-menu-title" role="menuitem" data-action="toggle-daily">
                    <i class="calendar-icon ic_view_day"></i>Daily
                  </a>
                </li>
                <li role="presentation">
                  <a class="dropdown-menu-title" role="menuitem" data-action="toggle-weekly">
                    <i class="calendar-icon ic_view_week"></i>Weekly
                  </a>
                </li>
                <li role="presentation">
                  <a class="dropdown-menu-title" role="menuitem" data-action="toggle-monthly">
                    <i class="calendar-icon ic_view_month"></i>Month
                  </a>
                </li>
                <li role="presentation">
                  <a class="dropdown-menu-title" role="menuitem" data-action="toggle-weeks2">
                    <i class="calendar-icon ic_view_week"></i>2 weeks
                  </a>
                </li>
                <li role="presentation">
                  <a class="dropdown-menu-title" role="menuitem" data-action="toggle-weeks3">
                    <i class="calendar-icon ic_view_week"></i>3 weeks
                  </a>
                </li>
                <li role="presentation" class="dropdown-divider"></li>
                <li role="presentation">
                  <a role="menuitem" data-action="toggle-workweek">
                    <input
                      type="checkbox"
                      class="tui-full-calendar-checkbox-square"
                      value="toggle-workweek"
                      checked
                    />
                    <span class="checkbox-title"></span>Show weekends
                  </a>
                </li>
                <li role="presentation">
                  <a role="menuitem" data-action="toggle-start-day-1">
                    <input
                      type="checkbox"
                      class="tui-full-calendar-checkbox-square"
                      value="toggle-start-day-1"
                    />
                    <span class="checkbox-title"></span>Start Week on Monday
                  </a>
                </li>
                <li role="presentation">
                  <a role="menuitem" data-action="toggle-narrow-weekend">
                    <input
                      type="checkbox"
                      class="tui-full-calendar-checkbox-square"
                      value="toggle-narrow-weekend"
                    />
                    <span class="checkbox-title"></span>Narrower than weekdays
                  </a>
                </li>
              </ul>
            </span>
            <span id="menu-navi">
              <button
                type="button"
                class="btn btn-default btn-sm move-today"
                data-action="move-today"
              >Today</button>
              <button type="button" class="btn btn-default btn-sm move-day" data-action="move-prev">
                <i class="calendar-icon ic-arrow-line-left" data-action="move-prev"></i>
              </button>
              <button type="button" class="btn btn-default btn-sm move-day" data-action="move-next">
                <i class="calendar-icon ic-arrow-line-right" data-action="move-next"></i>
              </button>
            </span>
            <span id="renderRange" class="render-range"></span>
          </div>
          <div id="calendar"></div>
        </div>
      </div>
    </ModuleTransition>
  </Common>
</template>
<script>
import Common from "@theme/components/Common";
import { ModuleTransition } from "@vuepress-reco/core/lib/components";
import moduleTransitonMixin from "@theme/mixins/moduleTransiton";

import * as utils_calendars from "@theme/Page/Calendar/utils/calendars.js";
import * as utils_schedules from "@theme/Page/Calendar/utils/schedules.js";
import * as utils_common from "@theme/Page/Calendar/utils/common.js";

import "tui-calendar/dist/tui-calendar.css";
// If you use the default popups, use this.
import "tui-date-picker/dist/tui-date-picker.css";
import "tui-time-picker/dist/tui-time-picker.css";

import "@theme/Page/Calendar/css/default.css";
import "@theme/Page/Calendar/css/icons.css";

// var $ = require("../Page/Calendar/js/jquery-3.5.1.js");
// window.$ = $;
// window.jQuery = $;
require("../Page/Calendar/js/bootstrap.min.js");

// 在vue组件的mounted使用，如果是引用一个js，那需要这样写
// var tui = require("tui-calendar");
// // window.tui = tui;
// console.log(tui);

import Calendar from "tui-calendar";

export default {
  mixins: [moduleTransitonMixin],
  components: { Common, ModuleTransition },

  data() {
    return {};
  },

  computed: {},

  methods: {
    initCalendar() {
      // 不用双向绑定
      this.cal = new Calendar("#calendar", {
        /**
         * TOAST UI Calendar应用Google Analytics（GA）收集关于使用开源的统计数据，以确定TOAST UI Calendar在全世界的使用范围。
         * 它也是决定项目未来进程的重要指标。location.hostname名称（例如>”ui.toast.com）进行收集，唯一的目的只是对使用情况进行统计。
         **/

        usageStatistics: false,
        theme: {
          "common.backgroundColor": "black",
          "week.timegridLeftAdditionalTimezone.backgroundColor": "black",
          "week.timegridLeft.backgroundColor": "black",
          "month.moreView.backgroundColor": "black"
        },
        defaultView: "week",
        useCreationPopup: this.useCreationPopup,
        useDetailPopup: this.useDetailPopup,
        calendars: utils_calendars.CalendarList,
        template: {
          milestone: function(model) {
            return (
              '<span class="calendar-font-icon ic-milestone-b"></span> <span style="background-color: ' +
              model.bgColor +
              '">' +
              model.title +
              "</span>"
            );
          },
          allday: schedule => {
            return this.getTimeTemplate(schedule, true);
          },
          time: schedule => {
            return this.getTimeTemplate(schedule, false);
          }
        }
      });
      // event handlers
      this.cal.on({
        clickMore: e => {
          console.log("clickMore", e);
        },
        clickSchedule: e => {
          console.log("clickSchedule", e);
        },
        clickDayname: function(date) {
          console.log("clickDayname", date);
        },
        beforeCreateSchedule: e => {
          console.log("beforeCreateSchedule", e);
          this.saveNewSchedule(e);
        },
        beforeUpdateSchedule: e => {
          var schedule = e.schedule;
          var changes = e.changes;

          console.log("beforeUpdateSchedule", e);

          if (changes && !changes.isAllDay && schedule.category === "allday") {
            changes.category = "time";
          }

          this.cal.updateSchedule(schedule.id, schedule.calendarId, changes);
          this.refreshScheduleVisibility();
        },
        beforeDeleteSchedule: e => {
          console.log("beforeDeleteSchedule", e);
          this.cal.deleteSchedule(e.schedule.id, e.schedule.calendarId);
        },
        afterRenderSchedule: e => {
          var schedule = e.schedule;
          // var element = cal.getElement(schedule.id, schedule.calendarId);
          // console.log('afterRenderSchedule', element);
        },
        clickTimezonesCollapseBtn: timezonesCollapsed => {
          console.log("timezonesCollapsed", timezonesCollapsed);
          if (timezonesCollapsed) {
            this.cal.setTheme({
              "week.daygridLeft.width": "77px",
              "week.timegridLeft.width": "77px"
            });
          } else {
            this.cal.setTheme({
              "week.daygridLeft.width": "60px",
              "week.timegridLeft.width": "60px"
            });
          }
          return true;
        }
      });
    },
    initLnbDom() {
      var calendarList = document.getElementById("calendarList");
      var html = [];
      utils_calendars.CalendarList.forEach(function(calendar) {
        html.push(
          '<div class="lnb-calendars-item"><label>' +
            '<input type="checkbox" class="tui-full-calendar-checkbox-round" value="' +
            calendar.id +
            '" checked>' +
            '<span style="border-color: ' +
            calendar.borderColor +
            "; background-color: " +
            calendar.borderColor +
            ';"></span>' +
            "<span>" +
            calendar.name +
            "</span>" +
            "</label></div>"
        );
      });
      calendarList.innerHTML = html.join("\n");
    },
    saveNewSchedule(scheduleData) {
      var calendar =
        scheduleData.calendar ||
        utils_calendars.findCalendar(scheduleData.calendarId);
      var schedule = {
        id: String(chance),
        title: scheduleData.title,
        isAllDay: scheduleData.isAllDay,
        start: scheduleData.start,
        end: scheduleData.end,
        category: scheduleData.isAllDay ? "allday" : "time",
        dueDateClass: "",
        color: calendar.color,
        bgColor: calendar.bgColor,
        dragBgColor: calendar.bgColor,
        borderColor: calendar.borderColor,
        location: scheduleData.location,
        raw: {
          class: scheduleData.raw["class"]
        },
        state: scheduleData.state
      };
      if (calendar) {
        schedule.calendarId = calendar.id;
        schedule.color = calendar.color;
        schedule.bgColor = calendar.bgColor;
        schedule.borderColor = calendar.borderColor;
      }

      this.cal.createSchedules([schedule]);

      this.refreshScheduleVisibility();
    },
    refreshScheduleVisibility() {
      var calendarElements = Array.prototype.slice.call(
        document.querySelectorAll("#calendarList input")
      );

      utils_calendars.CalendarList.forEach(calendar => {
        this.cal.toggleSchedules(calendar.id, !calendar.checked, false);
      });

      this.cal.render(true);

      calendarElements.forEach(function(input) {
        var span = input.nextElementSibling;
        span.style.backgroundColor = input.checked
          ? span.style.borderColor
          : "transparent";
      });
    },
    /**
     * Get time template for time and all-day
     * @param {Schedule} schedule - schedule
     * @param {boolean} isAllDay - isAllDay or hasMultiDates
     * @returns {string}
     */
    getTimeTemplate(schedule, isAllDay) {
      var html = [];
      var start = moment(schedule.start.toUTCString());
      if (!isAllDay) {
        html.push("<strong>" + start.format("HH:mm") + "</strong> ");
      }
      if (schedule.isPrivate) {
        html.push('<span class="calendar-font-icon ic-lock-b"></span>');
        html.push(" Private");
      } else {
        if (schedule.isReadOnly) {
          html.push('<span class="calendar-font-icon ic-readonly-b"></span>');
        } else if (schedule.recurrenceRule) {
          html.push('<span class="calendar-font-icon ic-repeat-b"></span>');
        } else if (schedule.attendees.length) {
          html.push('<span class="calendar-font-icon ic-user-b"></span>');
        } else if (schedule.location) {
          html.push('<span class="calendar-font-icon ic-location-b"></span>');
        }
        html.push(" " + schedule.title);
      }

      return html.join("");
    },
    onChangeCalendars(e) {
      var calendarId = e.target.value;
      var checked = e.target.checked;
      var viewAll = document.querySelector(".lnb-calendars-item input");
      var calendarElements = Array.prototype.slice.call(
        document.querySelectorAll("#calendarList input")
      );
      var allCheckedCalendars = true;

      if (calendarId === "all") {
        allCheckedCalendars = checked;

        calendarElements.forEach(function(input) {
          var span = input.parentNode;
          input.checked = checked;
          span.style.backgroundColor = checked
            ? span.style.borderColor
            : "transparent";
        });

        utils_calendars.CalendarList.forEach(function(calendar) {
          calendar.checked = checked;
        });
      } else {
        utils_calendars.findCalendar(calendarId).checked = checked;

        allCheckedCalendars = calendarElements.every(function(input) {
          return input.checked;
        });

        if (allCheckedCalendars) {
          viewAll.checked = true;
        } else {
          viewAll.checked = false;
        }
      }

      this.refreshScheduleVisibility();
    },
    getDataAction(target) {
      return target.dataset
        ? target.dataset.action
        : target.getAttribute("data-action");
    },
    setDropdownCalendarType() {
      var calendarTypeName = document.getElementById("calendarTypeName");
      var calendarTypeIcon = document.getElementById("calendarTypeIcon");
      var options = this.cal.getOptions();
      var type = this.cal.getViewName();
      var iconClassName;

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

      calendarTypeName.innerHTML = type;
      calendarTypeIcon.className = iconClassName;
    },
    setRenderRangeText() {
      var renderRange = document.getElementById("renderRange");
      renderRange.innerHTML = utils_common.getRenderRangeText(this.cal);
    },
    setSchedules() {
      this.cal.clear();
      utils_schedules.generateSchedule(
        this.cal.getViewName(),
        this.cal.getDateRangeStart(),
        this.cal.getDateRangeEnd()
      );
      this.cal.createSchedules(utils_schedules.ScheduleList);

      this.refreshScheduleVisibility();
    },
    /**
     * A listener for click the menu
     * @param {Event} e - click event
     */
    onClickMenu(e) {
      var target = $(e.target).closest('a[role="menuitem"]')[0];
      var action = this.getDataAction(target);
      var options = this.cal.getOptions();
      var viewName = "";
      switch (action) {
        case "toggle-daily":
          viewName = "day";
          break;
        case "toggle-weekly":
          viewName = "week";
          break;
        case "toggle-monthly":
          options.month.visibleWeeksCount = 0;
          viewName = "month";
          break;
        case "toggle-weeks2":
          options.month.visibleWeeksCount = 2;
          viewName = "month";
          break;
        case "toggle-weeks3":
          options.month.visibleWeeksCount = 3;
          viewName = "month";
          break;
        case "toggle-narrow-weekend":
          options.month.narrowWeekend = !options.month.narrowWeekend;
          options.week.narrowWeekend = !options.week.narrowWeekend;
          viewName = this.cal.getViewName();

          target.querySelector("input").checked = options.month.narrowWeekend;
          break;
        case "toggle-start-day-1":
          options.month.startDayOfWeek = options.month.startDayOfWeek ? 0 : 1;
          options.week.startDayOfWeek = options.week.startDayOfWeek ? 0 : 1;
          viewName = this.cal.getViewName();

          target.querySelector("input").checked = options.month.startDayOfWeek;
          break;
        case "toggle-workweek":
          options.month.workweek = !options.month.workweek;
          options.week.workweek = !options.week.workweek;
          viewName = this.cal.getViewName();

          target.querySelector("input").checked = !options.month.workweek;
          break;
        default:
          break;
      }

      this.cal.setOptions(options, true);
      this.cal.changeView(viewName, true);

      this.setDropdownCalendarType();
      this.setRenderRangeText();
      this.setSchedules();
    },
    createNewSchedule(event) {
      var start = event.start ? new Date(event.start.getTime()) : new Date();
      var end = event.end
        ? new Date(event.end.getTime())
        : moment()
            .add(1, "hours")
            .toDate();

      if (this.useCreationPopup) {
        this.cal.openCreationPopup({
          start: start,
          end: end
        });
      }
    },
    onClickNavi(e) {
      var action = this.getDataAction(e.target);

      switch (action) {
        case "move-prev":
          this.cal.prev();
          break;
        case "move-next":
          this.cal.next();
          break;
        case "move-today":
          this.cal.today();
          break;
        default:
          return;
      }

      this.setRenderRangeText();
      this.setSchedules();
    },
    setEventListener() {
      // 左侧边栏
      $("#lnb-calendars").on("change", this.onChangeCalendars);
      // 类型下拉框
      $('.dropdown-menu a[role="menuitem"]').on("click", this.onClickMenu);
      // 新建行程
      $("#btn-new-schedule").on("click", this.createNewSchedule);
      $("#menu-navi").on("click", this.onClickNavi);
      // window.addEventListener("resize", this.resizeThrottled);
    }
  },

  created() {
    utils_calendars.init();
  },

  mounted() {
    this.cal = null;
    // this.resizeThrottled = tui.util.throttle(()=> {
    //   this.cal.render();
    // }, 50);
    this.useCreationPopup = true;
    this.useDetailPopup = true;
    this.selectedCalendar = null;
    this.initCalendar();
    this.initLnbDom();
    this.setEventListener();
    this.setDropdownCalendarType();
    this.setRenderRangeText();
    this.setSchedules();
  },

  watch: {}
};
</script>

<style src="@theme/Page/Calendar/css/bootstrap.min.css" scoped></style>
<style src="@theme/Page/Calendar/css/default.css" scoped></style>

<style src="../styles/theme.styl" lang="stylus"></style>

<style lang="stylus" scoped>
.calendar-wrapper-container {
  margin: 0 auto;
  padding: 4.6rem 0;
}

@media (max-width: $MQMobile) {
  .calendar-wrapper-container {
    padding: 4.6rem 1rem 0;
  }
}
</style>
