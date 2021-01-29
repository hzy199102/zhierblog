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
        console.log("INSERT ID:", result.id);

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

router.get("/schedule/list", async ctx => {
  var sql = "SELECT * FROM schedule";
  var result = await dbFuc_list(sql);

  ctx.body = {
    code: 200,
    message: result
  };
  // connection.end();
});

router.get("/schedule/new", async ctx => {
  var sql = "INSERT INTO schedule(title,calendarId) VALUES(?,?)";
  var params = ["hzy", "10001"];
  var result = await dbFuc_new(sql, params);

  ctx.body = {
    code: 200,
    message: result
  };
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
