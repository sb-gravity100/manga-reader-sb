import { Router } from 'express';
import db from './database';
import _ from 'lodash';
import Fuse from 'fuse.js';
import * as types from './types';
import * as doujin from './lib/doujin';

const route = Router();

export default route;

route.get('/manga', async (req, res) => {
   var exist = await db.findOne({
      id: Number(req.query.id)
   })
   if (exist) {
      
   }
})

route.get('/save', async (req, res) => {
   var exist = await db.findOne({
      id: Number(req.query.id)
   })
   console.log(exist)
   if (exist) {
      return res.status(400).json(false)
   }
   await doujin.add(req.query.id)
   res.status(201).json(true)
})

route.get('/remove', async (req, res) => {
   var _res = await doujin.remove(req.query.id)
   res.status(_res ? 200 : 204).json(_res)
})
