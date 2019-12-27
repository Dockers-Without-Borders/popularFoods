-- this file only run via cqlsh, not via node

--  cheat sheet
-- describe keyspaces;
-- use popular_dish;
-- select * from carousel;

--  to import in schema
--  source './cassandraSchema.cql'
-- Connected to Test Cluster at 127.0.0.1:9042.


DROP KEYSPACE IF EXISTS popular_dish;

CREATE KEYSPACE IF NOT EXISTS   popular_dish 
 WITH REPLICATION = { 
      'class' : 'SimpleStrategy', 'replication_factor' : 2 };


use popular_dish;



CREATE TABLE popular_dish.carousel (
    restaurant_name VARCHAR,
    number_of_photos INT,
    number_of_reviews INT,
    price DECIMAL,
    thumbnail_image VARCHAR,
    dish_name VARCHAR,
    PRIMARY KEY (restaurant_name, dish_name)
-- only using one cluter here becasue there is only one dishpicture I need...
);

CREATE TABLE popular_dish.modal (
    -- partition over restaurant, or I can have a reference key that restaurant
    -- can I have two clustering keys
    -- cluter by dishname
    -- cluster by one other thing so they dont overwrite
    -- want to have two clusters here becuase there will be multiple dishes with the same name
    -- inside of the partition. also it clusters dishes because then we dont have to iterate over
    -- over all of the dishes in the restaurant
    restaurant_name VARCHAR,
    images_url VARCHAR,
    username VARCHAR,
    user_friends_number INT,
    user_reviews_number INT,
    user_avatar_url VARCHAR,
    dish_name VARCHAR,
    dish_caption VARCHAR,
    review_stars INT,
    review_text VARCHAR,
    created_at TIME,
    PRIMARY KEY (restaurant_name, dish_name, images_url)
);