"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const models = {};
require("dotenv").config(); // Load environment variables

// Environment variables
const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;
const dialect = "postgres"
const sequelizeOptions = {
    dialect: dialect,
    port: dbPort,
    host: dbHost,
    dialectOptions: {
        ssl: true
    },
    freezeTableName: true,
    logging: false, // Comment this line out if you want verbose pgsql console logs
};


// Initialize Sequelize
const sequelize = new Sequelize(dbName, dbUser, dbPassword, sequelizeOptions);

// Test the database connection
const initializeDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error.message);
        process.exit(1); // Exit if the DB connection fails
    }
};

// Load all models
fs.readdirSync(__dirname)
  .filter((file) => file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js")
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    models[model.name] = model;
  });

// Apply associations
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

// Export sequelize instance and models
models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = {
  models,
  sequelize,
  initializeDatabase,
};
