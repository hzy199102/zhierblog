<template>
  <div id="lnb">
    <div class="lnb-new-schedule">
      <button
        id="btn-new-schedule"
        type="button"
        class="btn btn-default btn-block lnb-new-schedule-btn"
        @click="$emit('new')"
      >新建行程</button>
    </div>
    <div id="lnb-calendars" class="lnb-calendars" @change="onChangeCalendars">
      <div>
        <div class="lnb-calendars-item">
          <hzy_Checkbox type="square" name="View all" :checked="allChecked" value="all"></hzy_Checkbox>
        </div>
      </div>
      <div id="calendarList" class="lnb-calendars-d1">
        <div class="lnb-calendars-item" v-for="calendar in CalendarList" :key="calendar.id">
          <hzy_Checkbox
            type="round"
            :borderColor="calendar.borderColor"
            :name="calendar.name"
            :checked="calendar.checked"
            :value="calendar.id"
          ></hzy_Checkbox>
        </div>
      </div>
    </div>
    <div class="lnb-footer">© 止耳</div>
  </div>
</template>

<script>
import hzy_Checkbox from "@theme/components/Checkbox/Checkbox.vue";
export default {
  components: { hzy_Checkbox },
  name: "Lnb",
  props: {
    CalendarList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {};
  },
  filters: {},
  computed: {
    allChecked() {
      return this.CalendarList.every(function(calendar) {
        return calendar.checked;
      });
    }
  },
  methods: {
    onChangeCalendars(e) {
      var calendarId = e.target.value;
      var checked = e.target.checked;
      this.$emit("change", {
        id: calendarId,
        checked: checked
      });
    }
  },
  created() {},
  mounted() {}
};
</script>

<style lang="stylus">
#lnb {
  font-family: 'Noto Sans', sans-serif;
  font-size: 12px;
  border-right: 1px solid var(--border-color);
  padding: 12px 10px;
  background: var(--background-color);

  .lnb-footer {
    color: #999;
    font-size: 11px;
    position: absolute;
    bottom: 12px;
    padding-left: 16px;
  }

  .lnb-new-schedule {
    padding-bottom: 12px;
    border-bottom: 1px solid var(--border-color);
  }

  .btn {
    border-radius: 25px;
    border-color: #ddd;
  }

  .btn:hover {
    border: solid 1px #bbb;
    background-color: #fff;
  }

  .btn:active {
    background-color: #f9f9f9;
    border: solid 1px #bbb;
    outline: none;
  }

  .btn:disabled {
    background-color: #f9f9f9;
    border: solid 1px #ddd;
    color: #bbb;
  }

  .btn:focus:active, .btn:focus, .btn:active {
    outline: none;
  }

  label {
    margin-bottom: 0;
    cursor: pointer;
  }

  .lnb-new-schedule-btn {
    height: 100%;
    font-size: 14px;
    background-color: #ff6618;
    color: #ffffff;
    border: 0;
    border-radius: 25px;
    padding: 10px 20px;
    font-weight: bold;
  }

  .lnb-new-schedule-btn:hover {
    height: 100%;
    font-size: 14px;
    background-color: #e55b15;
    color: #ffffff;
    border: 0;
    border-radius: 25px;
    padding: 10px 20px;
    font-weight: bold;
  }

  .lnb-new-schedule-btn:active {
    height: 100%;
    font-size: 14px;
    background-color: #d95614;
    color: #ffffff;
    border: 0;
    border-radius: 25px;
    padding: 10px 20px;
    font-weight: bold;
  }

  .lnb-calendars > div {
    padding: 12px 16px;
    border-bottom: 1px solid #e5e5e5;
    font-weight: normal;
  }

  .lnb-calendars-d1 {
    padding-left: 8px;
  }

  .lnb-calendars-d1 label {
    font-weight: normal;
  }

  .lnb-calendars-item {
    min-height: 14px;
    line-height: 14px;
    padding: 8px 0;
  }
}
</style>