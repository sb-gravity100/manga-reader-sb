import Datastore from 'nedb-promises';

const db = Datastore.create({
   // inMemoryOnly: true,
   timestampData: true,
   filename: 'data.db',
});

export const db2 = Datastore.create({
   // inMemoryOnly: true,
   timestampData: true,
   filename: 'data2.db',
});

export default db;
