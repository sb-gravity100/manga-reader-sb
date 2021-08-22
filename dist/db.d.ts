import _ from 'lodash';
import { Manga } from './types';
export interface Database {
    list: Manga[];
}
interface TimeStampOptions<C, U = undefined> {
    createdAt?: C;
    updatedAt?: U extends undefined ? C : U;
}
declare type TimeStamp = boolean | TimeStampOptions<boolean>;
declare type AnyObject = {
    [key: string]: any;
};
declare class JsonDB<T extends AnyObject = AnyObject> {
    private file;
    private createdAt?;
    private updatedAt?;
    private initialValue?;
    data: T;
    constructor(file: string, initialValue?: T, timestamp?: TimeStamp);
    read(): Promise<void>;
    write(data?: T): Promise<void>;
    get<K extends keyof T | string>(key: K | K[]): _.LoDashExplicitWrapper<any>;
    set<K extends keyof T | string>(key: K | K[], value: T[K]): _.ObjectChain<T>;
}
export declare const db: JsonDB<Database>;
export {};
