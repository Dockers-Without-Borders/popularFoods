// This needs to make a connection with the data base
// then it needs to insert, the same way its done in sql

// sample query that worked
// cqlsh:populardishcass> insert into carousel (restaurantname, dishname, 
// numberofphotos, numberofreviews, price, thumbnailimage) values ('gurrest', 'pizza', 5, 10, 12, 'someimgages')


// cheat sheet
// select * from carousel;

//use populardishcass;

//describe keyspaces;

// to import in schema
// source './cassandra.cql'