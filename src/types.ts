import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { Manga as MangaModel } from './models';
import { ApolloContext } from './database';
export type Maybe<T> = T | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export interface Scalars {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
}


export interface Manga {
  id?: Maybe<Scalars['ID']>;
  name: Scalars['String'];
  pathname: Scalars['String'];
  createdAt: Scalars['DateTime'];
  size: Scalars['Int'];
  data?: Maybe<Array<MangaData>>;
  cover?: Maybe<Scalars['String']>;
}

export interface MangaData {
  name: Scalars['String'];
  path: Scalars['String'];
}

export interface Query {
  mangas?: Maybe<Array<Manga>>;
  manga?: Maybe<Manga>;
  search?: Maybe<Array<Manga>>;
  total?: Maybe<Scalars['Int']>;
  update?: Maybe<Scalars['Boolean']>;
}


export interface QueryMangasArgs {
  sort?: Maybe<Array<Maybe<Scalars['String']>>>;
  limit?: Maybe<Scalars['Int']>;
  cursor?: Maybe<Scalars['Int']>;
  refresh?: Maybe<Scalars['Boolean']>;
}


export interface QueryMangaArgs {
  id: Scalars['ID'];
}


export interface QuerySearchArgs {
  term?: Maybe<Scalars['String']>;
}



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>;
  Manga: ResolverTypeWrapper<MangaModel>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  MangaData: ResolverTypeWrapper<MangaData>;
  Query: ResolverTypeWrapper<{}>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  DateTime: Scalars['DateTime'];
  Manga: MangaModel;
  ID: Scalars['ID'];
  String: Scalars['String'];
  Int: Scalars['Int'];
  MangaData: MangaData;
  Query: {};
  Boolean: Scalars['Boolean'];
};

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type MangaResolvers<ContextType = ApolloContext, ParentType extends ResolversParentTypes['Manga'] = ResolversParentTypes['Manga']> = {
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  pathname?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  size?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  data?: Resolver<Maybe<Array<ResolversTypes['MangaData']>>, ParentType, ContextType>;
  cover?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MangaDataResolvers<ContextType = ApolloContext, ParentType extends ResolversParentTypes['MangaData'] = ResolversParentTypes['MangaData']> = {
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  path?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = ApolloContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  mangas?: Resolver<Maybe<Array<ResolversTypes['Manga']>>, ParentType, ContextType, RequireFields<QueryMangasArgs, 'sort' | 'cursor' | 'refresh'>>;
  manga?: Resolver<Maybe<ResolversTypes['Manga']>, ParentType, ContextType, RequireFields<QueryMangaArgs, 'id'>>;
  search?: Resolver<Maybe<Array<ResolversTypes['Manga']>>, ParentType, ContextType, RequireFields<QuerySearchArgs, never>>;
  total?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  update?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
};

export type Resolvers<ContextType = ApolloContext> = {
  DateTime?: GraphQLScalarType;
  Manga?: MangaResolvers<ContextType>;
  MangaData?: MangaDataResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
};

