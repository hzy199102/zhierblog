<template>
  <label :style="{'background-color': checked ? '' : 'transparent'}">
    <input
      :class="'checkbox-'+type"
      type="checkbox"
      :value="value"
      v-bind:checked="checked"
      v-on:change="$emit('change', $event.target.checked)"
    />
    <span
      :style="{'border-color': type === 'square' ? '' : borderColor, 'background-color': type === 'square' ? '' : checked ? borderColor : 'transparent'}"
    ></span>
    <span>{{name}}</span>
  </label>
</template>

<script>
export default {
  model: {
    prop: "checked",
    event: "change"
  },
  components: {},
  name: "hzy_Checkbox",
  props: {
    type: {
      type: String,
      default: "square"
    },
    borderColor: {
      type: String,
      default: "#9d9d9d"
    },
    name: {
      type: String,
      default: ""
    },
    checked: {
      type: Boolean,
      default: false
    },
    value: {
      type: String,
      default: ""
    }
  },
  data() {
    return {};
  },
  filters: {},
  computed: {},
  methods: {},
  created() {},
  mounted() {}
};
</script>

<style lang="stylus">
label {
  margin-bottom: 0;
  cursor: pointer;
}

.checkbox-square {
  display: none;

  &:checked + span {
    background: url('image/ic-checkbox-checked.png') no-repeat;
  }

  & + span {
    display: inline-block;
    cursor: pointer;
    line-height: 14px;
    margin-right: 8px;
    width: 14px;
    height: 14px;
    background: url('image/ic-checkbox-normal.png') no-repeat;
    vertical-align: middle;

    & + span {
      vertical-align: bottom;
    }
  }
}

.checkbox-round {
  display: none;

  & + span {
    display: inline-block;
    cursor: pointer;
    width: 14px;
    height: 14px;
    line-height: 14px;
    vertical-align: middle;
    margin-right: 8px;
    border-radius: 8px;
    border: solid 2px;
    background: transparent;

    & + span {
      vertical-align: bottom;
    }
  }
}
</style>