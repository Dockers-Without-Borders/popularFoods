const { Pool } = require('pg');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const { makeDishEntry, makeImageEntry, makeReviewEntry, makeUserEntry, makeRestaurantEntry } = require('../SampleData/dataGenerator.js') 

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

// Create the csv table templates
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
        {id: 'avatarURL', title: 'avatarURL'},
        {id: 'friendsNumber', title: 'friendsNumber'},
        {id: 'reviewsNumber', title: 'reviewsNumber'}
    ]
});

const userRecords = [
];

// create json object that will convert to csv
//restaurants
var now = new Date();
for (var i = 0; i < 150 + 1; i++) {
    if (i%10000 === 0) {
        //logs every 10,000
        console.log(i)
    }
    let row = {}
    row.id = i;
    row.name = makeRestaurantEntry().name
    restaurantRecords.push(row)
}

//users
for (var i = 0; i < 20 + 1; i++) {
    let row = {}
    row.id = i;
    let usersInfo = makeUserEntry();
    row.name = usersInfo.name;
    row.avatarURL = usersInfo.avatarURL;
    row.friendsNumber = usersInfo.friendsNumber;
    row.reviewsNumber = usersInfo.reviewsNumber
    userRecords.push(row)
}

// write to csv
csvRestaurantWriter.writeRecords(restaurantRecords)
    .then(() => {
        console.log('...Done');
    });

console.log('time to write csv in seconds', (new Date() - now)/1000)

csvUserWriter.writeRecords(userRecords)
    .then(() => {
        console.log('...Done');
    });




// Seed to Database
let queryStringRestaurant = `COPY restaurants(id, name) FROM '/Users/gurjot/popularFoods/database/Postgres/restaurant.csv' DELIMITER ',' CSV HEADER;`
let queryStringUsers = `COPY users (id, name, avatarURL, friendsNumber, reviewsNumber) FROM '/Users/gurjot/popularFoods/database/Postgres/users.csv' DELIMITER ',' CSV HEADER;`
let queryStringDishes = `insert into dishes (id, name, price, restaurant_id, photo_number, review_number) values `

//NEST these together so it makes sense, I wonder if i could just use promises or i need to promisify it
var today = new Date();
pool.query(queryStringRestaurant, (err, res) => {
    if (err) {
        console.log(err.stack)
      } else {
        console.log('time to query in seconds:', (new Date() - today)/1000)

      }
})
pool.query(queryStringUsers, (err, res) => {
    if (err) {
        console.log(err.stack)
      } else {
        console.log('success')
      }
})
    
    //dishes
    let dishes = makeDishEntry();
    queryStringDishes += `(${i}, '${dishes.name}', ${dishes.price}, ${dishes.restaurant_id}, ${dishes.photo_number}, ${dishes.review_number}), `

    //reviews

    //images



pool.end();