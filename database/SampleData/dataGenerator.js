const faker = require('faker');

const foodImages = [
    "https://food-photos-yelp.s3-us-west-1.amazonaws.com/tuna.jpg",
    "https://food-photos-yelp.s3-us-west-1.amazonaws.com/10_JiroSushi_TooMuchFOMO_8162076064_7198734377_o_2.jpg",
    "https://food-photos-yelp.s3-us-west-1.amazonaws.com/Shrimp_sushi.jpg",
    "https://food-photos-yelp.s3-us-west-1.amazonaws.com/jiro-dreams-of-sushi-food-porn-thumb.0.jpg",
    "https://food-photos-yelp.s3-us-west-1.amazonaws.com/tumblr_mazpatl0My1qzfo9go1_500.png",
    "https://food-photos-yelp.s3-us-west-1.amazonaws.com/1472707651.jpg",
    "https://food-photos-yelp.s3-us-west-1.amazonaws.com/sukiyabashi-jiro-roppongi.jpg",
    "https://food-photos-yelp.s3-us-west-1.amazonaws.com/photo_04.jpg",
    "https://food-photos-yelp.s3-us-west-1.amazonaws.com/images.jpeg",
    "https://food-photos-yelp.s3-us-west-1.amazonaws.com/LXQjNbk.jpg",
    "https://food-photos-yelp.s3-us-west-1.amazonaws.com/tumblr_mazpatl0My1qzfo9go1_500.png",
    "https://food-photos-yelp.s3-us-west-1.amazonaws.com/jiro-sushi.jpg",
    "https://food-photos-yelp.s3-us-west-1.amazonaws.com/1472707651.jpg",
    "https://food-photos-yelp.s3-us-west-1.amazonaws.com/8162045693_1ee8cf2069_z.jpg",
    "https://food-photos-yelp.s3-us-west-1.amazonaws.com/images.jpeg",
    "https://food-photos-yelp.s3-us-west-1.amazonaws.com/sukiyabashi-jiro-roppongi.jpg",
    "https://food-photos-yelp.s3-us-west-1.amazonaws.com/10_JiroSushi_TooMuchFOMO_8162076064_7198734377_o_2.jpg",
    "https://food-photos-yelp.s3-us-west-1.amazonaws.com/b0c4069330976ec61902be1c7fc40e34.jpg",
    "https://food-photos-yelp.s3-us-west-1.amazonaws.com/jiro1.jpg",
    "https://food-photos-yelp.s3-us-west-1.amazonaws.com/fixedw_large_4x.jpg"
]

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
'Pound Cake, Nutella', 'Grilled Cheese', 'Pancakes', 'Waffles', 'Pork Chops', 'Sausages', 'Kebabs', 'Kebab', 'Ravioli', 'Eggplant Parmesan',
'Tortilla', 'Omelette', 'Fried Eggs', 'Hard Boiled Eggs', 'Egg Fried Rice', 'Fried Noodles, Pad Thai', 'Haddock', 'Fortune Cookies', 'Mashed Potatoes',
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
            name: `${faker.name.firstName()} ${faker.name.lastName()}`,
            avatarURL: `https://randomuser.me/api/portraits/thumb/${userGender}/${userNumber}.jpg`,
            friendsNumber: Math.floor(Math.random() * 101),
            reviewsNumber: Math.floor(Math.random() * 101)
        }
        return newUserEntry;
    },
    makeReviewEntry: function () {
        const newReviewEntry = {
            body: faker.lorem.paragraph(),
            stars: Math.floor((Math.random() * 5) + 1),
            userId: Math.floor((Math.random() * 50) + 1),
            dishId: Math.floor((Math.random() * 10) + 1),
            // this says fake, not sure how fake works
            createdAt: faker.date.between('2000-01-01', '2019-12-31'),
            helpful: Math.floor(Math.random()*20),
            notHelpful: Math.floor(Math.random()*8)
        }
        return newReviewEntry;
    },
    makeDishEntry: function () {
        let name = Math.floor((Math.random() * 110) + 1);
        const newDishEntry = {
            name: name,
            price: Math.floor(Math.random() * 40 + 7) + Math.random(),
            restaurant_id: Math.floor(Math.random() * 100 + 1),
            photo_number: Math.floor(Math.random() * 5 + 2),
            review_number: Math.floor(Math.random() * 50)
        }
        return newDishEntry;
    },
    makeImageEntry: function () {
        const newImageEntry = {
            source: foodImages[Math.floor(Math.random() * 21)],
            caption: faker.lorem.sentence(word_count = 4),
            dishId: Math.floor((Math.random() * 10) + 1)
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