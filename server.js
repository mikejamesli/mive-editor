import Koa from "koa";
import KoaBody from "koa-body";
import Logger from "koa-logger";
import KoaBodyParser from "koa-bodyparser";
import Router from "koa-router";
import fetch from "isomorphic-fetch";
import mount from "koa-mount";
import sendfile from "koa-sendfile";
import serve from "koa-static";
import path from "path";

const port = parseInt(process.env.PORT, 10) || 3002;
const server = new Koa();
const router = new Router();
const devRouter = new Router();
const api = new Koa();
const ui = new Koa();

server.use(Logger());
server.use(KoaBody({ multipart: true }));
server.use(KoaBodyParser());

api.use(router.routes());
api.use(router.allowedMethods());
server.use(mount("/api", api));

// In dev, proxy requests to the react app on localhost:3001
// In prod, use the genered bundle from the build folder
if (process.env.NODE_ENV === "production") {
  ui.use(serve("build"));
  ui.use(async ctx => {
    await sendfile(ctx, path.join(__dirname, "build/index.html"));
    if (!ctx.status) ctx.throw(404);
  });
  server.use(mount("/", ui));
} else {
  devRouter.get("/(.*)", async ctx => {
    ctx.body = await fetch(`http://localhost:3001/${ctx.request.url}`)
      .then(r => r.text())
      .catch(r => r);
  });
  server.use(devRouter.routes());
}

server.listen(port, () => {
  console.log(`> Ready on :${port}`);
});
