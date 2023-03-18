// handlers are call controller in model view architecture
const fs = require('fs');
const Tour = require('../Model/tourModel');
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// exports.checkID = (req, res, next, val) => {
//   if (req.params.id * 1 > tours.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid ID',
//     });
//   }
//   next();
// };
//Dont need this as mongoose model will tae care of it
// exports.checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status: 'fail',
//       message: 'Missing name or price',
//     });
//   }
//   next();
// };

exports.getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find();
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  console.log(req.query.test);
  const tour = await Tour.findById(req.params.id);
  try {
    res.status(200).json({
      status: 'success',
      message: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
  // const id = req.params.id * 1;
  //removing repeated code - Is checked in checkID middleware
  // const tour = tours.find((el) => el.id === id);
  // res.status(200).json({
  //   status: 'success',
  //   data: {
  //     tour,
  //   },
  // });
};

exports.createTours = async (req, res) => {
  try {
    //const newTour = new Tour({})
    //newTour.save()
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: '😈success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    //removed repeated code
    res.status(200).json({
      status: 'success',
      data: {
        tour: 'Update tour here...',
      },
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    //rempved repeated code
    res.status(204).json({
      status: 'successfully deleted',
    });
  } catch (e) {
    res.status(404).json({
      status: '👹Failed',
    });
  }
};
