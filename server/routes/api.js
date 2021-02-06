const Router = require("koa-router");
const path = require("path");
const router = new Router({ prefix: "/api" });
// const chance = require("chance");

// https://www.cnblogs.com/skying555/p/8647617.html
// [日历组件]https://github.com/nhn/tui.calendar

const mysql = require("mysql");
const connConfig = require("../config/mysql.js");
const pool = mysql.createPool(connConfig);

const dbFuc_list = function(sql) {
  return new Promise(function(resolve, reject) {
    pool.getConnection(function(err, connection) {
      if (err) throw err;
      connection.query(sql, function(err, result) {
        if (err) {
          reject("[SELECT ERROR] - ", err.message);
          return;
        }
        //回收pool
        connection.release();
        resolve(result);
      });
    });
  });
};

const dbFuc_new = function(sql, params) {
  return new Promise(function(resolve, reject) {
    pool.getConnection(function(err, connection) {
      if (err) throw err;
      connection.query(sql, params, function(err, result) {
        if (err) {
          console.log(err);
          reject("[INSERT ERROR] - ", err.message);
          return;
        }
        console.log("INSERT ID:", result.insertId);

        //回收pool
        connection.release();
        resolve(result);
      });
    });
  });
};

router.get("/calendar/list", async ctx => {
  var sql = "SELECT * FROM calendar";
  var result = await dbFuc_list(sql);

  ctx.body = {
    code: 200,
    message: result
  };
  // connection.end();
});

const schedule = [
  "calendarId",
  "title",
  "body",
  "note",
  "start",
  "end",
  "category",
  "state",
  "status"
];

router.get("/schedule/list", async ctx => {
  console.log(ctx.query);
  var sql = "SELECT * FROM schedule where 1=1";
  if (ctx.query.start) {
    sql += ` and start >= ${ctx.query.start}`;
  }
  if (ctx.query.end) {
    sql += ` and end < ${ctx.query.end}`;
  }
  console.log(sql);
  var result = await dbFuc_list(sql);

  ctx.body = {
    code: 200,
    message: result
  };
  // connection.end();
});

router.post("/schedule/new", async ctx => {
  console.log(ctx.request.body);

  var sql = "INSERT INTO schedule";
  for (var i = 0; i < schedule.length; i++) {
    if (i === 0) {
      sql += "(";
    }
    sql += schedule[i];
    if (i !== schedule.length - 1) {
      sql += ",";
    } else {
      sql += ")";
    }
  }
  sql += " values ?";
  var arrValues = [];
  for (var i = 0; i < schedule.length; i++) {
    if (typeof ctx.request.body[schedule[i]] !== "undefined") {
      arrValues.push(ctx.request.body[schedule[i]]);
    } else {
      arrValues.push(null);
    }
  }
  var result = await dbFuc_new(sql, [[arrValues]]);
  ctx.body = {
    code: 200,
    message: result
  };
  // var sql = "INSERT INTO schedule(title,calendarId) VALUES(?,?)";
  // var params = ["hzy", "10001"];
  // var result = await dbFuc_new(sql, params);

  // ctx.body = {
  //   code: 200,
  //   message: result,
  // };
  // connection.end();
});

router.get("/schedule/update", async ctx => {
  var sql = "UPDATE schedule SET title = ? WHERE id = 10000";
  var params = ["hzy2"];
  var result = await dbFuc_new(sql, params);

  ctx.body = {
    code: 200,
    message: result
  };
  // connection.end();
});

module.exports = router;
