<template>
  <div class="scheduleNew">
    <b-icon icon="x" aria-hidden="true" class="close-icon"></b-icon>
    <div class="item_row">
      <label class="item_row_label">日程分类：</label>
      <el-select v-model="scheduleInfo.calendarId" placeholder="请选择">
        <el-option v-for="item in CalendarList" :key="item.id" :label="item.name" :value="item.id">
          <span
            :style="{'vertical-align': 'middle', 'display': 'inline-block', 'background-color': item.bgColor, 'width': '12px', 'height': '12px', 'border-radius': '8px'}"
          ></span>
          <span
            style="vertical-align: middle; display: inline-block; margin-left: 10px; font-size: 12px"
          >{{ item.name }}</span>
        </el-option>
      </el-select>
    </div>
    <div class="item_row">
      <label class="item_row_label">日程类型：</label>
      <el-select v-model="scheduleInfo.category" placeholder="请选择">
        <el-option
          v-for="item in categoryList"
          :key="item.value"
          :label="item.name"
          :value="item.value"
        >{{ item.name }}</el-option>
      </el-select>
    </div>
    <div class="item_row">
      <label class="item_row_label">日程状态：</label>
      <el-select v-model="scheduleInfo.status" placeholder="请选择">
        <el-option
          v-for="item in statusList"
          :key="item.value"
          :label="item.name"
          :value="item.value"
        >{{ item.name }}</el-option>
      </el-select>
    </div>
    <div class="item_row">
      <label class="item_row_label">标题：</label>
      <el-input v-model="scheduleInfo.title" placeholder="请输入" style="width: 400px;"></el-input>
    </div>
    <div class="item_row">
      <label class="item_row_label">内容：</label>
      <el-input
        v-model="scheduleInfo.body"
        placeholder="请输入"
        type="textarea"
        :autosize="{ minRows: 4, maxRows: 6}"
        style="width: 400px;"
      ></el-input>
    </div>
    <div class="item_row">
      <label class="item_row_label">时间：</label>
      <el-date-picker
        v-model="scheduleInfo.startAndEnd"
        type="datetimerange"
        align="right"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :default-time="['12:00:00', '08:00:00']"
      ></el-date-picker>
    </div>
    <div class="item_row">
      <label class="item_row_label">备注：</label>
      <el-input
        v-model="scheduleInfo.note"
        placeholder="请输入"
        type="textarea"
        :autosize="{ minRows: 4, maxRows: 6}"
        style="width: 400px;"
      ></el-input>
    </div>
    <div class="item_row">
      <el-button
        type="primary"
        round
        size="small"
        style="float: right; margin-right: 50px;"
        @click="save"
      >保存</el-button>
      <div style="clear: both"></div>
    </div>
    <div style="width: 100%; height: 10px;"></div>
  </div>
</template>
<script>
import axios from "axios";
import {
  ScheduleInfo as model_schedule,
  categoryList,
  statusList
} from "@theme/model/schedule.js";
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
    return {
      scheduleInfo: new model_schedule(this.schedule),
      categoryList: categoryList,
      statusList: statusList
    };
  },

  computed: {},

  methods: {
    save() {
      axios
        .post("/schedule/new", this.scheduleInfo.toParams())
        .then(response => {
          this.scheduleInfo.calendarId = response.data.message.insertId;
        });
    }
  },

  created() {},

  mounted() {},

  watch: {}
};
</script>
<style lang="stylus">
.scheduleNew {
  width: 550px;

  .close-icon {
    position: absolute;
    right: 17px;
    cursor: pointer;
    font-size: 24px;
  }

  .item_row {
    margin-top: 10px;
  }

  .item_row_label {
    width: 80px;
    text-align: right;
    line-height: 40px;
    margin-right: 5px;
  }
}
</style>
