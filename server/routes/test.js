const Router = require("koa-router");
const path = require("path");
const router = new Router({ prefix: "/test" });

router.get("/api", async ctx => {
  ctx.body = {
    code: 200,
    message: "错在陈醋当成墨，写尽半生纸上酸。"
  };
});

module.exports = router;
