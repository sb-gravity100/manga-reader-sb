// import CLS from 'cls-hooked'
import { Sequelize } from 'sequelize-typescript';
import * as M from './models';

// const namespace = CLS.createNamespace('manga')

export const sequelize = new Sequelize('default', 'root', 'btstaehyung1', {
   dialect: 'mariadb',
   define: {
      freezeTableName: true,
      timestamps: false,
   },
   port: 3306,
   logging: false,
});
sequelize.addModels(Object.values({ ...M }));
