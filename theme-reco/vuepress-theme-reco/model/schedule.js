"use strict";

/*eslint-disable*/

export var categoryList = [
  {
    name: "里程牌",
    value: "milestone"
  },
  {
    name: "任务",
    value: "task"
  },
  {
    name: "全天",
    value: "allday"
  },
  {
    name: "时间",
    value: "time"
  }
];

export var statusList = [
  {
    name: "计划中",
    value: "pending"
  },
  {
    name: "进行中",
    value: "doing"
  },
  {
    name: "完成",
    value: "finish"
  },
  {
    name: "放弃",
    value: "giving_up"
  }
];

export class ScheduleInfo {
  constructor(obj) {
    obj = obj || {};
    this.id = obj.id || null;
    this.calendarId = obj.calendarId || null;

    this.title = obj.title || null;
    this.body = obj.body || null;
    this.note = obj.note || null;
    this.startAndEnd = obj.startAndEnd || null;

    this.start = obj.start || null;
    this.end = obj.end || null;
    this.category = obj.category || null;

    this.color = obj.color || null;
    this.bgColor = obj.bgColor || null;
    this.dragBgColor = obj.dragBgColor || null;
    this.borderColor = obj.borderColor || null;
    this.customStyle = obj.customStyle || null;

    this.state = obj.state || null;
    this.status = obj.status || null;

    if (this.startAndEnd && this.startAndEnd.length === 2) {
      this.start = new Date(this.startAndEnd[0]).getTime();
      this.end = new Date(this.startAndEnd[1]).getTime();
    }
  }

  toParams() {
    if (this.startAndEnd && this.startAndEnd.length === 2) {
      this.start = new Date(this.startAndEnd[0]).getTime();
      this.end = new Date(this.startAndEnd[1]).getTime();
    }
    return this;
  }

  toCalendar(CalendarList) {
    var calendar;
    CalendarList.forEach(item => {
      if (item.id === this.calendarId) {
        calendar = item;
      }
    });
    if (calendar) {
      this.color = calendar.color;
      this.bgColor = calendar.bgColor;
      this.dragBgColor = calendar.bgColor;
      this.borderColor = calendar.borderColor;
    }
    // 里程碑只展示，无法拖拽操作
    if (this.category === "milestone") {
      this.color = this.bgColor;
      this.bgColor = "transparent";
      this.dragBgColor = "transparent";
      this.borderColor = "transparent";
    }
    return this;
  }
}
