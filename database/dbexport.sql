--  add post gres schema instruction here
-- im not sure if this is the right file extension
-- psql dbname < infile
-- where infile is the file output by the pg_dump command. 
-- The database dbname will not be created by this command, so you must create it yourself from template0 
-- before executing psql (e.g., with createdb -T template0 dbname). psql supports options similar to pg_dump for specifying the
--  database server to connect to and the user name to use. See the psql reference page for more information.
--  or use createdb dbname from shell

DROP DATABASE IF EXISTS test;
CREATE DATABASE test;

\c test

-- Setting up some of the column names slightly different from what front end expects
-- adjust one side to make sure its compatible
-- 10 Mil
CREATE TABLE restaurants (
    id serial PRIMARY KEY,
    name varchar NOT NULL
);

-- 20 Mil
CREATE TABLE users (
    id serial PRIMARY KEY,
    name varchar(80),
    avatarURL varchar NOT NULL,
    friendsNumber INTEGER DEFAULT 0,
    reviewsNumber INTEGER DEFAULT 0
);

-- (2xDishes) 100 mil
CREATE TABLE images (
    id serial PRIMARY KEY,
    source varchar NOT NULL,
    caption varchar
    -- add a caption category here as well
    -- dish_id INTEGER NOT NULL,
    FOREIGN KEY (dish_id) REFERENCES dishes (id)
);

-- (2xDishes) 100 mil
CREATE TABLE reviews (
    id serial PRIMARY KEY,
    body varchar NOT NULL,
    stars INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    dish_id INTEGER NOT NULL,
    created_on TIMESTAMP NOT NULL DEFAULT NOW(),
    helpful INTEGER DEFAULT 0,
    notHelpful INTEGER DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (dish_id) REFERENCES dishes (id)
);

-- (5xRestaurants) 50 Mil
CREATE TABLE dishes (
    id serial PRIMARY KEY,
    name varchar(80),
    price INTEGER NOT NULL,
    restaurant_id INTEGER NOT NULL,
    photo_number INTEGER,
    review_number INTEGER,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants (id)
    -- image_id INTEGER NOT NULL,
    -- review_id INTEGER NOT NULL,
    -- FOREIGN KEY (image_id) REFERENCES images (id),
    -- needs a number of total images
    -- needs a number of total reviews
);

