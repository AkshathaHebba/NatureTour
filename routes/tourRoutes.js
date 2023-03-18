const express = require('express');
const fs = require('fs');
const tourController = require('../controllers/tourController');
// tourRouter is a middleware that runs on the below mentioned api
const router = express.Router();

//middle ware
// router.param('id', tourController.checkID);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTours); //middleware chaining

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
