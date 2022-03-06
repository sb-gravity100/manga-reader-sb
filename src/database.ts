import Datastore from 'nedb-promises';
import { prop, getModelForClass } from '@typegoose/typegoose';

const db = Datastore.create({
   // inMemoryOnly: true,
   timestampData: true,
   filename: 'manga_data.nedb',
});

export const tags = Datastore.create({
   inMemoryOnly: true,
   //  timestampData: true,
   //  filename: 'artists_data.nedb',
});

export default db;
