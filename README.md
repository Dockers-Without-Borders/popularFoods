### Component: popularFoods


## Api Requests

# Create/POST
> Post a dish photo to the retaurant: 
> **/post/:restaurantId/images**

> Post a review regarding a restaurant:
> **/post/:restaurantId/reviews**

# Retrieve/GET
> Retrieve all of the popular dishes (images not included) associated with this restaurant. (no logic yet to determine what makes the dish popular, maybe add a boolean?)
> **/api/dishes**

> Retrieve the first image that matches this dish Id
> **/api/:restaurantId/images/thumbnail/:dishId**

> Retrieve all the images associated with this dish Id
> **/api/:restaurantId/images/dish/:dishId**

> Retrieve the reviews associated with a dish name along with the users that commented on these reviews (uses a join)
> **/api/:restaurantId/reviews/dish/:dish**


# Update/PUT
> To edit your review regarding a dish
> **/edit/:restaurantId/reviews/:dish**

# Delete/DELETE
> To remove your review regarding a dish
> **/delete/reviews/:dish** 

> To delete and image of a dish
> **/delete/images/:dish**

- - 
* * *
## Current Shape of the Data (as provided in legacy code), Match Backend to provide this data so the client does not break

# Carousel (main component) - These are based on what the client needs, the other data is extra
Endpoint: /api/dishes
Returns: 
[{
    id:
    name:
    imageUrl? or URL -- this actually doesn't exist in the dish table so its undefined. That is why client does another get req in its child
    price:
    photoNumber
    reviewNumber
}, {} , {}, etc..]

# From the console.logs
{
    createdAt: "2019-12-18T18:25:33.000Z"
    id: 1
    name: "soup"
    photoNumber: 2
    price: "31"
    restaurantId: 26
    reviewNumber: 29
    updatedAt: "2019-12-18T18:25:33.000Z"
}

# Carousel Item 
Endpoint: api/images/thumbnail/${dishId}
Returns: [{
source: url of image
}]

# modal 
# fetchDishPicturesData
Endpoint: api/images/dish/${params}
params = dishes[i].id
these dishes refer to the dishes from the get req of the main carousel.
[{
source: 
caption:
}, {}, {}]

# From the console.log
first item in the array of 5
{caption: "Greens!"
createdAt: "2019-12-18T18:25:33.000Z"
dishId: 2
id: 3
source: "https://images.unsplash.com/photo-1564929360162-73cd686db4a1?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjF9"
updatedAt: "2019-12-18T18:25:33.000Z"}

# fetchDishReviewData
Endpoint: api/reviews/dish/${currentdishid}
Returns:
[{
user: {
      name: 
      friendsNumber:
      reviewsNumber: 
      avatarURL:
    },
dish: {
      name:
    },
body: STRING paragraph of comment content,
starts: 1-5 Numbers,
createdAt:

}, {}, {}...]

# data shape based on console.log
{
    body: "Quos laudantium doloremque numquam sit alias. Explicabo laborum similique. Voluptas perferendis totam consectetur magnam autem nam. Minima et saepe nemo. Deleniti expedita error quisquam quam id reiciendis omnis. Earum laudantium sed illum ut deserunt quidem debitis qui in.",
    createdAt: "2019-12-18T18:25:33.000Z",
    dish: {
        createdAt: "2019-12-18T18:25:33.000Z"
        id: 2
        name: "salad"
        photoNumber: 5
        price: "12"
        restaurantId: 63
        reviewNumber: 25
        updatedAt: "2019-12-18T18:25:33.000Z"
    },
    dishId: 2,
    id: 2,
    stars: 3,
    updatedAt: "2019-12-18T18:25:33.000Z"
    user: {
        avatarURL: "https://randomuser.me/api/portraits/thumb/men/60.jpg"
        createdAt: "2019-12-18T18:25:33.000Z"
        friendsNumber: 20
        id: 17
        name: "Ryleigh McDermott"
        reviewsNumber: 18
        updatedAt: "2019-12-18T18:25:33.000Z"
    }
    userId: 17
}
