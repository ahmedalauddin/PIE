const mysql = require('mysql');
const Sequelize = require('sequelize');


// Or you can simply use a connection uri
//const sequelize = new Sequelize('postgres://user:pass@example.com:5432/dbname');

// End of Sequelize code.

/*
This is for the MySQL pool.  Adding the one for Sequelize instead.

// Set database connection credentials
const config = {
    host: 'valueinfinity1.cgrq1bgu4ual.us-east-2.rds.amazonaws.com',
    user: 'thoughtiveadmin',
    password: 'Th0ughtiveSql*',
    database: 'valueinfinity1',
};

// Create a MySQL pool
const pool = mysql.createPool(config);
*/

// Export the pool
module.exports = pool;