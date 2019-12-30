const cassandra = require('cassandra-driver');
const { Pool } = require('pg');


const authProvider = new cassandra.auth.PlainTextAuthProvider('gurjot','');
const contactPoints = ['127.0.0.1:9042']
module.exports = {
    pool: new Pool({
        database: 'yelp',
    }) ,

    client: new cassandra.Client({ contactPoints: contactPoints, authProvider: authProvider, keyspace: 'popular_dish', localDataCenter: 'datacenter1' }),
}



// connect to Cassandra
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////// QUERY DATA FROM CASSANDRA /////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
// Cassandra driver does not allow me to use COPY, while querying and inserting works
// possibly try using node-cassandra-cql to see if it allows it. So currenyly this file will only create 
// CSV's and then import from cqlsh

//   const authProvider = new cassandra.auth.PlainTextAuthProvider('gurjot','');
//   const contactPoints = ['127.0.0.1:9042']
//   const client = new cassandra.Client({ contactPoints: contactPoints, authProvider: authProvider, keyspace: 'popular_dish', localDataCenter: 'datacenter1' });
  
//   client.connect(function (err) {
//     // assert.ifError(err);
//     if (err) {
//       console.log('fAILED to connect')
//     } else {
//       console.log('SUCCESS')
//     }
//     });
   
//     // if this works, then we can try using  copy instead of select, once we have made a csv, which will be easy
// //   const query = `COPY popular_dish.carousel (restaurant_name, dish_name, number_of_photos, number_of_reviews, price, thumbnail_image) FROM '/Users/gurjot/popularFoods/database/Cassandra/carousel.csv' WITH DELIMITER=',' AND HEADER=TRUE;`
// // define a select query  
// client.execute(query)
//     .then((data) => {
//       console.log('We have inserted something successfully')
//       client.shutdown();
//   });

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
