"use strict";

/* eslint-disable require-jsdoc, no-unused-vars */

export function CalendarInfo() {
  this.id = null;
  this.name = null;
  this.checked = true;
  this.color = null;
  this.bgColor = null;
  this.borderColor = null;
  this.dragBgColor = null;
}

export function addCalendar(CalendarList, calendar) {
  CalendarList.push(calendar);
}

export function findCalendar(CalendarList, id) {
  var found;

  CalendarList.forEach(function(calendar) {
    if (calendar.id === id) {
      found = calendar;
    }
  });

  return found || CalendarList[0];
}

export function hexToRGBA(hex) {
  var radix = 16;
  var r = parseInt(hex.slice(1, 3), radix),
    g = parseInt(hex.slice(3, 5), radix),
    b = parseInt(hex.slice(5, 7), radix),
    a = parseInt(hex.slice(7, 9), radix) / 255 || 1;
  var rgba = "rgba(" + r + ", " + g + ", " + b + ", " + a + ")";

  return rgba;
}

export function init() {
  var CalendarList = [];

  var calendar;
  var id = 0;

  calendar = new CalendarInfo();
  id += 1;
  calendar.id = String(id);
  calendar.name = "工作";
  calendar.color = "#ffffff";
  calendar.bgColor = "#9e5fff";
  calendar.dragBgColor = "#9e5fff";
  calendar.borderColor = "#9e5fff";
  addCalendar(CalendarList, calendar);

  calendar = new CalendarInfo();
  id += 1;
  calendar.id = String(id);
  calendar.name = "健身";
  calendar.color = "#ffffff";
  calendar.bgColor = "#00a9ff";
  calendar.dragBgColor = "#00a9ff";
  calendar.borderColor = "#00a9ff";
  addCalendar(CalendarList, calendar);

  calendar = new CalendarInfo();
  id += 1;
  calendar.id = String(id);
  calendar.name = "学习";
  calendar.color = "#ffffff";
  calendar.bgColor = "#ff5583";
  calendar.dragBgColor = "#ff5583";
  calendar.borderColor = "#ff5583";
  addCalendar(CalendarList, calendar);

  calendar = new CalendarInfo();
  id += 1;
  calendar.id = String(id);
  calendar.name = "行程";
  calendar.color = "#ffffff";
  calendar.bgColor = "#03bd9e";
  calendar.dragBgColor = "#03bd9e";
  calendar.borderColor = "#03bd9e";
  addCalendar(CalendarList, calendar);

  calendar = new CalendarInfo();
  id += 1;
  calendar.id = String(id);
  calendar.name = "备忘录";
  calendar.color = "#ffffff";
  calendar.bgColor = "#bbdc00";
  calendar.dragBgColor = "#bbdc00";
  calendar.borderColor = "#bbdc00";
  addCalendar(CalendarList, calendar);

  calendar = new CalendarInfo();
  id += 1;
  calendar.id = String(id);
  calendar.name = "复盘";
  calendar.color = "#ffffff";
  calendar.bgColor = "#9d9d9d";
  calendar.dragBgColor = "#9d9d9d";
  calendar.borderColor = "#9d9d9d";
  addCalendar(CalendarList, calendar);

  calendar = new CalendarInfo();
  id += 1;
  calendar.id = String(id);
  calendar.name = "目标";
  calendar.color = "#ffffff";
  calendar.bgColor = "#ffbb3b";
  calendar.dragBgColor = "#ffbb3b";
  calendar.borderColor = "#ffbb3b";
  addCalendar(CalendarList, calendar);

  calendar = new CalendarInfo();
  id += 1;
  calendar.id = String(id);
  calendar.name = "开销";
  calendar.color = "#ffffff";
  calendar.bgColor = "#ff4040";
  calendar.dragBgColor = "#ff4040";
  calendar.borderColor = "#ff4040";
  addCalendar(CalendarList, calendar);

  return CalendarList;
}
