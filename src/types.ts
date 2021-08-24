export interface Manga {
  id?: string | number;
  name: string;
  pathname: string;
  createdAt: Date;
  size: number;
  data?: Array<MangaData>;
  cover?: string;
}

export interface MangaData {
  name: string;
  path: string;
}
