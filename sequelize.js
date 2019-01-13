const Sequelize = require('sequelize');
const PersonModel = require('./models/person');
const OrganizationModel = require('./models/organization');
const KpiModel = require('./models/kpi');

mySqlDb = 'valueinfinity1.cgrq1bgu4ual.us-east-2.rds.amazonaws.com';
database = 'valueinfinity';
user = 'thoughtiveadmin';
pass = 'Th0ughtiveSql*';

const sequelize = new Sequelize(database, user, pass, {
    host: mySqlDb,
    dialect: 'mysql',
    operatorsAliases: false,
    // logging should go to console.log
    logging: true,

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

const Person = PersonModel(sequelize, Sequelize);
const Organization = OrganizationModel(sequelize, Sequelize);
const Kpi = KpiModel(sequelize, Sequelize);

module.exports = {
    Sequelize,
    Person,
    Organization,
    Kpi
};