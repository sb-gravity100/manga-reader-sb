import { Router } from "express";
import db from "./database";
import _ from "lodash";
import nhentai from "nhentai";
import * as doujin from "./lib/doujin";
import errors from "http-errors";
import Queue from 'queue'

var route = Router();
var online = Router();
var q = new Queue({
  concurrency: 3,
  autostart: true
})

export default route;
route.use("/online", online);

var searchByValues = ["artist", "tag", "language", "category", "parody"];

route.get("/search", async (req, res) => {
  var query = req.query.q as string;
  var by = req.query.by as string;
  var result = [] as any;
  if (!query) {
    throw new errors.Forbidden("No Input");
  }
  var reg = new RegExp(query, "ig");
  if (by && searchByValues.includes(by.toLowerCase())) {
    result = await db.find({
      "tags.all": {
        $elemMatch: {
          type: by.toLowerCase(),
          name: reg,
        },
      },
    });
  } else {
    result = await db.find({
      $or: [
        {
          "titles.japanese": reg,
        },
        {
          "titles.pretty": reg,
        },
        {
          "titles.english": reg,
        },
      ],
    });
  }
  res.json(result);
});
route.get("/mangas", async (req, res) => {
  var { limit = 10, page = 1 } = req.query as any;
  var mangas = db.find({}, { raw: 0 });
  var total = await db.count({});
  if (limit) {
    limit = Number(limit);
    mangas = mangas.limit(limit);
  }
  if (page) {
    page = Number(page);
    mangas = mangas.skip(limit * (page - 1));
  }
  res.json({
    doujins: (await mangas.exec()) as any,
    doujinsPerPage: limit,
    numPages: Math.ceil(total / limit),
  } as nhentai.SearchResult);
});

route.get("/manga", async (req, res) => {
  var exist = await db.findOne(
    {
      id: Number(req.query.id),
    },
    { raw: 0 }
  );
  if (exist) {
    res.json(exist);
  } else {
    throw new errors.NotFound("Manga not found!");
  }
});

route.get("/save", async (req, res) => {
  q.push(async (cb: any) => {
    var id = Number(req.query.id);
    var exist = await db.findOne({
      id,
    });
    if (exist) {
      cb(new errors.Conflict("Already exist"))
    }
    await doujin.add(id);
    exist = await db.findOne({
      id,
    });
    res.status(201).json(exist);
    cb(null, exist)
  })
});

route.get("/remove", async (req, res) => {
  var _res = await doujin.remove(req.query.id);
  if (_res) {
    res.json(_res);
  } else {
    throw new errors.NotFound(_res as any);
  }
});

online.get("/search", async (req, res) => {
  var { q, page, sort } = req.query;
  if (!q) {
    throw new errors.Forbidden("No Input");
  }
  var search = await doujin.api.search(
    q as string,
    page as string,
    sort as any
  );
  res.json(search);
});

online.get("/manga", async (req, res) => {
  var { id } = req.query;
  if (!id) {
    throw new errors.Forbidden("No Input");
  }
  var manga = (await doujin.api.fetchDoujin(id as any)) as any;
  if (!manga) {
    throw new errors.NotFound("Manga not found");
  }
  var isOffline = await db.find({ id: manga.id });
  res.json({ ...manga, availableOffline: Boolean(isOffline) });
});

online.get("/homepage", async (req, res) => {
  var { page, sort } = req.query;
  var search = await doujin.api.fetchHomepage(page as string, sort as any);
  res.json(search);
});
