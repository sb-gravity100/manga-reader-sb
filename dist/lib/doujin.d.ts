import * as nhentai from 'nhentai';
export declare var api: nhentai.API;
export declare function add(id: any): Promise<void>;
export declare function remove(id: any): Promise<number | false>;
