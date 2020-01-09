const cassandra = require('cassandra-driver');
const { Pool } = require('pg');


const authProvider = new cassandra.auth.PlainTextAuthProvider('gurjot','');
const contactPoints = ['44.230.88.231:9042']
module.exports = {
    pool: new Pool({
        database: 'yelp',
    }) ,

    client: new cassandra.Client({ contactPoints: contactPoints, authProvider: authProvider, keyspace: 'popular_dish', localDataCenter: 'us-west-2' }),
}


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
