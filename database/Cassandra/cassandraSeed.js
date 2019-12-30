const { makeDishEntry, makeImageEntry, makeReviewEntry, makeUserEntry, makeRestaurantEntry } = require('../SampleData/dataGenerator.js') 
const fs = require('fs');


var now = new Date();
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////// CREATE CSV ////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const writeCarousel = fs.createWriteStream('/Volumes/USB DISK/Cassandra/carousel.csv');
const writeModal = fs.createWriteStream('/Volumes/USB DISK/Cassandra/modal.csv');
// write headers
writeCarousel.write('id,restaurant_name,dish_name,number_of_photos,number_of_reviews,price,thumbnail_image\n', 'utf8')
writeModal.write('id,restaurant_name,images_url,username,user_friends_number,user_reviews_number,user_avatar_url,dish_name,dish_caption,review_stars,review_text,created_at\n', 'utf8')

//drain + write script
function createCSV(carouselWriter, modalWriter, encoding, carouselCallback, modalCallback) {
    var i = 100; // this will need to iterate to a 100,000,000
    var id = 0;
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

         //Keep track of how much csv has been written, logs every 10,000 entries
         if (i%10000 === 0) {
          console.log('Writing data for Carousel into csv', i)
      }

        i -= 1;
        id += 1;

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
        const user_reviews_number = user.reviews_number // this is difficult to achieve acurrately, I'd have to keep a cache of which user put in how many comments
        // not just randomize it the way i have
        const user_avatar_url = user.avatar_url
        const dish_caption = image.caption
        const review_text = review.body
        const review_stars = review.stars
        const created_at = review.created_at

        const carouselData = `${id},${restaurant_name},${dish_name},${number_of_photos},${number_of_reviews},${price},${thumbnail_image}\n`;
        const modalData = `${id},${restaurant_name},${images_url},${username},${user_friends_number},${user_reviews_number},${user_avatar_url},${dish_name},${dish_caption},${review_stars},${review_text},${created_at}\n`;

        if (i === 0) { // write last entry and quit
          carouselWriter.write(carouselData, encoding, carouselCallback); // ends up with one extra extry
          modalWriter.write(modalData, encoding, modalCallback);
          console.log('TIME TO CREATE BOTH CSV in seconds', (new Date()-now)/1000)
          console.log('Run the following commands in the cqlsh to seed to cassandra once csvs are made');
          console.log('Step 1: import scehma, Step 2: copy over csv files')
          console.log(`source './cassandraSchema.cql';`); // this can look slightly different if one needs to sign in to cqlsh
          console.log(`COPY popular_dish.carousel (restaurant_name, dish_name, number_of_photos, number_of_reviews, price, thumbnail_image) FROM '/Volumes/USB DISK/Cassandra/carousel.csv' WITH DELIMITER=',' AND HEADER=TRUE;`)
          console.log(`COPY popular_dish.modal (restaurant_name, images_url, username, user_friends_number, user_reviews_number, user_avatar_url, dish_name, dish_caption, review_stars, review_text, created_at) FROM '/Volumes/USB DISK/Cassandra/modal.csv' WITH DELIMITER=',' AND HEADER=TRUE;`)
        } else {
          // write to csv, and check where we are on the highwater mark for both
          if ((i-1)%2===0) {
            ok_carousel = carouselWriter.write(carouselData, encoding); // only need the first img url for thumbnail, not both. so carosel table should be half of modal in terms of rows
          }
          ok_modal = modalWriter.write(modalData, encoding);
        }
      } while (i > 0 && ok_carousel && ok_modal); // this should stop writing till both are ok

      if (i > 0) { 

          if (!ok_modal && !ok_carousel) {
            // If the drain event of modal went off before carousel, would this code break? becuase my code was not even listening for it
            // Not sure if that is possible, but I have set it up so it listens to carousel first, which should drain faster being a smaller table
            const drainModal = () => {
              modalWriter.once('drain',write)
            }
            carouselWriter.once('drain', drainModal) // i had mispelled drainModal here so idk if this works right now. delete ths comment after reseed

          } else if (!ok_carousel) {
            carouselWriter.once('drain',write)
          } else {
            modalWriter.once('drain', write)
          }

      }
    }
  write()
  }

  const endCarousel = () => {
    writeCarousel.end();
  }
  const endModal = () => {
    writeModal.end();
  }
  createCSV(writeCarousel, writeModal, 'utf-8', endCarousel, endModal);




// re seed
// find a way to write tests that will test the last 10% of cassandra
// tmrw at school download the benchmark software since it has a 14 day trail

