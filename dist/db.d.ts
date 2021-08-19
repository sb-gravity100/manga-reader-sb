import _ from 'lodash';
import { Low } from 'lowdb';
import { Manga } from './types';
interface LowDB<T> extends Low<T> {
    chain?(): _.ObjectChain<T>;
}
export interface Database {
    list: Manga[];
}
declare const db: LowDB<Database>;
export default db;
