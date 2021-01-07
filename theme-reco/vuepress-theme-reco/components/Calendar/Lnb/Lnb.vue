<template>
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
            <input class="tui-full-calendar-checkbox-square" type="checkbox" value="all" checked />
            <span></span>
            <strong>View all</strong>
          </label>
        </div>
      </div>
      <div id="calendarList" class="lnb-calendars-d1"></div>
    </div>
    <div class="lnb-footer">© NHN Corp.</div>
  </div>
</template>

<script>
import * as store_calendars from "@theme/components/Calendar/data/calendars.js";

export default {
  components: {},
  props: {
    pageInfo: {
      type: Object,
      default() {
        return {};
      }
    },
    currentTag: {
      type: String,
      default: ""
    },
    showAccessNumber: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
  },
  filters: {},
  methods: {},
  created() {
    // 在Calendars.vue中已经完成了store_calendars的初始化操作，这里直接使用，第三方插件vue化的数据共享的折中方案，本来应该放到vue-store中的。
    // console.log(store_calendars.CalendarList);
  },
  mounted() {
    var calendarList = document.getElementById("calendarList");
    var html = [];
    store_calendars.CalendarList.forEach(function(calendar) {
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
  }
};
</script>

<style lang="stylus" scoped></style>