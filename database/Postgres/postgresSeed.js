const { Pool } = require('pg');
const { makeDishEntry, makeImageEntry, makeReviewEntry, makeUserEntry, makeRestaurantEntry } = require('../SampleData/dataGenerator.js') 
const { Promise } = require('bluebird');
const fs = require('fs');


////////////////////////////////////////////////// seeding script /////////////////////////////////////////////////////

// https://medium.com/@danielburnsart/writing-a-large-amount-of-data-to-a-csv-file-using-nodes-drain-event-99dcaded99b5
// Ways to Optimize this: 
// use waterthreshold method so things do not get over whemled, they drain and then continue doing their thing
// break up the script by using recusion to do like 1 million at a time
// need to use one seed script because i want to have certain table seeds be call backs of each other
// create multiple pools and have them run async?
// INCREASE the ram to make this process faster


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////// CREATE RESTAURANT CSV /////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const writeRestaurants = fs.createWriteStream('/Users/gurjot/popularFoods/database/Postgres/restaurant.csv');
// write headers
writeRestaurants.write('id,name,\n', 'utf8')

//drain + write script
function writeTenMillionRestaurants(writer, encoding, callback) {
    let i = 10000; // set this to one mill for now
    let id = 0;
    function write() {
      let ok = true;
      do {
        i -= 1;
        id += 1;
        const name = makeRestaurantEntry().name;
        const data = `${name}\n`;

        //Keep track using
        if (i%100000 === 0) {
            console.log('Writing data for restaurants into csv', i)
        }

        if (i === 0) {
          writer.write(data, encoding, callback);
        } else {
  // see if we should continue, or wait
  // don't pass the callback, because we're not done yet.
          ok = writer.write(data, encoding);
        }
      } while (i > 0 && ok);
      if (i > 0) {
  // had to stop early!
  // write some more once it drains
        writer.once('drain', write);
      }
    }
  write()
  }

  writeTenMillionRestaurants(writeRestaurants, 'utf-8', () => {
    writeRestaurants.end();
  });

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////// CREATE USER CSV /////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const writeUsers = fs.createWriteStream('/Users/gurjot/popularFoods/database/Postgres/users.csv');
// write headers
writeUsers.write('name,avartar_url,friends_number,reviews_number\n', 'utf8')

//drain + write script
function writeTwentyMillionUsers(writer, encoding, callback) {
    let i = 20000; //set this to two million for now
    let id = 0;
    function write() {
      let ok = true;
      do {
        i -= 1;
        id += 1;
        const { name, avatar_url, friends_number, reviews_number} = makeUserEntry();
        const data = `${name},${avatar_url},${friends_number},${reviews_number}\n`;

        //Keep track using
        if (i%100000 === 0) {
            console.log('Writing data for Users into csv', i)
        }

        // if finished then write last point and run callback
        if (i === 0) {
          writer.write(data, encoding, callback);
        } else {
        // see if we should continue, or wait
        // don't pass the callback, because we're not done yet.
          ok = writer.write(data, encoding);
        }
      } while (i > 0 && ok);
      if (i > 0) {
        // had to stop early!
        // write some more once it drains
        writer.once('drain', write);
      }
    }
  write()
  }

  writeTwentyMillionUsers(writeUsers, 'utf-8', () => {
    writeUsers.end();
  });


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////// CREATE DISHES CSV /////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const writeDishes = fs.createWriteStream('/Users/gurjot/popularFoods/database/Postgres/dishes.csv');
// write headers
writeDishes.write('name,price,restaurant_id,photo_number,review_number\n', 'utf8')

//drain + write script
function writeFiftyMillionDishes(writer, encoding, callback) {
    let i = 50000; //set this to five million for now
    let id = 0;
    function write() {
      let ok = true;
      do {
        i -= 1;
        id += 1;
        const restaurant_id = Math.ceil(id/5)
        // if we want to randomly distribute the foreign key then the data generators have a function for it
        const { name, price, photo_number,review_number} = makeDishEntry();
        const data = `${name},${price},${restaurant_id},${photo_number},${review_number}\n`;
        // restuarant id will break if there is not atleast 100 entries from retaurants since randomizer is set to 100
        // issue is still that these are not evenly distributed


        //Keep track using
        if (i%100000 === 0) {
            console.log('Writing data for Dishes into csv', i)
        }

        // if finished then write last point and run callback
        if (i === 0) {
          writer.write(data, encoding, callback);
        } else {
        // see if we should continue, or wait
        // don't pass the callback, because we're not done yet.
          ok = writer.write(data, encoding);
        }
      } while (i > 0 && ok);
      if (i > 0) {
        // had to stop early!
        // write some more once it drains
        writer.once('drain', write);
      }
    }
  write()
  }

  writeFiftyMillionDishes(writeDishes, 'utf-8', () => {
    writeDishes.end();
  });

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////// CREATE REVIEWS CSV /////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const writeReviews = fs.createWriteStream('/Users/gurjot/popularFoods/database/Postgres/reviews.csv');
// write headers
writeReviews.write('body,stars,user_id,dish_id,created_at,helpful,not_helpful\n', 'utf8')

