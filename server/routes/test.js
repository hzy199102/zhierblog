const Router = require("koa-router");
const path = require("path");
const router = new Router({ prefix: "/test" });

// https://www.cnblogs.com/skying555/p/8647617.html

const mysql = require("mysql");
const connConfig = require("../config/mysql.js");
const connection = mysql.createConnection(connConfig);

const dbFuc = function(sql) {
  return new Promise(function(resolve, reject) {
    connection.connect();
    connection.query(sql, function(err, result) {
      if (err) {
        reject("[SELECT ERROR] - ", err.message);
        return;
      }
      // reject(111);
      resolve(result);
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
  var sql = "SELECT * FROM score";
  var result = await dbFuc(sql);

  ctx.body = {
    code: 200,
    message: result
  };
  // connection.end();
});

module.exports = router;
