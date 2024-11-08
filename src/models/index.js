// //using sequelize ORM to connect to postgresql database
// /** 
//   structure 
//     - indexjs : connects to database and constructs a table constructor and acts like an original table. 
//     - remaining files : tables schema in sequelize format
//     **/

//     const { Sequelize } = require('sequelize');

//     // Instance for sequelize - need to give actual db details
//     let options = {
//         host: process.env.DB_HOST,
//         dialect: 'postgres',
//     }
//     const sequelize = new Sequelize(
//         process.env.DB_NAME, 
//         process.env.DB_USER, 
//         process.env.DB_PASSWORD, 
//         options
//     );
    
//     // connection testing code
//     const testConnection = async () => {
//         try {
//             await sequelize.authenticate();
//             console.log('Connection to the database has been established successfully.');
//         } catch (error) {
//             console.error('Unable to connect to the database:', error);
//         }
//     };
    
//     // Call the test function
//     testConnection();
    
//     module.exports = { sequelize };
    


// const { Sequelize } = require('sequelize');
// require('dotenv').config(); // Load environment variables from .env file

// // Create a new Sequelize instance using the connection URL from the .env file
// const sequelize = new Sequelize(process.env.DATABASE_URL, {
//     dialect: 'postgres',
//     logging: false, // Disable logging (optional)
//     dialectOptions: {
//         ssl: {
//             require: true,
//             rejectUnauthorized: false, // For compatibility with ElephantSQL
//         },
//     },
// });

// // Test the database connection
// const testConnection = async () => {
//     try {
//         await sequelize.authenticate();
//         console.log('Connection to PostgreSQL has been established successfully.');
//     } catch (error) {
//         console.error('Unable to connect to the database:', error);
//     }
// };

// // Call the test connection function
// testConnection();

// module.exports = { sequelize };


"use-strict";
const fs = require("fs");
const path = require("path");
const pg = require("pg");
const Sequelize = require("sequelize");
const models = {};
const basename = path.basename(__filename);

/**
 * @typedef {Object} Models
 */

const dialect = "postgres";
const dbName = process.env.DB_NAME;
const host = process.env.DB_HOST;
const userName = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const dbPoolMax = 50;
const dbPoolMin = 20;
const port = process.env.DB_PORT;

delete pg.native;
const sequelizeOptions = {
    dialect: dialect,
    port: port,
    host: host,
    pool: {
        max: dbPoolMax,
        min: dbPoolMin,
        acquire: 30000,
        idle: 120000
    },
    dialectOptions: {
        ssl: true
    },
    freezeTableName: true,
    logging: false, // Comment this line out if you want verbose pgsql console logs
};
const sequelize = new Sequelize(process.env.DATABASE_URL, sequelizeOptions);
sequelize.authenticate().then(() => {
    console.log('Connection to database has been established successfully.');
}).catch((error) => {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
});
fs.readdirSync(__dirname).filter((file) => {
    return(file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js");
}).forEach((file) => {
    const makeModel = require(path.join(__dirname, file));
    const model = makeModel(sequelize, Sequelize.Sequelize);
    models[model.name] = model;
});

Object.keys(models).forEach((modelName) => {
    if (models[modelName].associate) { // models['system_es_index'].Sequelize
        models[modelName].associate(models);
    }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = {
    models
};
