'use strict';

import {
  readdirSync
} from 'fs';
import {
  basename as _basename,
  join
} from 'path';
import Sequelize from 'sequelize';
const basename = _basename(__filename);
const db = {};

// set up environmental variables for connecting to the db
//database: String, username: String, password: String, options: Object
let _d = (process.env.DATABASE || 'mvp2');
let _u = (process.env.USERNAME || 'root');
let _p = (process.env.PASSWORD || '');
let _o = {
  'host': (process.env.DBHOST || 'localhost'),
  'dialect': (process.env.DBDIALECT || 'mysql')
};

// connect to the db
let sequelize = new Sequelize(database = _d, username = _u, password = _p, options = _o);

// connect
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');

    // read the models into sequelize
    readdirSync(__dirname)
      .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
      })
      .forEach(file => {
        let model = sequelize['import'](join(__dirname, file));
        db[model.name] = model;
      });

    Object.keys(db).forEach(modelName => {
      if (db[modelName].associate) {
        db[modelName].associate(db);
      }
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;