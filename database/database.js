const Sequelize = require('sequelize');
const { database, user, password } = require('../config.js');


const sequelize = new Sequelize(database, user, password, {
    host: 'localhost    ',
    dialect: 'mysql',
    logging: false,
});


sequelize.authenticate()
    .then(() => {
        console.log('connected to popularDishes db');
    })
    .catch((err) => {
        console.log('Unable to connect to the database:', err);
    });
const Users = sequelize.define('users', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: Sequelize.STRING,
    avatarURL: Sequelize.STRING,
    friendsNumber: Sequelize.INTEGER,
    reviewsNumber: Sequelize.INTEGER
});
const Restaurants = sequelize.define('restaurants', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: Sequelize.STRING,
});
const Reviews = sequelize.define('reviews', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    body: Sequelize.TEXT,
    stars: Sequelize.INTEGER,
    userId: Sequelize.INTEGER,
    dishId: Sequelize.INTEGER
})
const Dishes = sequelize.define('dishes', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: Sequelize.STRING,
    price: Sequelize.DECIMAL,
    restaurantId: Sequelize.INTEGER,
    photoNumber: Sequelize.INTEGER,
    reviewNumber: Sequelize.INTEGER
})
const Images = sequelize.define('images', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    source: Sequelize.STRING,
    caption: Sequelize.STRING,
    dishId: Sequelize.INTEGER

})
Images.belongsTo(Dishes);
Dishes.hasMany(Images);
Reviews.belongsTo(Dishes);
Dishes.hasMany(Reviews);
Reviews.belongsTo(Users);
Users.hasMany(Reviews);



module.exports = {
    sequelize,
    Users,
    Restaurants,
    Reviews,
    Dishes,
    Images,
}