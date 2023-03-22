const express = require('express');
const fs = require('fs');
const morgan = require('morgan');
//import Router
const tourRouter = require('./routes/tourRoutes'); //getting the router
const userRouter = require('./routes/userRoutes');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); //calling morgan will return a function
}
//2)MIDDLEWARES
app.use(express.json()); //returns a function which gets added to middleware stack
app.use(express.static(`${__dirname}/public`));
//In the below code we create our own middle ware
app.use((req, res, next) => {
  console.log('Hello from the middleware');
  next();
});
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// app.get('/api/v1/tours', getAllTours)
// app.get('/api/v1/tours/:id',getTour)
// app.post('/api/v1/tours', createTour)
// app.patch('/api/v1/tours/:id',updateTour)
// app.delete('/api/v1/tours/:id',updateTour)
// app.get('/api/v1/tours/:id',deleteTour)
//3)ROUTES
//tour router
app.use('/api/v1/tours', tourRouter); //mounting the router on tour routes
//user router
app.use('/api/v1/users', userRouter); //mounting the router on user route
//4)SERVER
module.exports = app;
