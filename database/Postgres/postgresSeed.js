const { Pool } = require('pg');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const { makeDishEntry, makeImageEntry, makeReviewEntry, makeUserEntry, makeRestaurantEntry } = require('../SampleData/dataGenerator.js') 
const { Promise } = require('bluebird');


////////////////////////////////////////////////// seeding script /////////////////////////////////////////////////////

// https://medium.com/@danielburnsart/writing-a-large-amount-of-data-to-a-csv-file-using-nodes-drain-event-99dcaded99b5
// Ways to Optimize this: 
// use waterthreshold method so things do not get over whemled, they drain and then continue doing their thing
// break up the script by using recusion to do like 1 million at a time
// need to use one seed script because i want to have certain table seeds be call backs of each other
// create multiple pools and have them run async?

var pool = new Pool({
    database: 'test',
}) 

pool.query = Promise.promisify(pool.query);

////////////////////////////Create the csv table templates/ column headers /////////////////////////////////////////////////////
// restaurants
const csvRestaurantWriter = createCsvWriter({
    path: '/Users/gurjot/popularFoods/database/Postgres/restaurant.csv',
    header: [
        {id: 'id', title: 'id'},
        {id: 'name', title: 'name'}
    ]
});

const restaurantRecords = [
];

// Users
const csvUserWriter = createCsvWriter({
    path: '/Users/gurjot/popularFoods/database/Postgres/users.csv',
    header: [
        {id: 'id', title: 'id'},
        {id: 'name', title: 'name'},
        {id: 'avatar_url', title: 'avatar_url'},
        {id: 'friends_number', title: 'friends_number'},
        {id: 'reviews_number', title: 'reviews_number'}
    ]
});

const userRecords = [
];

// dishes
const csvDishesWriter = createCsvWriter({
    path: '/Users/gurjot/popularFoods/database/Postgres/dishes.csv',
    header: [
        {id: 'name', title: 'name'},
        {id: 'price', title: 'price'},
        {id: 'restaurant_id', title: 'restaurant_id'},
        {id: 'photo_number', title: 'photo_number'},
        {id: 'review_number', title: 'review_number'},
    ]
});

const dishesRecords = [
];

// reviews 
const csvReviewsWriter = createCsvWriter({
    path: '/Users/gurjot/popularFoods/database/Postgres/reviews.csv',
    header: [
        {id: 'body', title: 'body'},
        {id: 'stars', title: 'stars'},
        {id: 'user_id', title: 'user_id'},
        {id: 'dish_id', title: 'dish_id'},
        {id: 'created_at', title: 'created_at'},
        {id: 'helpful', title: 'helpful'},
        {id: 'not_helpful', title: 'not_helpful'},
    ]
});

const reviewsRecords = [
];

// images
const csvImagesWriter = createCsvWriter({
    path: '/Users/gurjot/popularFoods/database/Postgres/images.csv',
    header: [
        {id: 'source', title: 'source'},
        {id: 'caption', title: 'caption'},
        {id: 'dish_id', title: 'dish_id'},
    ]
});

const imagesRecords = [
];


// NEED TO: make all of the foreign keys more evenly distributed as I planned
////////////////////////////////////////////create json object that will be converted to csv /////////////////////////////////////////////////////
// restaurants: 10 Million
var now = new Date();
for (var i = 0; i < 100 + 1; i++) {
    if (i%10000 === 0) {
        //logs every 10,000
        console.log(i)
    }
    let row = {}
    row.id = i;
    row.name = makeRestaurantEntry().name
    restaurantRecords.push(row)
}

// users: 20 Million
for (var i = 0; i < 200 + 1; i++) {
    let row = {}
    row.id = i;
    let usersInfo = makeUserEntry();
    row.name = usersInfo.name;
    row.avatar_url = usersInfo.avatar_url;
    row.friends_number = usersInfo.friends_number;
    row.reviews_number = usersInfo.reviews_number
    userRecords.push(row)
}

// dishes: 50 millions (5 per restaurant)
for (var i = 0; i < 500 + 1; i++) {
    let row = {}
    let dishInfo = makeDishEntry();
    row.name = dishInfo.name;
    row.price = dishInfo.price;
    row.restaurant_id = dishInfo.restaurant_id; // currently from 1 - 100
    row.photo_number = dishInfo.photo_number;
    row.review_number = dishInfo.review_number;
    dishesRecords.push(row);
    // restuarant id will break if there is not atleast 100 entries from retaurants since randomizer is set to 100
    // issue is still that these are not evenly distributed
}

