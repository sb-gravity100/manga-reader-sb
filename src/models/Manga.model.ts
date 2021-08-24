import * as SQ from 'sequelize-typescript';
import * as types from '../types';

const { DataType } = SQ

type MangaAttributes = types.Manga;

@SQ.Table({
   tableName: 'manga_list'
})
export class Manga extends SQ.Model<MangaAttributes> {
   @SQ.PrimaryKey
   @SQ.AutoIncrement
   @SQ.Column
   id: number

   @SQ.Column
   name: string;

   @SQ.Column
   pathname: string;

   @SQ.Column
   size: number;

   @SQ.Column
   cover: string;

   @SQ.Column(DataType.VIRTUAL)
   data: types.MangaData[]

   @SQ.Column
   createdAt: Date
}