//drain + write script
function writeHundredMillionReviews(writer, encoding, callback) {
    let i = 100000; //set this to 10 million for now instead of 100
    let id = 0;
    function write() {
      let ok = true;
      do {
        i -= 1;
        id += 1;
        const { body, stars, created_at,helpful,not_helpful} = makeReviewEntry();
        // since 2 user and 10 reviews per rest. each user must have 5 reviews
        const user_id = Math.ceil(id/5)
        const dish_id = Math.ceil(id/2) //two reviews per dish
        const data = `${body},${stars},${user_id},${dish_id},${created_at},${helpful},${not_helpful}\n`;

        //Keep track using
        if (i%100000 === 0) {
            console.log('Writing data for Reviews into csv', i)
        }

        // if finished then write last point and run callback
        if (i === 0) {
          writer.write(data, encoding, callback);
        } else {
        // see if we should continue, or wait
        // don't pass the callback, because we're not done yet.
          ok = writer.write(data, encoding);
        }
      } while (i > 0 && ok);
      if (i > 0) {
        // had to stop early!
        // write some more once it drains
        writer.once('drain', write);
      }
    }
  write()
  }

  writeHundredMillionReviews(writeReviews, 'utf-8', () => {
    writeReviews.end();
  });

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////// CREATE IMAGES CSV /////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const writeImages = fs.createWriteStream('/Users/gurjot/popularFoods/database/Postgres/images.csv');
// write headers
writeImages.write('source,caption,dish_id\n', 'utf8')

//drain + write script
function writeHundredMillionImages(writer, encoding, callback) {
    let i = 100000; //set this to 10 million for now instead of 100
    let id = 0;
    function write() {
      let ok = true;
      do {
        i -= 1;
        id += 1;
        const { source, caption} = makeImageEntry();
        const dish_id = Math.ceil(id/2) // 2 images per dish
        const data = `${source},${caption},${dish_id}\n`;

        //Keep track using
        if (i%100000 === 0) {
            console.log('Writing data for Images into csv', i)
        }

        // if finished then write last point and run callback
        if (i === 0) {
          writer.write(data, encoding, callback);
          console.log('QUERY TO DB NOW THAT WE ARE DONE MAKING CSVS')
          // this may be false and not finish querying the last stream of info
          queryToDB();
        } else {
        // see if we should continue, or wait
        // don't pass the callback, because we're not done yet.
          ok = writer.write(data, encoding);
        }
      } while (i > 0 && ok);
      if (i > 0) {
        // had to stop early!
        // write some more once it drains
        writer.once('drain', write);
      }
    }
  write()
  }


  // write all of the csvs as callbacks of each other, then finally when done then call the query
  // if i can't write all of the csv's in one file then run them seperately but with the final one, run the query script?
  writeHundredMillionImages(writeImages, 'utf-8', () => {
    writeImages.end();
  });


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////Seed to Database ////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let queryStringRestaurant = `COPY restaurants(name) FROM '/Users/gurjot/popularFoods/database/Postgres/restaurant.csv' DELIMITER ',' CSV HEADER;`
let queryStringUsers = `COPY users (name, avatar_url, friends_number, reviews_number) FROM '/Users/gurjot/popularFoods/database/Postgres/users.csv' DELIMITER ',' CSV HEADER;`
let queryStringDishes = `COPY dishes (name, price, restaurant_id, photo_number, review_number) FROM '/Users/gurjot/popularFoods/database/Postgres/dishes.csv' DELIMITER ',' CSV HEADER;`
let queryStringReviews = `COPY reviews (body, stars, user_id, dish_id, created_at, helpful, not_helpful) FROM '/Users/gurjot/popularFoods/database/Postgres/reviews.csv' DELIMITER ',' CSV HEADER;`
let queryStringImages = `COPY images (source, caption, dish_id) FROM '/Users/gurjot/popularFoods/database/Postgres/images.csv' DELIMITER ',' CSV HEADER;`

var pool = new Pool({
    database: 'test',
}) 

pool.query = Promise.promisify(pool.query);

var today = new Date();

//might look better if i promisify all on users and restaurant and the bunch the rest on one then statement

var queryToDB = function() {
    // RESTAURANTS
    pool.query(queryStringRestaurant)
    .then((res)=>{
        console.log('RESTAURANTS QUERY Success')
        // This was executed before the csv was done writing itself.
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
}

