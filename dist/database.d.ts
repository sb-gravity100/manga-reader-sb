import { Sequelize, ModelCtor } from 'sequelize-typescript';
import * as M from './models';
export default function SequelizeInitialize(username: string, password: string, models: ModelCtor[]): Sequelize;
export declare type ApolloContext = {
    Models: typeof M;
    sequelize: Sequelize;
};