// reviews: 1000 millions (2 per dish)
for (var i = 0; i < 1000 + 1; i++) {
    let row = {}
    let reviewInfo = makeReviewEntry();
    row.body = reviewInfo.body;
    row.stars = reviewInfo.stars;
    row.user_id = reviewInfo.user_id; // currently 1-50
    row.dish_id = reviewInfo.dish_id; // currently only 1-10
    row.created_at = reviewInfo.created_at;
    row.helpful = reviewInfo.helpful;
    row.not_helpful = reviewInfo.not_helpful;
    reviewsRecords.push(row);
}

// images: 1000 millions (2 per dish)
for (var i = 0; i < 1000 + 1; i++) {
    let row = {}
    let imageInfo = makeImageEntry();
    row.source = imageInfo.source;
    row.caption = imageInfo.caption;
    row.dish_id = imageInfo.dish_id; //1 -10
    imagesRecords.push(row);
}


//////////////////////////////////////////// write to csv /////////////////////////////////////////////////////
csvRestaurantWriter.writeRecords(restaurantRecords)
    .then(() => {
        console.log('...Done');
    });

console.log('time to write csv in seconds', (new Date() - now)/1000)

csvUserWriter.writeRecords(userRecords)
    .then(() => {
        console.log('...Done');
    });

csvDishesWriter.writeRecords(dishesRecords)
    .then(() => {
        console.log('...Done');
    });

csvReviewsWriter.writeRecords(reviewsRecords)
    .then(() => {
        console.log('...Done');
    });

csvImagesWriter.writeRecords(imagesRecords)
    .then(() => {
        console.log('...Done');
    });




// Seed to Database
let queryStringRestaurant = `COPY restaurants(id, name) FROM '/Users/gurjot/popularFoods/database/Postgres/restaurant.csv' DELIMITER ',' CSV HEADER;`
let queryStringUsers = `COPY users (id, name, avatar_url, friends_number, reviews_number) FROM '/Users/gurjot/popularFoods/database/Postgres/users.csv' DELIMITER ',' CSV HEADER;`
let queryStringDishes = `COPY dishes (name, price, restaurant_id, photo_number, review_number) FROM '/Users/gurjot/popularFoods/database/Postgres/dishes.csv' DELIMITER ',' CSV HEADER;`
let queryStringReviews = `COPY reviews (body, stars, user_id, dish_id, created_at, helpful, not_helpful) FROM '/Users/gurjot/popularFoods/database/Postgres/reviews.csv' DELIMITER ',' CSV HEADER;`
let queryStringImages = `COPY images (source, caption, dish_id) FROM '/Users/gurjot/popularFoods/database/Postgres/images.csv' DELIMITER ',' CSV HEADER;`


var today = new Date();

//might look better if i promisify all on users and restaurant and the bunch the rest on one then statement
// RESTAURANTS
pool.query(queryStringRestaurant)
.then((res)=>{
    console.log('RESTAURANTS QUERY Success')
    //USERS
    pool.query(queryStringUsers)
    .then(() => {
        console.log('Users Query Success')
        // DISHES
        pool.query(queryStringDishes)
        .then(()=>{
            console.log('DISHES QUERY SUCESS')
            //REVIEWS
            pool.query(queryStringReviews)
            .then(() => {
                console.log('REVIEWS QUERY SUCESS')
            })
            .catch((err) => {
                console.log('REVIEWS QUERY FAILED', err.stack)
            })


            //IMAGES
            pool.query(queryStringImages)
            .then(()=>{
                console.log('IMAGES QUERY SUCESS', (new Date() - today)/1000)
                pool.end(); // not sure if it makes sense to end the pool here, and will it interupt any queries?
            })
            .catch(err => {
                console.log('IMAGES FAILED TO QUERY', err.stack)
            })
            

        })
        .catch(err=>{
            console.log('DISHES FAILED TO QUERY', err.stack)
        })
    })
    .catch(err=>{
        console.log('USERS FAILED TO QUERY', err.stack)
    })
})
.catch(err => {
    console.log('RESTAURANTS FAILED TO QUERY', err.stack)
})

