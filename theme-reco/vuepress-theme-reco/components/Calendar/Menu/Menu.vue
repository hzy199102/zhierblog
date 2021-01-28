<template>
  <div id="menu">
    <b-dropdown variant="hzy_noclass" toggle-class="btn btn-default btn-sm">
      <template #button-content>
        <b-icon :icon="menuIcon" aria-hidden="true" class="menu-icon"></b-icon>
        <span class="menu-txt">{{menuTxt}}</span>
      </template>
      <b-dropdown-item @click="menuChange(item)" v-for="item in menuRadioList" :key="item.action">
        <b-icon :icon="item.menuIcon" aria-hidden="true" class="menu-icon"></b-icon>
        <span class="menu-txt">{{item.menuTxt}}</span>
      </b-dropdown-item>
      <b-dropdown-divider></b-dropdown-divider>
      <b-dropdown-item
        link-class="menu-calendars-item"
        v-for="item in menuCheckboxList"
        :key="item.action"
        @click="menuChange(item)"
      >
        <hzy_Checkbox type="square" :name="item.name" :checked="item.checked" :value="item.action"></hzy_Checkbox>
      </b-dropdown-item>
    </b-dropdown>
    <button type="button" class="btn btn-default btn-sm" @click="move('move-today')">Today</button>
    <button type="button" class="btn btn-default btn-sm" @click="move('move-prev')">
      <b-icon icon="chevron-left" aria-hidden="true" class="menu-icon" style="margin-top: 0px;"></b-icon>
    </button>
    <button type="button" class="btn btn-default btn-sm" @click="move('move-next')">
      <b-icon icon="chevron-right" aria-hidden="true" class="menu-icon" style="margin-top: 0px;"></b-icon>
    </button>
    <span class="render-range">{{ renderRangeText }}</span>
  </div>
</template>
<script>
import hzy_Checkbox from "@theme/components/Checkbox/Checkbox.vue";
export default {
  mixins: [],
  components: { hzy_Checkbox },
  props: {
    renderRangeText: {
      type: String,
      default: "未知时间"
    }
  },
  data() {
    return {
      menuIcon: "award",
      menuTxt: "weekly",
      menuRadioList: [
        {
          menuIcon: "award",
          menuTxt: "Daily",
          action: "toggle-daily"
        },
        {
          menuIcon: "award",
          menuTxt: "Weekly",
          action: "toggle-weekly"
        },
        {
          menuIcon: "award",
          menuTxt: "Month",
          action: "toggle-monthly"
        },
        {
          menuIcon: "award",
          menuTxt: "2 weeks",
          action: "toggle-weeks2"
        },
        {
          menuIcon: "award",
          menuTxt: "3 weeks",
          action: "toggle-weeks3"
        }
      ],
      menuCheckboxList: [
        {
          name: "Show weekends",
          checked: false,
          action: "toggle-workweek"
        },
        {
          name: "Start Week on Monday",
          checked: false,
          action: "toggle-start-day-1"
        },
        {
          name: "Narrower than weekdays",
          checked: false,
          action: "toggle-narrow-weekend"
        }
      ],
      checked: {
        workweek: false,
        "start-day-1": false,
        "narrow-weekend": false
      }
    };
  },

  computed: {},

  methods: {
    menuChange(item) {
      if (item.menuTxt) {
        this.menuIcon = item.menuIcon;
        this.menuTxt = item.menuTxt;
      } else {
        item.checked = !item.checked;
      }
      this.$emit("menuChange", item);
    },
    move(action) {
      this.$emit("move", action);
    }
  },

  created() {},

  mounted() {
    // this.$root.$on("bv::dropdown::hide", bvEvent => {
    //   if (bvEvent.componentId === "dropdown-2") {
    //     this.isDropdown2Visible = false;
    //   }
    //   if (this.isDropdown2Visible) {
    //     bvEvent.preventDefault();
    //   }
    // });
  },

  watch: {}
};
</script>

<style lang="stylus">
#menu {
  font-size: 14px;
  padding: 10px;

  .dropdown-item {
    padding: 0 1rem;
  }

  .menu-icon {
    font-size: 14px;
    vertical-align: middle;
    display: inline-block;
    margin-top: -4px;
  }

  .menu-txt {
    display: inline-block;
    width: 80px;
    font-size: 14px;
    margin-left: 6px;
  }

  .menu-calendars-item {
    .checkbox-square {
      & + span {
        & + span {
          vertical-align: middle;
        }
      }
    }
  }

  .render-range {
    padding-left: 12px;
    font-size: 19px;
    vertical-align: middle;
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
}
</style>