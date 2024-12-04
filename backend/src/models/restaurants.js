// models/user.js
module.exports = (sequelize, DataTypes) => {
    const restaurant = sequelize.define('restaurants',   {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
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
          type: DataTypes.STRING(50),
          allowNull: true,
        },
        cuisine_type: {
          type: DataTypes.STRING(50),
          allowNull: true,
        },
        price_range: {
          type: DataTypes.STRING(20),
          allowNull: true,
        },
        hours: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        photos: {
          type: DataTypes.JSON, // Binary Large Object for storing file data
          allowNull: true,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
      },{});
  
    return restaurant;
  };