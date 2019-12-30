const controller = require('../controller/controller');
const express = require('express');
const router = express.Router();

router.get('/dishes', controller.dish.getDishes);
router.get('/images/thumbnail/:dishId', controller.images.getFirst);
router.get('/images/dish/:dishId', controller.images.getAllForDish);
router.get('/reviews/dish/:dish', controller.reviews.getReviewsForDish)
router.get('/users/ten', controller.users.getTen);
router.get('/tests/review', controller.reviews.getOne)
module.exports = router;