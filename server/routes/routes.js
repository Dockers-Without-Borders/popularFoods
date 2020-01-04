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
router.get('/carousel/:restaurant_name', controller.cassandra.getCarousel)

router.get('/modal', controller.cassandra.getModal)
router.get('/modal/:restaurant_name', controller.cassandra.getModal)

//UPDATE

//DELETE

module.exports = router;