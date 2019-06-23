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
import { ETAILERS_ROLE } from "./lib/config";
import projectRouter from "./routes/projects";
import stringRouter from "./routes/strings";
import Session from "./routes/authenticate";

const port = parseInt(process.env.PORT, 10) || 3000;
const server = new Koa();
const router = new Router();
const devRouter = new Router();
const api = new Koa();
const ui = new Koa();

server.use(Logger());
server.use(KoaBody({ multipart: true }));
server.use(KoaBodyParser());
server.use(Session());

router.get("/sso", async ctx => {
  const { ticket } = ctx.query;
  const resp = await fetch(`${process.env.SEM_URL}/api/v1/sso/validate`, {
    method: "POST",
    headers: {
      Authorization: `AppAuthToken ${process.env.SEM_APP_AUTH_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      ticket
    })
  }).then(r => r.json());

  if (resp.session) {
    const url = `${process.env.SEM_URL}/api/v1/users/${
      resp.session
    }?scope=roles`;

    const config = {
      method: "GET",
      headers: {
        Authorization: `AppAuthToken ${process.env.SEM_APP_AUTH_TOKEN}`,
        "Content-Type": "application/json"
      }
    };
    const roles = await fetch(url, config).then(r => r.json());

    if (roles && !roles.roles.includes(ETAILERS_ROLE)) {
      ctx.redirect("/noright");
    } else {
      ctx.cookies.set("session", resp.session, { httpOnly: false });
      ctx.cookies.set("semID", resp.id, { httpOnly: false });
      ctx.cookies.set("username", resp.username, { httpOnly: false });
      ctx.redirect("/");
    }
  } else {
    ctx.cookies.set("session", null);
    ctx.redirect("/");
  }
});

api.use(projectRouter);
api.use(stringRouter);
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
    ctx.body = await fetch(`${process.env.DEVFE}${ctx.request.url}`)
      .then(r => r.text())
      .catch(r => r);
  });
  server.use(devRouter.routes());
}

server.listen(port, () => {
  console.log(`> Ready on :${port}`);
});
