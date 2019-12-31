const { Users, Restaurants, Reviews, Images, Dishes } = require('../../database/database');
// new controller should connect to the model now instead of the database
const { client, pool } = require('../../database/model');
const { Promise } = require('bluebird');

// THIS SHOULD REFLECT THE READ ME FILE

// I think i have to also keep in mind that when I query, it will store things in a cache so to really test things out
// I need to randomize it
module.exports = {
    postgres: {
        // query all of the tables needed for the front carousel page, this is seeded in cassandra for sure
        // modal got a little cut off but this one should be fine
        // only considered a fair 
    //     id INT,
    // restaurant_name VARCHAR,
    // number_of_photos INT,
    // number_of_reviews INT,
    // price DECIMAL,
    // thumbnail_image VARCHAR,
    // dish_name VARCHAR,

    // want to retrieve restaurant name from restaurant table, number of photos, number of reviews, 
    // dish table: name, price
    // images thumbnail (source only 1)
        retrieveCarousel: function(req, res) {
            // this function will get all of the associated data for one listing
            // it doesn't make sense to query mutiple times for a component
            let queryString = `SELECT restaurants.name, dishes.name, dishes.photo_number, dishes.review_number, dishes.price, images.source FROM restaurants INNER JOIN dishes ON (restaurants.id = dishes.restaurant_id)
            INNER JOIN images ON (dishes.id = images.dish_id) WHERE restaurants.id = 1 LIMIT 1;`;
            var today = new Date();
            pool.query = Promise.promisify(pool.query);
            pool.query(queryString)
            .then((data) => {
                console.log('retrieved the following data in this amount of time', (new Date() - today)/1000, data.rows[0])
                pool.end();
            })
            .catch(() => {
                console.log('query has failed')
                pool.end();
            })

           
        },

        retrieveModal: function(req, res) {

        },

        createCarousel: function(req, res) {
            //
        },

    },

    cassandra: {

    },

    // dish: {
    //     getDishes: function (req, res) {
    //         Dishes.findAll({})
    //             .then(response => {
    //                 res.status(200).end(JSON.stringify(response));
    //             })
    //             .catch(err => {
    //                 console.log(err);
    //                 res.status(500).end();
    //             })
    //     }
    // },
    // images: {
    //     getFirst: function (req, res) {
    //         Images.findAll({
    //             where: {
    //                 dishId: req.params.dishId
    //             },
    //             attributes: ['source'],
    //             limit: 1
    //         })
    //             .then(response => {
    //                 console.log(response);
    //                 res.status(200).end(JSON.stringify(response));
    //             })
    //             .catch(err => {
    //                 console.log(err);
    //                 res.status(500).end();
    //             })
    //     },
    //     getAllForDish: function (req, res) {
    //         Images.findAll({
    //             where: {
    //                 dishId: req.params.dishId
    //             }
    //         })
    //             .then(response => {
    //                 console.log(response);
    //                 res.status(200).end(JSON.stringify(response));
    //             })
    //             .catch(err => {
    //                 console.log(err);
    //                 res.status(500).end();
    //             })
    //     }
    // },
    // reviews: {
    //     getOne: function (req, res) {
    //         Reviews.findAll({ limit: 1, include: [Users, Dishes] })
    //             .then(response => {
    //                 // console.log(response);
    //                 res.status(200).end(JSON.stringify(response));
    //             })
    //             .catch(err => {
    //                 console.log(err);
    //                 res.status(500).end();
    //             })
    //     },
    //     getReviewsForDish: function (req, res) {
    //         Reviews.findAll({
    //             include: [Users, {
    //                 model: Dishes,
    //                 where: { name: req.params.dish }
    //             }]
    //         })
    //             .then(response => {
    //                 // console.log(response);
    //                 res.status(200).end(JSON.stringify(response));
    //             })
    //             .catch(err => {
    //                 console.log(err);
    //                 res.status(500).end();
    //             })
    //     }
    // },
    // users: {
    //     getTen: function (req, res) {
    //         Users.findAll({ limit: 10 })
    //             .then(response => {
    //                 console.log(response);
    //                 res.status(200).end();
    //             })
    //             .catch(err => {
    //                 console.log(err);
    //                 res.status(500).end();
    //             })
    //     }
    // },

}