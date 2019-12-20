CREATE KEYSPACE IF NOT EXISTS popularDishCass
 WITH REPLICATION = { 
      'class' : 'SimpleStrategy', 'replication_factor' : 2 } 
   }
   [AND DURABLE_WRITES =  true] ;

CREATE TABLE popularDishCass.carousel (
    -- partition key?

    -- cluster id ? partition over the retaurant by making it primary key
    restaurantName VARCHAR,
    numberOfPhotos INT,
    numberOfReviews INT,
    price INT,
    thumbnailImage VARCHAR,
    dishName VARCHAR,
    PRIMARY KEY (restuarantName, dishName)
    -- only using one cluter here becasue there is only one dishpicture I need...
)

CREATE TABLE popularDishCass.modal (
    -- partition over restaurant, or I can have a reference key that restaurant
    -- can I have two clustering keys
    -- cluter by dishname
    -- cluster by one other thing so they dont overwrite
    -- want to have two clusters here becuase there will be multiple dishes with the same name
    -- inside of the partition. also it clusters dishes because then we dont have to iterate over
    -- over all of the dishes in the restaurant
    restaurantName VARCHAR,
    imagesUrl VARCHAR,
    username VARCHAR,
    userFriendsNumber INT,
    userReviewsNumber INT,
    userAvatarUrl VARCHAR,
    dishName VARCHAR,
    dishCaption VARCHAR,
    reviewStars INT,
    reviewText VARCHAR,
    createdAt TIME,
    PRIMARY KEY (restaurantName, dishName, imagesUrl)
)