const Controller = require('./controller/controller');
// This is a mock file for the client. So it will be making the requests for the client in the mean time

console.log('Post Requests')
// Controller.postgres.createImages();
// Controller.postgres.createReview();

console.log('Get Request')
// Controller.postgres.retrieveCarousel();
// Controller.postgres.retrieveModal();


console.log('Update Requests')
// Controller.postgres.updateReview();

console.log('Delete Requests')
// Controller.postgres.deleteImage();
// Controller.postgres.deleteReview();

console.log('Cassandra GET REQUEST')
// Controller.cassandra.getCarousel();



// work on this till like lunch and a little past it, then work on midpoint conversation notes and video, becasue then V and V is right after that

// run webpack then
// SET up the Client side and server to make requests to cassandra
// but also make it so that it will make requests to all different types of listings by id
// how will I filter that and turn it into a request though??
// I shouldnt have to reseed and make my primary key numbers, instead my end points should be restaurant names, so 
// if people want to go to a certain restaurant then they would put in that restaurants name!
// will have to understand how the router works? how it routes all of the routes to which endpoint??
