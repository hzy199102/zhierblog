<template>
  <div class="scheduleNew">
    <b-icon icon="x" aria-hidden="true" class="close-icon"></b-icon>
    <!-- <b-form-select v-model="selected" :options="options"></b-form-select> -->
  </div>
</template>
<script>
export default {
  components: {},
  name: "scheduleNew",
  props: {
    schedule: {
      type: Object,
      default: () => {}
    },
    CalendarList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {};
  },

  computed: {
    options() {
      var obj = [];
      for (let i = 0; i < this.CalendarList.length; i++) {
        var item = this.CalendarList[i];
        obj.push({
          value: item.id,
          html: `<span style="background-color: ${item.bgColor}; width: 12px; height: 12px; border-radius: 8px;"></span><span>${item.name}</span>`
        });
      }
      return obj;
    }
  },

  methods: {},

  created() {},

  mounted() {},

  watch: {}
};
</script>
<style lang="stylus">
.scheduleNew {
  width: 474px;

  .close-icon {
    position: absolute;
    right: 17px;
    cursor: pointer;
    font-size: 24px;
  }
}
</style>
