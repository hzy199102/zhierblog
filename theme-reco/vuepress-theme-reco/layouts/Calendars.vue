<template>
  <!-- 公共布局 -->
  <Common class="calendar-wrapper" :sidebar="false">
    <!-- 日历 -->
    <ModuleTransition>
      <div>
        <Sidebar></Sidebar>
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

import Sidebar from "@theme/components/Calendar/Sidebar/Sidebar.vue";

import "tui-calendar/dist/tui-calendar.css";
// If you use the default popups, use this.
import "tui-date-picker/dist/tui-date-picker.css";
import "tui-time-picker/dist/tui-time-picker.css";
import "../Page/Calendar/css/bootstrap.min.css";
import "../Page/Calendar/css/default.css";
import "../Page/Calendar/css/icons.css";

const $ = require("../Page/Calendar/js/jquery-3.5.1.js");
window.$ = $;
window.jQuery = $;
require("../Page/Calendar/js/bootstrap.min.js");

import "../Page/Calendar/data/calendars.js";
import "../Page/Calendar/data/schedules.js";

const tui = require("tui-calendar");
window.tui = tui;
console.log(tui);

require("../Page/Calendar/js/app.js");

export default {
  mixins: [moduleTransitonMixin],
  components: { Common, ModuleTransition, Sidebar },

  data() {
    return {};
  },

  computed: {},

  mounted() {
    // console.log(Calendar);
  },

  methods: {},

  watch: {}
};
</script>

<style src="../styles/theme.styl" lang="stylus"></style>

<style lang="stylus" scoped>
.calendar-wrapper {
  margin: 0 auto;
  padding: 4.6rem 2.5rem 0;

  #calendar {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 5px;
    top: 64px;
  }
}

@media (max-width: $MQMobile) {
  .calendar-wrapper {
    padding: 4.6rem 1rem 0;
  }
}
</style>
