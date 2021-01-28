<template>
  <!-- 公共布局 -->
  <Common class="calendar-wrapper-container" :Lnb="false">
    <!-- 日历 -->
    <ModuleTransition>
      <div style="min-height: calc(100vh - 100px);" class="calendar-wrapper">
        <b-popover
          v-if="popover.target"
          :target="popover.target"
          :show.sync="popover.show"
          title="Popover"
          ref="popover"
        >{{popover.text}}</b-popover>
        <div id="top">葡萄</div>
        <div style="display: flex;">
          <Lnb
            :CalendarList="CalendarList"
            style="width: 200px;"
            @change="onChangeCalendars"
            @new="createNewSchedule"
          ></Lnb>
          <div style="flex: 1">
            <Menu :renderRangeText="renderRangeText" @menuChange="onClickMenu" @move="onClickNavi"></Menu>
            <div id="calendar"></div>
          </div>
        </div>
      </div>
    </ModuleTransition>
  </Common>
</template>
<script>
import Common from "@theme/components/Common";
import { ModuleTransition } from "@vuepress-reco/core/lib/components";
import moduleTransitonMixin from "@theme/mixins/moduleTransiton";

import Lnb from "@theme/components/Calendar/Lnb/Lnb.vue";
import Menu from "@theme/components/Calendar/Menu/Menu.vue";

import * as utils_calendars from "@theme/Page/Calendar/utils/calendars.js";
import * as utils_schedules from "@theme/Page/Calendar/utils/schedules.js";
import * as utils_common from "@theme/Page/Calendar/utils/common.js";

import "tui-calendar/dist/tui-calendar.css";
import "@theme/Page/Calendar/css/icons.css";

import Calendar from "tui-calendar";

export default {
  mixins: [moduleTransitonMixin],
  components: { Common, ModuleTransition, Lnb, Menu },

  data() {
    return {
      CalendarList: [],
      renderRangeText: "",
      popover: {
        target: null,
        text: "",
        show: false
      }
    };
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
          // "common.backgroundColor": "black",
          // "week.timegridLeftAdditionalTimezone.backgroundColor": "black",
          // "week.timegridLeft.backgroundColor": "black",
          // "month.moreView.backgroundColor": "black"
        },
        defaultView: "week",
        useCreationPopup: this.useCreationPopup,
        useDetailPopup: this.useDetailPopup,
        calendars: this.CalendarList,
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
          },
          popupDetailBody: function(schedule) {
            return "Body : " + schedule.body;
          }
        }
      });
      // event handlers
      this.cal.on({
        // 仅针对monthview的more按钮
        clickMore: e => {
          console.log("clickMore", e);
        },
        // 任何日程
        clickSchedule: e => {
          console.log(e);

          this.popover.target = "";
          this.$nextTick(() => {
            this.popover.text = e.schedule.title;
            this.popover.target = e.event.target;
            this.popover.show = true;
          });
        },
        // 最上方的日期
        clickDayname: function(date) {
          console.log("clickDayname", date);
        },
        // 创建日程前
        beforeCreateSchedule: e => {
          console.log("beforeCreateSchedule", e);
          // this.saveNewSchedule(e);
        },
        // 更新日程
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
        // 删除日程
        beforeDeleteSchedule: e => {
          console.log("beforeDeleteSchedule", e);
          this.cal.deleteSchedule(e.schedule.id, e.schedule.calendarId);
        },
        // 渲染日程之后，基本上所有日程都会触发
        afterRenderSchedule: e => {
          var schedule = e.schedule;
          // var element = cal.getElement(schedule.id, schedule.calendarId);
          // console.log("afterRenderSchedule", schedule);
        },
        // 时区，要配置timezones
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
    saveNewSchedule(scheduleData) {
      var calendar =
        scheduleData.calendar ||
        utils_calendars.findCalendar(
          this.CalendarList,
          scheduleData.calendarId
        );
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
      this.CalendarList.forEach(calendar => {
        this.cal.toggleSchedules(calendar.id, !calendar.checked, false);
      });

      this.cal.render(true);
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
    onChangeCalendars(obj) {
      if (obj.id === "all") {
        var temp = [];
        this.CalendarList.forEach(calendar => {
          calendar.checked = obj.checked;
          temp.push(calendar);
        });
        this.CalendarList = temp;
      } else {
        var pos = -1;
        var item = null;
        for (var i = 0; i < this.CalendarList.length; i++) {
          if (obj.id === this.CalendarList[i].id) {
            pos = i;
            item = this.CalendarList[i];
            item.checked = obj.checked;
            break;
          }
        }
        this.CalendarList.splice(pos, 1, item);
      }
      this.refreshScheduleVisibility();
    },
    setRenderRangeText() {
      this.renderRangeText = utils_common.getRenderRangeText(this.cal);
    },
    setSchedules() {
      this.cal.clear();
      utils_schedules.generateSchedule(
        this.CalendarList,
        this.cal.getViewName(),
        this.cal.getDateRangeStart(),
        this.cal.getDateRangeEnd()
      );
      this.cal.createSchedules(utils_schedules.ScheduleList);

      this.refreshScheduleVisibility();
    },
    onClickMenu(item) {
      var options = this.cal.getOptions();
      var viewName = "";
      switch (item.action) {
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
          break;
        case "toggle-start-day-1":
          options.month.startDayOfWeek = options.month.startDayOfWeek ? 0 : 1;
          options.week.startDayOfWeek = options.week.startDayOfWeek ? 0 : 1;
          viewName = this.cal.getViewName();
          break;
        case "toggle-workweek":
          options.month.workweek = !options.month.workweek;
          options.week.workweek = !options.week.workweek;
          viewName = this.cal.getViewName();
          break;
        default:
          break;
      }

      this.cal.setOptions(options, true);
      this.cal.changeView(viewName, true);

      this.setRenderRangeText();
      this.setSchedules();
    },
    createNewSchedule() {
      var start = new Date();
      var end = moment()
        .add(1, "hours")
        .toDate();

      if (this.useCreationPopup) {
        this.cal.openCreationPopup({
          start: start,
          end: end,
          body: "123"
        });
      }
    },
    onClickNavi(action) {
      console.log(action);
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
    }
  },

  created() {
    this.CalendarList = utils_calendars.init();
  },

  mounted() {
    this.cal = null;
    this.useCreationPopup = false;
    this.useDetailPopup = false;
    this.initCalendar();
    this.setRenderRangeText();
    this.setSchedules();
  },

  watch: {}
};
</script>

<style src="../styles/theme.styl" lang="stylus"></style>

<style lang="stylus" scoped>
.calendar-wrapper-container {
  margin: 0 auto;
  padding: 3.6rem 0;
}

@media (max-width: $MQMobile) {
  .calendar-wrapper-container {
    padding: 3.6rem 1rem 0;
  }
}

#top {
  height: 49px;
  border-bottom: 1px solid #bbb;
  padding: 16px;
  font-size: 10px;
}
</style>
