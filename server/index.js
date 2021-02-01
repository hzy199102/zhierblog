/**
 * koa2 框架，不多说
 */
const Koa = require("koa");
const path = require("path");
/**
 * 静态资源
 */
const static = require("koa-static");

// const bodyparser = require('koa-bodyparser')

const app = new Koa();

const port = 8090;

// CORS是一个W3C标准，全称是"跨域资源共享"（Cross-origin resource sharing）。
// 下面以koa2-cors为例，
const cors = require("koa2-cors");

// 具体参数我们在后面进行解释
app.use(
  cors({
    origin: function(ctx) {
      if (ctx.url === "/test") {
        return "*"; // 允许来自所有域名请求
      }
      return "http://127.0.0.1:8080"; // 这样就能只允许 http://localhost:8080 这个域名的请求了
    },
    exposeHeaders: ["WWW-Authenticate", "Server-Authorization"],
    maxAge: 5,
    credentials: true,
    allowMethods: ["GET", "POST", "DELETE"],
    allowHeaders: ["Content-Type", "Authorization", "Accept"],
  })
);

// 错误处理中间件写在最上面
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    // 系统日志
    // console.log(error);
    // 给用户显示信息
    // ctx.status = error.statusCode || error.status || 500;
    // ctx.type = "json";
    ctx.type = "text";
    if (error.expose) {
      ctx.body = error.message;
    } else {
      ctx.body = error.stack;
    }

    // 全局错误处理
    ctx.app.emit("error", error);
  }
});

// 静态文件服务
// app.use(static(path.resolve("./client")));
// console.log(path.resolve("./client"));

// 导入路由文件
const test = require("./routes/test");
app.use(test.routes());

const api = require("./routes/api");
app.use(api.routes());

// 监听全局错误事件
app.on("error", (err) => {
  console.error(err);
});

// 监听端口
app.listen(port, function() {
  console.log(`server run as http://127.0.0.1:${port}`);
});
