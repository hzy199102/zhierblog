const Router = require("koa-router");
const path = require("path");
const router = new Router({ prefix: "/test" });
// const chance = require("chance");

// https://www.cnblogs.com/skying555/p/8647617.html
// [日历组件]https://github.com/nhn/tui.calendar

const mysql = require("mysql");
const connConfig = require("../config/mysql.js");
const pool = mysql.createPool(connConfig);

const dbFuc = function(sql) {
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

router.get("/api", async ctx => {
  ctx.body = {
    code: 200,
    message: "错在陈醋当成墨，写尽半生纸上酸。"
  };
});

router.get("/socre/list", async ctx => {
  var sql = "SELECT * FROM websites";
  var result = await dbFuc(sql);

  ctx.body = {
    code: 200,
    message: result
  };
  // connection.end();
});

module.exports = router;
