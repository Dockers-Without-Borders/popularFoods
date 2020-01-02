const faker = require('faker');

const foodImages = [
    "tuna.jpg",
    "10_JiroSushi_TooMuchFOMO_8162076064_7198734377_o_2.jpg",
    "Shrimp_sushi.jpg",
    "jiro-dreams-of-sushi-food-porn-thumb.0.jpg",
    "tumblr_mazpatl0My1qzfo9go1_500.png",
    "1472707651.jpg",
    "sukiyabashi-jiro-roppongi.jpg",
    "photo_04.jpg",
    "images.jpeg",
    "LXQjNbk.jpg",
    "tumblr_mazpatl0My1qzfo9go1_500.png",
    "jiro-sushi.jpg",
    "1472707651.jpg",
    "8162045693_1ee8cf2069_z.jpg",
    "images.jpeg",
    "sukiyabashi-jiro-roppongi.jpg",
    "10_JiroSushi_TooMuchFOMO_8162076064_7198734377_o_2.jpg",
    "b0c4069330976ec61902be1c7fc40e34.jpg",
    "jiro1.jpg",
    "fixedw_large_4x.jpg"
]

//created new s3 bucket for more photos with easier endpoints
// sample: https://yelppopulardishes.s3-us-west-1.amazonaws.com/1.jpg
// for storage, all we need to save is a number

// food Images template
// "https://food-photos-yelp.s3-us-west-1.amazonaws.com/{add end point here}

const foodNames = [ 'Apple Pie', 'Apple Crumble', 'Macaroni and Cheese', 'Chicken Breast', 'Fried Chicken',
'Chili Con Carne', 'Enchiladas', 'Enchiladas Verdes', 'Fajitas', 'Burrito', 'Tacos', 'Quesadillas', 'Steak', 'Hamburger',
'Cheeseburger', 'Fish Burger', 'Chicken Burger', 'Hot Dog', 'Sandwich', 'Poutine', 'Fries', 'Sweet Potato Fries', 'Cheese Fries',
'Waffle Fries', 'Curly Fries', 'Home Fries', 'Potato Chips', 'Potato Salad', 'Potatoes Au Gratin', 'Roast Potatoes',
'Baked Potatoes', 'Fish and Chips', 'Salmon', 'Tempura (天ぷら)', 'Sushi', 'Sashimi', 'Gyoza', 'Tamagoyaki', 'Mochi', 'Miso Soup',
'Ramen', 'Yakitori (焼き鳥)', 'Japanese Curry', 'Rice', 'Nem', 'Noodles', 'Peking Duck', 'Thai Red Curry', 'Thai Green Curry',
'Yellow Curry', 'Curry', 'Chicken Parmigana', 'Pasta Pesto', 'Spaghetti Alla Carbonara', 'Spaghetti Bolognese', 'Lasagna',
'Linguine With Clam Sauce', 'Spaghetti Aglio E Olio', 'Baked Ziti', 'Pasta Salad', 'Risotto', 'Four Cheese Pizza', 
'Margherita Pizza', 'Marinara', 'Pepperoni Pizza', 'Chorizo Pizza', 'Pizza Caprese', 'Tiramisu', 'Panna Cotta', 'Chocolate Souffle',
'Molten Chocolate Cake', 'Chocolate Fondue', 'Strawberry Pie', 'Raspberry Pie', 'Clafoutis', 'Cheese Souffle', 'Naan', 'Chicken Korma',
'Chicken Tikka Masala', 'Tarka Daal', 'Garlic Bread', 'Gelato', 'Ice Cream', 'Sorbet', 'Cupcakes', 'Chocolate Chip Cookies',
'Nutella', 'Pound Cake', 'Grilled Cheese', 'Pancakes', 'Waffles', 'Pork Chops', 'Sausages', 'Kebabs', 'Kebab', 'Ravioli', 'Eggplant Parmesan',
'Tortilla', 'Omelette', 'Fried Eggs', 'Hard Boiled Eggs', 'Egg Fried Rice', 'Fried Noodles', 'Pad Thai', 'Haddock', 'Fortune Cookies', 'Mashed Potatoes',
'Smiley Potatoes', 'Macarons', 'Barbecue Ribs'
]

module.exports = {
    makeUserEntry: function () {
        let userNumber = Math.floor(Math.random() * 100);
        let userGender;
        if (Math.floor(Math.random() * 2) === 0) {
            userGender = 'women';
        } else {
            userGender = 'men';
        }
        const newUserEntry = {
            // also another room for improvement with the data is to make users url smaller? its only 20 mill though, might still help thoug
            // this will help becasue for cassandra this is actually 100 mil entries
            // include endpoint only, the origin will be https://randomuser.me/api/portraits/thumb
            name: `${faker.name.firstName()} ${faker.name.lastName()}`,
            avatar_url: `/${userGender}/${userNumber}.jpg`,
            friends_number: Math.floor(Math.random() * 101),
            reviews_number: Math.floor(Math.random() * 101)
        }
        return newUserEntry;
    },
    makeReviewEntry: function () {
        let time = faker.date.between('2000-01-01', '2019-12-31');
        time = time.toString().slice(0,24) // sliced off extra zone information
        const newReviewEntry = {
            body: faker.lorem.words(), // shortened from paragraph to words
            stars: Math.floor((Math.random() * 5) + 1),
            user_id: Math.floor((Math.random() * 50) + 1),
            dish_id: Math.floor((Math.random() * 10) + 1),
            created_at: time, // saved as a string data type becasue shape didnt match that of the db
            // helpful: Math.floor(Math.random()*20), // not enough space on mac
            // not_helpful: Math.floor(Math.random()*8)
        }
        return newReviewEntry;
    },
    makeDishEntry: function () {
        let name = foodNames[Math.floor((Math.random() * foodNames.length) + 1)];
        const newDishEntry = {
            name: name,
            price: (Math.floor((Math.floor(Math.random() * 40 + 7) + Math.random()) * 100)) / 100 ,
            restaurant_id: Math.floor(Math.random() * 100 + 1),
            photo_number: 2, // limiting it so 10 mil data points dont get out of hand
            review_number: 2 // limited number of reviews as well
            // photo_number: Math.floor(Math.random() * 5 + 2), 
            // review_number: Math.floor(Math.random() * 50)
        }
        return newDishEntry;
    },
    makeImageEntry: function () {
        const newImageEntry = {
            source: Math.floor(Math.random() * 101), // this assumes there are 100 scraped images in the buckets
            caption: faker.lorem.sentence(word_count = 2),
            dish_id: Math.floor((Math.random() * 10) + 1)
        }
        return newImageEntry;
    },
    makeRestaurantEntry: function () {
        const newRestaurant = {
            name: faker.lorem.words()
        }
        return newRestaurant;
    }
}