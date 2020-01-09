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
            // HARD CODING the endpoint for testing purposes, want to avoid getting cache items when testing speeds
            var endpoint = makeRestaurantEntry().name

            console.log('ENDPOINTT', endpoint)
            var query = `select * from carousel where restaurant_name = '${endpoint}';`
            var now = new Date();
            client.execute(query)
                .then((data) => {
                    console.log('TIME IT TOOK THIS MUCH TIME IN milliseconds: ', new Date() - now, data.rows)
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

}