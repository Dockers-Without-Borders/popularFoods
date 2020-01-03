const { Users, Restaurants, Reviews, Images, Dishes } = require('../../database/database');
// new controller should connect to the model now instead of the database
const { client, pool } = require('../../database/model');
const { Promise } = require('bluebird');
pool.query = Promise.promisify(pool.query);
const { makeRestaurantEntry } = require('../../database/SampleData/dataGenerator')

// THIS SHOULD REFLECT THE READ ME FILE

// I think i have to also keep in mind that when I query, it will store things in a cache so to really test things out
// I need to randomize it
module.exports = {
    postgres: {
        retrieveCarousel: function(req, res) {
            let queryString = `SELECT restaurants.name, dishes.name, dishes.photo_number, dishes.review_number, dishes.price, images.source FROM restaurants INNER JOIN dishes ON (restaurants.id = dishes.restaurant_id)
            INNER JOIN images ON (dishes.id = images.dish_id) WHERE restaurants.id = 1 LIMIT 1;`;
            var today = new Date();
            pool.query(queryString)
            .then((data) => {
                console.log('retrieved the following data in this amount of time', (new Date() - today)/1000, data.rows[0])
                pool.end();
            })
            .catch(() => {
                console.log('retireve query has failed')
                pool.end();
            })

           
        },

        retrieveModal: function(req, res) {
            // TO DO
            // WIll DO AND OPTIMIZE LATER IF I DECIDE TO GO FORWARD WITH POSTGRES
        },

        createImage: function(req, res) {
            let queryString = `INSERT into IMAGES (source, caption, dish_id) VALUES ('url', 'some caption', 1)`;
            var today = new Date();
            pool.query(queryString)
            .then((data) => {
                console.log('data has been added into the database', new Date() - today)
                pool.end();
            })
            .catch(() => {
                console.log('retireve query has failed')
                pool.end();
            })
        },
        
        createReview: function(req, res) {
            let queryString = `INSERT into reviews (body, stars, user_id, dish_id, created_at) VALUES ('some review text', 5, 1, 1, 'the date');`;
            var today = new Date();
            pool.query(queryString)
            .then((data) => {
                console.log('data has been added into the database', new Date() - today)
                pool.end();
            })
            .catch(() => {
                console.log('retireve query has failed')
                pool.end();
            })
        },
        
        updateReview: function(req, res) {
            let queryString = `update reviews set body = 'new review body' where id = 1;`;
            var today = new Date();
            pool.query(queryString)
            .then((data) => {
                console.log('data has been UPDATED', new Date() - today)
                pool.end();
            })
            .catch(() => {
                console.log('retireve query has failed')
                pool.end();
            })
        },
        
        deleteReview: function(req, res) {
            let queryString = `delete from reviews where id = 1004;`;
            var today = new Date();
            pool.query(queryString)
            .then((data) => {
                console.log('data has been DELETED', new Date() - today)
                pool.end();
            })
            .catch(() => {
                console.log('retireve query has failed')
                pool.end();
            })
        },
        
        deleteImage: function(req, res) {
            let queryString = `delete from images where id = 1004;`;
            var today = new Date();
            pool.query(queryString)
            .then((data) => {
                console.log('data has been DELETED', new Date() - today)
                pool.end();
            })
            .catch(() => {
                console.log('retireve query has failed')
                pool.end();
            })
        },
    },

    cassandra: {
        getCarousel: function(req, res){
            // This needs to send it back as well
            // NEED TO see if this gets the right end point that I will put in
            // maybe try parsing through body?
            // console.log('THIS REQUEST WAS MADE', req.params.restaurant_name)
            var endpoint = req.params.restaurant_name.split("_").join(" ")
            // going to random the endpoint based on the faker data
            endpoint = makeRestaurantEntry().name // makes the name of the restaurant
            console.log('ENDPOINTT', endpoint)
            
            var query = `select * from carousel where restaurant_name = '${endpoint}';`
            var now = new Date();
            client.execute(query)
                .then((data) => {
                    console.log('TIME IT TOOK THIS MUCH TIME IN milliseconds: ', new Date() - now, data.rows)
                    //sending something back so it doesnt break. not sure how i did this without express even in here
                    // also how am i getting a req and res ?? like from where
                    res.send();
            });
        }

        // Post
        // insert into carousel (id, restaurant_name, number_of_photos, number_of_reviews, price, thumbnail_image, dish_name) values (2, 'gurjotrest', 2, 2, 12, '23', 'potatoes');

        //update
        // update carousel set number_of_photos = 6 where restaurant_name = 'gurjotrest' AND dish_name = 'potatoes' AND id = 2;

        // delete
        // Delete from carousel where restaurant_name = 'gurjotrest' AND dish_name = 'potatoes' AND id = 2;

    },

    dish: {
        getDishes: function (req, res) {
            Dishes.findAll({})
                .then(response => {
                    res.status(200).end(JSON.stringify(response));
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).end();
                })
        }
    },
    images: {
        getFirst: function (req, res) {
            Images.findAll({
                where: {
                    dishId: req.params.dishId
                },
                attributes: ['source'],
                limit: 1
            })
                .then(response => {
                    // console.log(response);
                    res.status(200).end(JSON.stringify(response));
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).end();
                })
        },
        getAllForDish: function (req, res) {
            Images.findAll({
                where: {
                    dishId: req.params.dishId
                }
            })
                .then(response => {
                    // console.log(response);
                    res.status(200).end(JSON.stringify(response));
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).end();
                })
        }
    },
    reviews: {
        getOne: function (req, res) {
            Reviews.findAll({ limit: 1, include: [Users, Dishes] })
                .then(response => {
                    // console.log(response);
                    res.status(200).end(JSON.stringify(response));
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).end();
                })
        },
        getReviewsForDish: function (req, res) {
            Reviews.findAll({
                include: [Users, {
                    model: Dishes,
                    where: { name: req.params.dish }
                }]
            })
                .then(response => {
                    // console.log(response);
                    res.status(200).end(JSON.stringify(response));
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).end();
                })
        }
    },
    users: {
        getTen: function (req, res) {
            Users.findAll({ limit: 10 })
                .then(response => {
                    // console.log(response);
                    res.status(200).end();
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).end();
                })
        }
    },

}