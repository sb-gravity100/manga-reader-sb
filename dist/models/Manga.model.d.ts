import * as SQ from 'sequelize-typescript';
import * as types from '../types';
declare type MangaAttributes = Partial<Omit<types.Manga, 'data'>>;
export declare class Manga extends SQ.Model<MangaAttributes> {
    id: number;
    name: string;
    pathname: string;
    size: number;
    cover: string;
    createdAt: Date;
}
export {};
