import { DataStoreOptions } from 'nedb';
import Datastore from 'nedb-promises';
import Ajv, { JSONSchemaType as Schema, ValidateFunction } from 'ajv';
import addFormats from 'ajv-formats';

type Document<T = Record<string, any>> = T & {
   _id: string;
   createdAt?: Date;
   updatedAt?: Date;
};

type UpdateOperators<T = Document> = {
   $inc?: Record<keyof T, number>;
   $min?: Record<keyof T, number>;
   $max?: Record<keyof T, number>;
   $set?: Record<keyof T, T[keyof T]>;
   $unset?: Record<keyof T, boolean>;
};

type FindOperators<T = Document> = {
   $regex?: RegExp;
   $lt?: T[keyof T];
   $lte?: T[keyof T];
   $gt?: T[keyof T];
   $gte?: T[keyof T];
   $in?: T[keyof T][];
   $nin?: T[keyof T][];
   $ne?: T[keyof T];
   $stat?: boolean;
};

type ArrayOperators<T = Document> = {
   $size?: number;
   $elemMatch?: NormalFindOp<T>;
};

type LogicalOperators<T = Document> = {
   $or?: NormalFindOp<T>[];
   $and?: NormalFindOp<T>[];
   $not?: NormalFindOp<T>;
   $where?: (this: T) => boolean;
};

type DotNotationQuery<T> = {
   [x: string]?: any;
};

type NormalFindOp<T> = Partial<T> | FindOperators<T>;

type FindQuery<T = Document> = {
   [P in keyof T]: T[P] extends any[]
      ? ArrayOperators<T[P]> | NormalFindOp<T[P]>
      : NormalFindOp<T[P]>;
} &
   DotNotationQuery<T> &
   LogicalOperators<T>;

type ProjectionQuery<T> = {
   [P in T]?: 1 | -1 | 0
}

const ajv = new Ajv();
addFormats(ajv);

class Model<T = Document> {
   private _datastore: Datastore;
   private _validator: ValidateFunction<T>;

   constructor(options: string | DataStoreOptions) {
      this._datastore = Datastore.create(options);
   }

   validate<K extends T>(data: K) {
      if (!this._validator) {
         throw new Error('Schema has not been initialized yet.');
      }
      return this._validator(data);
   }

   createSchema<S extends T>(schema: Schema<S>) {
      this._validator = ajv.compile(schema);
   }

   insert(docs: T | T[]) {
      return this._datastore.insert(docs);
   }

   find<K extends T>(query: FindQuery<K>, projection: ProjectionQuery<K>) {
      return this._datastore.find<K>(query, projection)
   }
}

type test = {
   ho: string;
   nice: number;
   person: {
      shit: string;
   };
   arr: Omit<test, 'arr'>[];
};

var query: FindQuery<test> = {
   arr: {},
};
