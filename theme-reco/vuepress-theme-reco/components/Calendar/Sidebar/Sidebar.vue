<template>
  <div id="lnb">
    <div class="lnb-new-schedule">
      <button
        id="btn-new-schedule"
        type="button"
        class="btn btn-default btn-block lnb-new-schedule-btn"
        data-toggle="modal"
      >New schedule</button>
    </div>
    <div id="lnb-calendars" class="lnb-calendars">
      <div>
        <div class="lnb-calendars-item">
          <label>
            <input class="tui-full-calendar-checkbox-square" type="checkbox" value="all" checked />
            <span></span>
            <strong>View all</strong>
          </label>
        </div>
      </div>
      <div id="calendarList" class="lnb-calendars-d1"></div>
    </div>
    <div class="lnb-footer">© NHN Corp.</div>
  </div>
</template>