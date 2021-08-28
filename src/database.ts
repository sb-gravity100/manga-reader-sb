import { DataStoreOptions } from 'nedb';
import Datastore from 'nedb-promises';
// import Ajv, { JSONSchemaType as Schema, ValidateFunction } from 'ajv';
// import addFormats from 'ajv-formats';

// type Document<T = Record<string, any>> = T & {
//    _id: string;
//    createdAt?: Date;
//    updatedAt?: Date;
// };

// type UpdateOperators<T = Document> = {
//    $inc?: Record<keyof T, number>;
//    $min?: Record<keyof T, number>;
//    $max?: Record<keyof T, number>;
//    $set?: Record<keyof T, T[keyof T]>;
//    $unset?: Record<keyof T, boolean>;
// };

// type FindOperators<T = Document> = {
//    $regex?: RegExp;
//    $lt?: T[keyof T];
//    $lte?: T[keyof T];
//    $gt?: T[keyof T];
//    $gte?: T[keyof T];
//    $in?: T[keyof T][];
//    $nin?: T[keyof T][];
//    $ne?: T[keyof T];
//    $stat?: boolean;
// };

// type ArrayOperators<T = Document> = {
//    $size?: number;
//    $elemMatch?: NormalFindOp<T>;
// };

// type LogicalOperators<T = Document> = {
//    $or?: NormalFindOp<T>[];
//    $and?: NormalFindOp<T>[];
//    $not?: NormalFindOp<T>;
//    $where?: (this: T) => boolean;
// };
// type NormalFindOp<T> = Partial<T> | FindOperators<T>;

// type FindOtherQuery = Record<
//    string,
//    ArrayOperators<Record<string, any>> | NormalFindOp<Record<string, any>>
// >;

// type FindQuery<T = Document> = {
//    [P in keyof T]: T[P] extends any[]
//       ? ArrayOperators<T[P]> & NormalFindOp<T[P]>
//       : NormalFindOp<T[P]>;
// } &
//    FindOtherQuery &
//    LogicalOperators<T>;

// type ProjectionQuery<T> = Record<keyof T, 1 | -1 | 0>;

// type Query<T> = string | number | FindQuery<T>;

// type UpdateOptions = {
//    returnUpdatedDocs?: boolean;
//    upsert?: boolean;
//    multi?: boolean;
// };

// const ajv = new Ajv();
// addFormats(ajv);

// class Model<T = Document> {
//    #datastore: Datastore;
//    #validator: ValidateFunction<T>;

//    constructor(schema: Schema<T>, options: string | DataStoreOptions) {
//       this.#datastore = Datastore.create(options);
//       this.#validator = ajv.compile(schema);
//    }

//    validate(data: any) {
//       if (!this.#validator) {
//          throw new Error('Schema has not been initialized yet.');
//       }
//       return this.#validator(data);
//    }

//    insert<K extends T | T[]>(docs: K): Promise<K> {
//       return this.#datastore.insert<K>(docs);
//    }

//    find(query: FindQuery<T>): Promise<T>;
//    find(query: FindQuery<T>, projection?: ProjectionQuery<T>): Promise<T> {
//       return this.#datastore.find<T>(query, projection as any);
//    }

//    findOne(query: Query<T>, projection?: ProjectionQuery<T>) {
//       if (typeof query === 'string' || typeof query === 'number') {
//          return this.#datastore.findOne<T>(
//             {
//                _id: query,
//             },
//             projection as any
//          );
//       }
//       return this.#datastore.findOne<T>(query, projection as any);
//    }

//    async update(
//       query: Query<T>,
//       update: UpdateOperators<T>,
//       options: UpdateOptions
//    ) {
//       if (typeof query === 'string' || typeof query === 'number') {
//          return this.#datastore.update<T>(
//             {
//                _id: query,
//             },
//             update,
//             options as any
//          );
//       }
//       return this.#datastore.update<T>(query, update, options as any);
//    }
// }

const db = new Datastore('data.db');

export default db;
