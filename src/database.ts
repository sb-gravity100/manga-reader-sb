import Datastore from 'nedb-promises';

const db = Datastore.create({
   // inMemoryOnly: true,
   timestampData: true,
   filename: 'manga_data.nedb',
});

export default db;
