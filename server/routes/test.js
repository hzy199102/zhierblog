const Router = require("koa-router");
const path = require("path");
const router = new Router({ prefix: "/test" });

router.get("/api", async (ctx) => {
  ctx.body = {
    code: 200,
    message: "我好中意你！",
  };
});

module.exports = router;
