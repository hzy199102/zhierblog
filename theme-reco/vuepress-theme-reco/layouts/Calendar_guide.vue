<template>
  <!-- 公共布局 -->
  <Common class="calendar-wrapper" :sidebar="false">
    <!-- 日历 -->
    <ModuleTransition>
        <div id="calendar"></div>
    </ModuleTransition>
  </Common>
</template>

<script>
import Common from "@theme/components/Common";
import { ModuleTransition } from "@vuepress-reco/core/lib/components";
import moduleTransitonMixin from "@theme/mixins/moduleTransiton";
import Calendar from "tui-calendar";
import "tui-calendar/dist/tui-calendar.css";


export default {
  mixins: [moduleTransitonMixin],
  components: { Common, ModuleTransition },

  data() {
    return {};
  },

  computed: {},

  mounted() {
    var calendar = new Calendar(document.getElementById('calendar'), {
    defaultView: 'week',
    taskView: true,    // Can be also ['milestone', 'task']
    scheduleView: true,  // Can be also ['allday', 'time']
    template: {
        milestone: function(schedule) {
            return '<span style="color:red;"><i class="fa fa-flag"></i> ' + schedule.title + '</span>';
        },
        milestoneTitle: function() {
            return 'Milestone';
        },
        task: function(schedule) {
            return '&nbsp;&nbsp;#' + schedule.title;
        },
        taskTitle: function() {
            return '<label><input type="checkbox" />Task</label>';
        },
        allday: function(schedule) {
            return schedule.title + ' <i class="fa fa-refresh"></i>';
        },
        alldayTitle: function() {
            return 'All Day';
        },
        time: function(schedule) {
            return schedule.title + ' <i class="fa fa-refresh"></i>' + schedule.start;
        }
    },
    month: {
        daynames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        startDayOfWeek: 0,
        narrowWeekend: true
    },
    week: {
        daynames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        startDayOfWeek: 0,
        narrowWeekend: true
    }
});
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
