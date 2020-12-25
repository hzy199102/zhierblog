<template>
  <!-- 公共布局 -->
  <Common class="calendar-wrapper" :sidebar="false">
    <!-- 日历 -->
    <ModuleTransition>
      <div>this is calendar</div>
    </ModuleTransition>
  </Common>
</template>

<script>
import Common from "@theme/components/Common";
import { ModuleTransition } from "@vuepress-reco/core/lib/components";
import moduleTransitonMixin from "@theme/mixins/moduleTransiton";
import Calendar from "tui-calendar";
import "tui-calendar/dist/tui-calendar.css";

// If you use the default popups, use this.
import "tui-date-picker/dist/tui-date-picker.css";
import "tui-time-picker/dist/tui-time-picker.css";

export default {
  mixins: [moduleTransitonMixin],
  components: { Common, ModuleTransition },

  data() {
    return {};
  },

  computed: {},

  mounted() {
    console.log(Calendar);
  },

  methods: {},

  watch: {}
};
</script>

<style src="../styles/theme.styl" lang="stylus"></style>

<style lang="stylus" scoped>
.calendar-wrapper {
  max-width: $contentWidth;
  margin: 0 auto;
  padding: 4.6rem 2.5rem 0;
}

@media (max-width: $MQMobile) {
  .calendar-wrapper {
    padding: 4.6rem 1rem 0;
  }
}
</style>
