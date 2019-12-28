const cassandra = require('cassandra-driver');
const { makeDishEntry, makeImageEntry, makeReviewEntry, makeUserEntry, makeRestaurantEntry } = require('../SampleData/dataGenerator.js') 
const fs = require('fs');


var now = new Date();
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////// CREATE CSV ////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const writeCarousel = fs.createWriteStream('/Users/gurjot/popularFoods/database/Cassandra/carousel.csv');
const writeModal = fs.createWriteStream('/Users/gurjot/popularFoods/database/Cassandra/modal.csv');
// write headers
writeCarousel.write('restaurant_name,dish_name,number_of_photos,number_of_reviews,price,thumbnail_image\n', 'utf8')
writeModal.write('restaurant_name,images_url,username,user_friends_number,user_reviews_number,user_avatar_url,dish_name,dish_caption,review_stars,review_text,created_at\n', 'utf8')

//drain + write script
function createCSV(carouselWriter, modalWriter, encoding, carouselCallback, modalCallback) {
    var i = 1000; // this will need to iterate to a 100,000,000
    var restaurant, dish;
    function write() {
      let ok_carousel = true;
      let ok_modal = true;
      do {
        if (i%10 === 0) {
          // so every 10 entries, it regenerates a new restaurant, otherwise it uses the same
          restaurant = makeRestaurantEntry();
        }
        if (i%2===0) {
          //generates a new dish every two 
          dish = makeDishEntry();

        }
        // the carousel only needs one img for the thumbnail so only write into carousel if its divisible by 2
        // where as write into the modal every time, and these need to be done together because this is how the 
        // carousel will know which modal goes with it, assuming we have enough unique resturant names and dishes

         //Keep track of how much csv has been written, logs every 10,000 entries
         if (i%10000 === 0) {
          console.log('Writing data for Carousel into csv', i)
      }

        i -= 1;

        const image = makeImageEntry();
        const review = makeReviewEntry();
        const user = makeUserEntry(); // each user has random number of reviews
        const restaurant_name = restaurant.name
        const number_of_photos = dish.photo_number
        const number_of_reviews = dish.review_number
        const thumbnail_image = image.source
        const dish_name = dish.name
        const price = dish.price

        const images_url = image.source
        const username = user.name
        const user_friends_number = user.friends_number
        const user_reviews_number = user.reviews_number
        const user_avatar_url = user.avatar_url
        const dish_caption = image.caption
        const review_text = review.body
        const review_stars = review.stars
        const created_at = review.created_at
        // technically this should be 5 but since I am ramdomizing it it will be hard to keep track of
        // i would have to increment this as i am making it, but also somehow limit it to 5 so the same name doesnt randomly show up
        // more or less than 5 times. it might almost make more sense to have a whole new data generator for cassandra

        const carouselData = `${restaurant_name},${dish_name},${number_of_photos},${number_of_reviews},${price},${thumbnail_image}\n`;
        const modalData = `${restaurant_name},${images_url},${username},${user_friends_number},${user_reviews_number},${user_avatar_url},${dish_name},${dish_caption},${review_stars},${review_text},${created_at}\n`;

        // IF THIS DOESNT MAKE SENSE THEN I CAN BREAK IT UP INTO TWO DIFFERENT CONDITIONAL STATEMENTS

        if (i === 0) { // write last entry and quit
          carouselWriter.write(carouselData, encoding, carouselCallback); // ends up with one extra extry
          modalWriter.write(modalData, encoding, modalCallback);
          console.log('TIME TO CREATE BOTH CSV in seconds', (new Date()-now)/1000)
          console.log('Run the following commands in the cqlsh to seed to cassandra once csvs are made');
          console.log('Step 1: import scehma, Step 2: copy over csv files')
          console.log(`source './cassandraSchema.cql';`); // this can look slightly different if one needs to sign in to cqlsh
          console.log(`COPY popular_dish.carousel (restaurant_name, dish_name, number_of_photos, number_of_reviews, price, thumbnail_image) FROM '/Users/gurjot/popularFoods/database/Cassandra/carousel.csv' WITH DELIMITER=',' AND HEADER=TRUE;`)
          console.log(`COPY popular_dish.modal (restaurant_name, images_url, username, user_friends_number, user_reviews_number, user_avatar_url, dish_name, dish_caption, review_stars, review_text, created_at) FROM '/Users/gurjot/popularFoods/database/Cassandra/modal.csv' WITH DELIMITER=',' AND HEADER=TRUE;`)
        } else {
          // write to csv, and check where we are on the highwater mark for both
          if ((i-1)%2===0) {
            ok_carousel = carouselWriter.write(carouselData, encoding); // only need the first img url for thumbnail, not both
          }
          ok_modal = modalWriter.write(modalData, encoding);
        }
      } while (i > 0 && ok_carousel && ok_modal); // this should stop writing till both are ok

      if (i > 0) { 

  // drain event is fired when it is okay to start pumping in data again, I wonder if the drain event is like a green light
  // so i could use it like a conditional
  // if I run it, will it work or will it only be available when the high water mark is reached. 
  // no the drain event only goes off once, and only if the high water

          if (!ok_modal && !ok_carousel) {
            // I need to check and make sure the drain event of both happens, caoursel should always happen first?
            // i assume becasue its less data so easier to drain. however, what if the event goes off and I was not listening
            const drainModal = () => {
              modalWriter.once('drain',write)
            }
            
            carouselWriter.once('drain', drainmModal)
          } else if (!ok_carousel) {
            carouselWriter.once('drain',write)
          } else {
            modalWriter.once('drain', write)
          }

      }
    }
  write()
  }

  const cb1 = () => {
    writeCarousel.end();
  }
  const cb2 = () => {
    writeModal.end();
  }
  createCSV(writeCarousel, writeModal, 'utf-8', cb1, cb2);

