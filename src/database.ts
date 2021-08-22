// import CLS from 'cls-hooked'
import { Sequelize, ModelCtor } from 'sequelize-typescript';
import * as M from './models'

// const namespace = CLS.createNamespace('manga')

export default function SequelizeInitialize(
   username: string,
   password: string,
   models: ModelCtor[]
) {
   const sequelize = new Sequelize('default', username, password, {
      dialect: 'mariadb',
      define: {
         freezeTableName: true,
         timestamps: false
      },
      port: 3306,
      logging: false
   });
   sequelize.addModels(models);
   return sequelize;
}

export type ApolloContext = {
   Models: typeof M;
   sequelize: Sequelize;
};
