
module.exports = (sequelize, DataTypes) => {
    const Restaurant = sequelize.define('business_owners',   {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          validate: {
            isEmail: true,
          },
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        phone: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        restaurant_ids: {
          type: DataTypes.ARRAY(DataTypes.STRING), // Array of integers for restaurant IDs
          allowNull: true,
        },
      },{});
  
    return Restaurant;
  };
  