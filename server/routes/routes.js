const controller = require('../controller/controller');
const express = require('express');
const router = express.Router();

router.get('/dishes', controller.dish.getDishes);
router.get('/images/thumbnail/:dishId', controller.images.getFirst);
router.get('/images/dish/:dishId', controller.images.getAllForDish);
router.get('/reviews/dish/:dish', controller.reviews.getReviewsForDish)
router.get('/users/ten', controller.users.getTen);
router.get('/tests/review', controller.reviews.getOne)
//New API calls
//CREATE

//RETRIEVE
router.get('/carousel', controller.cassandra.getCarousel)
// this just calls a function, I need to pass in parameters? how else can I give params
router.get('/carousel/:restaurant_name', controller.cassandra.getCarousel)


//UPDATE

//DELETE

module.exports = router;