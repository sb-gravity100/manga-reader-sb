require("dotenv").config();
require("express-async-errors");
import express from "express";
import { normalize, join } from "path";
import createError, { HttpError } from "http-errors";
import cors from "cors";
import logger from "morgan";
// import compression from "compression";
// import _ from "lodash";
import db2 from "./database";
import ApiRoute from "./api.route";
import { Debugger } from "debug";
console.log(process.cwd());

const { NODE_ENV, PORT = 7800 } = process.env;
const CWD = process.cwd();
const Join = (...dir: string[]) => normalize(join(CWD, ...dir));
const DJ_PATH = Join("../_dj/");
const port = PORT;
const ASSETS_PATH = Join("public/");
const debug: Debugger =
  NODE_ENV === "development" ? require("debug")("RD") : console.log;
debug("Starting...");
const isGitpod = /gitpod/i.test(process.env.USER as string);

const boot = async () => {
  console.log(isGitpod);
  const app = express();
  await db2.load();
  await db2.ensureIndex({
    fieldName: "id",
    unique: true,
  });
  // const mangaData = await dirSync();
  // await db.insert(mangaData);
  // debug('Database ready!');

  await new Promise<void>((res) => app.listen(Number(PORT), res));

  debug(`Server listening at %s`, port);

  return app;
};

boot()
  .then((app) => {
    app.use(cors() as any);
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(
      logger("dev", {
        skip: (req) => {
          if (req.url.length > 50) {
            return true;
          }
          return false;
        },
        stream: {
          write: (msg) => debug(msg.trimEnd()),
        },
      })
    );
    // app.use(compression());

    app.use("/gallery", express.static(DJ_PATH));

    app.use(express.static(ASSETS_PATH));

    app.get("/(*/)?", (_req, res) =>
      res.sendFile(join(ASSETS_PATH, "index.html"))
    );

    app.use("/api", ApiRoute);
    app.use((_req, _res, next) => next(createError(404)));
    app.use(
      (
        err: HttpError,
        _req: express.Request,
        res: express.Response,
        _next: express.NextFunction
      ) => {
        var error = {} as typeof err;
        for (var x in err) {
          error[x] = err[x];
        }
        // console.log(err);
        res.status(err.status || 500).send(error);
      }
    );
  })
  .catch(console.log);