// test if this will run 100 listings of both. YES
// then test if it works when highwater mark is reach. YES
// then split the firs up into 50 mil as it should be and second table into 100 mil as it should be YES
// Create another copy script for the modal table
// also another room for improvement with the data is to make users url smaller? its only 20 mill though, might still help thoug






////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////// QUERY DATA FROM CASSANDRA /////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
// Cassandra driver does not allow me to use COPY, while querying and inserting works
// possibly try using node-cassandra-cql to see if it allows it. So currenyly this file will only create 
// CSV's and then import from cqlsh

  // const authProvider = new cassandra.auth.PlainTextAuthProvider('gurjot','');
  // const contactPoints = ['127.0.0.1:9042']
  // const client = new cassandra.Client({ contactPoints: contactPoints, authProvider: authProvider, keyspace: 'popular_dish', localDataCenter: 'datacenter1' });
  
  // client.connect(function (err) {
  //   // assert.ifError(err);
  //   if (err) {
  //     console.log('fAILED to connect')
  //   } else {
  //     console.log('SUCCESS')
  //   }
  //   });
   
  //   // if this works, then we can try using  copy instead of select, once we have made a csv, which will be easy
  // const query = `COPY popular_dish.carousel (restaurant_name, dish_name, number_of_photos, number_of_reviews, price, thumbnail_image) FROM '/Users/gurjot/popularFoods/database/Cassandra/carousel.csv' WITH DELIMITER=',' AND HEADER=TRUE;`
  // client.execute(query)
  //   .then((data) => {
  //     console.log('We have inserted something successfully')
  //     client.shutdown();
  // });

// sample query that worked
// cqlsh:populardishcass> insert into carousel (restaurantname, dishname, 
// numberofphotos, numberofreviews, price, thumbnailimage) values ('gurrest', 'pizza', 5, 10, 12, 'someimgages')


// cheat sheet
// select * from carousel;

//use populardishcass;

//describe keyspaces;

// to import in schema
// source './cassandra.cql'

// how to import data into cql using csv in cqlsh ONLY
// COPY keypsace.tableName (col1,col2,col3.....) FROM 'file/file.csv' WITH DELIMITER=',' AND HEADER=TRUE;
// https://medium.com/@erbalvindersingh/importing-data-into-cassandra-with-csv-a006ff5f2904
// https://docs.datastax.com/en/dse/5.1/cql/cql/cql_using/useInsertCopyCSV.html



