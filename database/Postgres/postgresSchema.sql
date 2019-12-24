-- it may be better practice to keep naming scheme consistent, such as
-- either camelcase or use _ underscores. front end uses mix however?

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

-- (5xRestaurants) 50 Mil
CREATE TABLE dishes (
    id serial PRIMARY KEY,
    name varchar(80),
    price INTEGER NOT NULL,
    restaurant_id INTEGER NOT NULL,
    photo_number INTEGER,
    review_number INTEGER,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants (id)
);

-- (2xDishes) 100 mil
CREATE TABLE reviews (
    id serial PRIMARY KEY,
    body varchar NOT NULL,
    stars INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    dish_id INTEGER NOT NULL,
    -- may not necesarrily want to have the current time since reviews aren't posted when they are seeded
    createdAt TIMESTAMP NOT NULL DEFAULT NOW(),
    helpful INTEGER DEFAULT 0,
    notHelpful INTEGER DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (dish_id) REFERENCES dishes (id)
);

-- (2xDishes) 100 mil
CREATE TABLE images (
    id serial PRIMARY KEY,
    source varchar NOT NULL,
    caption varchar,
    dish_id INTEGER NOT NULL,
    FOREIGN KEY (dish_id) REFERENCES dishes (id)
);


