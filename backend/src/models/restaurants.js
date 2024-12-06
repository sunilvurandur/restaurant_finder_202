// models/user.js
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
    const restaurant = sequelize.define('restaurants',   {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: uuidv4, // Automatically generates a UUID
        },
        name: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        address: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        latitude: {
          type: DataTypes.DECIMAL(10, 8),
          allowNull: true,
        },
        longitude: {
          type: DataTypes.DECIMAL(11, 8),
          allowNull: true,
        },
        category: {
          type: DataTypes.ARRAY(DataTypes.STRING),
          allowNull: true,
        },
        price_range: {
          type: DataTypes.STRING(20),
          allowNull: true,
        },
        hours: {
          type: DataTypes.JSON,
          allowNull: true,
        },
        photos: {
          type: DataTypes.ARRAY(DataTypes.TEXT), // Binary Large Object for storing file data
          allowNull: true,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        coverPhoto: {
          type: DataTypes.STRING,
          allowNull: true,
        }
      },{});
    return restaurant;
  };