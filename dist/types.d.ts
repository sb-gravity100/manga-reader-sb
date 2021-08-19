import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export declare type Maybe<T> = T | null;
export declare type Exact<T extends {
    [key: string]: unknown;
}> = {
    [K in keyof T]: T[K];
};
export declare type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
    [SubKey in K]?: Maybe<T[SubKey]>;
};
export declare type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
    [SubKey in K]: Maybe<T[SubKey]>;
};
export declare type RequireFields<T, K extends keyof T> = {
    [X in Exclude<keyof T, K>]?: T[X];
} & {
    [P in K]-?: NonNullable<T[P]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export declare type Scalars = {
    ID: string;
    String: string;
    Boolean: boolean;
    Int: number;
    Float: number;
    DateTime: any;
};
export declare type Manga = {
    id: Scalars['ID'];
    name: Scalars['String'];
    pathname: Scalars['String'];
    createdAt: Scalars['DateTime'];
    size: Scalars['Int'];
    data?: Maybe<Array<MangaData>>;
    cover?: Maybe<Scalars['String']>;
};
export declare type MangaData = {
    name: Scalars['String'];
    path: Scalars['String'];
};
export declare type Query = {
    mangas?: Maybe<Array<Manga>>;
    manga?: Maybe<Manga>;
    search?: Maybe<Array<Manga>>;
    total: Scalars['Int'];
    update?: Maybe<Scalars['Boolean']>;
};
export declare type QueryMangasArgs = {
    sort?: Maybe<Scalars['String']>;
    limit?: Maybe<Scalars['Int']>;
    cursor?: Maybe<Scalars['Int']>;
    refresh?: Maybe<Scalars['Boolean']>;
};
export declare type QueryMangaArgs = {
    id: Scalars['ID'];
};
export declare type QuerySearchArgs = {
    term?: Maybe<Scalars['String']>;
};
export declare type ResolverTypeWrapper<T> = Promise<T> | T;
export declare type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
    resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export declare type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;
export declare type ResolverFn<TResult, TParent, TContext, TArgs> = (parent: TParent, args: TArgs, context: TContext, info: GraphQLResolveInfo) => Promise<TResult> | TResult;
export declare type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (parent: TParent, args: TArgs, context: TContext, info: GraphQLResolveInfo) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;
export declare type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (parent: TParent, args: TArgs, context: TContext, info: GraphQLResolveInfo) => TResult | Promise<TResult>;
export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
    subscribe: SubscriptionSubscribeFn<{
        [key in TKey]: TResult;
    }, TParent, TContext, TArgs>;
    resolve?: SubscriptionResolveFn<TResult, {
        [key in TKey]: TResult;
    }, TContext, TArgs>;
}
export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
    subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
    resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}
export declare type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> = SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs> | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;
export declare type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> = ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>) | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;
export declare type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (parent: TParent, context: TContext, info: GraphQLResolveInfo) => Maybe<TTypes> | Promise<Maybe<TTypes>>;
export declare type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;
export declare type NextResolverFn<T> = () => Promise<T>;
export declare type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (next: NextResolverFn<TResult>, parent: TParent, args: TArgs, context: TContext, info: GraphQLResolveInfo) => TResult | Promise<TResult>;
/** Mapping between all available schema types and the resolvers types */
export declare type ResolversTypes = {
    DateTime: ResolverTypeWrapper<Scalars['DateTime']>;
    Manga: ResolverTypeWrapper<Manga>;
    ID: ResolverTypeWrapper<Scalars['ID']>;
    String: ResolverTypeWrapper<Scalars['String']>;
    Int: ResolverTypeWrapper<Scalars['Int']>;
    MangaData: ResolverTypeWrapper<MangaData>;
    Query: ResolverTypeWrapper<{}>;
    Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
};
/** Mapping between all available schema types and the resolvers parents */
export declare type ResolversParentTypes = {
    DateTime: Scalars['DateTime'];
    Manga: Manga;
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
export declare type MangaResolvers<ContextType = any, ParentType extends ResolversParentTypes['Manga'] = ResolversParentTypes['Manga']> = {
    id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
    name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    pathname?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
    size?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
    data?: Resolver<Maybe<Array<ResolversTypes['MangaData']>>, ParentType, ContextType>;
    cover?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};
export declare type MangaDataResolvers<ContextType = any, ParentType extends ResolversParentTypes['MangaData'] = ResolversParentTypes['MangaData']> = {
    name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    path?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};
export declare type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
    mangas?: Resolver<Maybe<Array<ResolversTypes['Manga']>>, ParentType, ContextType, RequireFields<QueryMangasArgs, 'sort' | 'cursor' | 'refresh'>>;
    manga?: Resolver<Maybe<ResolversTypes['Manga']>, ParentType, ContextType, RequireFields<QueryMangaArgs, 'id'>>;
    search?: Resolver<Maybe<Array<ResolversTypes['Manga']>>, ParentType, ContextType, RequireFields<QuerySearchArgs, never>>;
    total?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
    update?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
};
export declare type Resolvers<ContextType = any> = {
    DateTime?: GraphQLScalarType;
    Manga?: MangaResolvers<ContextType>;
    MangaData?: MangaDataResolvers<ContextType>;
    Query?: QueryResolvers<ContextType>;
};
