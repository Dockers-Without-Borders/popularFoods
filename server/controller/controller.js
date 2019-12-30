const { Users, Restaurants, Reviews, Images, Dishes } = require('../../database/database');
// new controller should connect to the model now instead of the database

module.exports = {
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
                    console.log(response);
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
                    console.log(response);
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
                    console.log(response);
                    res.status(200).end();
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).end();
                })
        }
    },

}