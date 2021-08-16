import _ from 'lodash';
import { Low, JSONFile } from 'lowdb';
import path from 'path';
import { Manga } from './types';

interface LowDB<T> extends Low<T> {
   chain?(): _.ObjectChain<T>;
}

export interface Database {
   list: Manga[];
}

const adapter = new JSONFile<Database>(path.join(__dirname, 'DATA.json'));
const db: LowDB<Database> = new Low(adapter);
db.chain = () => _.chain(db.data);

export default db;
