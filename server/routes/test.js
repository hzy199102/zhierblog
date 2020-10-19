const Router = require("koa-router");
const path = require("path");
const router = new Router({ prefix: "/test" });

router.get("/api", async (ctx) => {
  console.log(111);
  ctx.body = {
    code: 200,
    message: "这是api接口",
  };
});

module.exports = router;
