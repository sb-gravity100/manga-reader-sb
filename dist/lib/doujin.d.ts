import * as nhentai from 'nhentai';
export declare var api: nhentai.API;
export declare function fetchThumbs(res: nhentai.Doujin): Promise<void>;
export declare function write(id: any): Promise<nhentai.Doujin | undefined>;
export declare function add(id: any): Promise<void>;
export declare function remove(id: any): Promise<number | false>;
export declare function tags(): Promise<nhentai.Tag[]>;
