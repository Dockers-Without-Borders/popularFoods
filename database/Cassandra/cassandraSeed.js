const cassandra = require('cassandra-driver');
const assert = require('assert'); // if this does not exist
const { makeDishEntry, makeImageEntry, makeReviewEntry, makeUserEntry, makeRestaurantEntry } = require('../SampleData/dataGenerator.js') 
const { Promise } = require('bluebird');
const fs = require('fs');

/////////////////////////////////////// CREATE CSV /////////////////////////////////////////////

var today = new Date();
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////// CREATE CarouselCSV /////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const writeCarousel = fs.createWriteStream('/Users/gurjot/popularFoods/database/Cassandra/carousel.csv');
// write headers
writeCarousel.write('restaurant_name,dish_name,number_of_photos,number_of_reviews,price,thumbnail_image\n', 'utf8')

//drain + write script
function writeTenMillionCarousel(writer, encoding, callback) {
    let i = 10;
    function write() {
      let ok = true;
      do {
        i -= 1;
        const restaurant = makeRestaurantEntry(); // I can make things cleaner by using same variable names as what the data generators have
        const dish = makeDishEntry();
        const image = makeImageEntry();
        const restaurant_name = restaurant.name
        const number_of_photos = dish.photo_number
        const number_of_reviews = dish.review_number
        const thumbnail_image = image.source
        const dish_name = dish.name
        const price = dish.price
        const data = `${restaurant_name},${dish_name},${number_of_photos},${number_of_reviews},${price},${thumbnail_image}\n`;

        //Keep track using
        if (i%100000 === 0) {
            console.log('Writing data for Carousel into csv', i)
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

  writeTenMillionCarousel(writeCarousel, 'utf-8', () => {
    writeCarousel.end();
  });

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////// SEED DATA INTO CASSANDRA /////////////////////////////////////////////////////////////////////////
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



// what are the chances that there will be a restaurant with the same name and same dish
// because thats how im partioning things, may run into issues.


// how to import data into cql using csv in cqlsh ONLY
// COPY keypsace.tableName (col1,col2,col3.....) FROM 'file/file.csv' WITH DELIMITER=',' AND HEADER=TRUE;
// https://medium.com/@erbalvindersingh/importing-data-into-cassandra-with-csv-a006ff5f2904
// https://docs.datastax.com/en/dse/5.1/cql/cql/cql_using/useInsertCopyCSV.html