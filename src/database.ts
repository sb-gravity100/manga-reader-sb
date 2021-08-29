import Datastore from 'nedb-promises';

const db = new Datastore('data.db');

export default db;
