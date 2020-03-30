<template>
  <span :style="style_type">{{text}}</span>
</template>
<script>
export default {
  props: {
    type: {
      type: String,
      default: "success"
    }
  },
  computed: {
    text() {
      return this.type === "success" ? "（完成）" : "（未完成）";
    },
    style_type() {
      var obj = {};
      if (this.type === "success") {
        obj["color"] = "green";
      } else {
        obj["color"] = "red";
      }
      return obj;
    }
  }
};
</script>