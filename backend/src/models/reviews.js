module.exports = (sequelize, DataTypes) => {
    const Review = sequelize.define('reviews', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        review: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        rating: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        restaurant_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });

    return Review;
};
