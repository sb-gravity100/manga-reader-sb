import * as SQ from 'sequelize-typescript';
import * as types from '../types';
declare type MangaAttributes = types.Manga;
export declare class Manga extends SQ.Model<MangaAttributes> {
    id: number;
    name: string;
    pathname: string;
    size: number;
    cover: string;
    data: types.MangaData[];
    createdAt: Date;
}
export {};
