import Datastore from 'nedb-promises';

const db = new Datastore({
   // inMemoryOnly: true,
   // timestampData: true,
   filename: './data.db',
});

export default db;
