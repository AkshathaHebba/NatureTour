// handlers are call controller in model view architecture
const fs = require('fs');
const Tour = require('../Model/tourModel');
const APIFeatures = require('../Utils/apiFeatures');
const catchAsync = require('../Utils/catchAsync');
const AppError = require('../Utils/appError');
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

//middleware
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = catchAsync(async (req, res, next) => {
  //1) Build a query
  // eslint-disable-next-line node/no-unsupported-features/es-syntax
  // const queryObj = { ...req.query }; //need to destructure to create a copy otherwise it becomes pass by reference
  // const excludeFields = ['Page', 'sort', 'limit', 'fields'];
  // excludeFields.forEach((el) => delete queryObj[el]);
  // // const tours = await Tour.find(queryObj); //Tour.find() will return a query
  //
  // //2) [query filtering is done here] - Advanced filtering
  // let queryStr = JSON.stringify(queryObj);
  // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`); //using regular expression
  //
  // //find will return query further we can chain function to filter record
  // let query = Tour.find(JSON.parse(queryStr));

  //3) Sorting
  // if (req.query.sort) {
  //   const sortBy = req.query.sort.split(',').join(' ');
  //   query = query.sort(sortBy);
  // } else {
  //   query = query.sort('-createdAt');
  // }

  //4) Feild Limiting
  // if (req.query.fields) {
  //   const fields = req.query.fields.split(',').join(' ');
  //   query = query.select(fields);
  // } else {
  //   query = query.select('-__v');
  // }

  // 5)Pagination
  //We should calculate skip value
  // const pageNo = Number(req.query.page) || 1;
  // const limitNo = Number(req.query.limit) || 100;
  // const skip = (pageNo - 1) * limitNo;
  // console.log(typeof pageNo, typeof limitNo);
  // //use calculation here
  // query = query.skip(skip).limit(limitNo);
  //
  // if (req.query.page) {
  //   const numTours = await Tour.countDocuments();
  //   if (skip >= numTours) {
  //     throw new Error('This page does not Exisit☠️');
  //   }
  // }

  //excecute a query - then we await a promise for the query
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .pagination();
  console.log('🤡', features);
  const tours = await features.query; //accessing object's variable
  // const tours = await query;
  // const tours = await Tour.find()
  //   .where('duration')
  //   .equals(5)
  //   .where('difficulty')
  //   .equals('easy');
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
  if (!tour) {
    return next(new AppError('No Tour Found', 404));
    //Shouldnt allow the next line to excecute
  }
  res.status(200).json({
    status: 'success',
    message: {
      tour,
    },
  });
  // const id = req.params.id * 1;
  //removing repeated code - Is checked in checkID middleware
  // const tour = tours.find((el) => el.id === id);
  // res.status(200).json({
  //   status: 'success',
  //   data: {
  //     tour,
  //   },
  // });
});

exports.createTours = catchAsync(async (req, res, next) => {
  // try {
  //const newTour = new Tour({})
  //newTour.save()
  const newTour = await Tour.create(req.body);
  res.status(201).json({
    status: '😈success',
    data: {
      tour: newTour,
    },
  });
  // } catch (err) {
  //   res.status(400).json({
  //     status: 'fail',
  //     message: err,
  //   });
  // }
});

exports.updateTour = catchAsync(async (req, res, next) => {
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
});

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: '$difficulty',
        numRatings: { $sum: '$ratingsQuantity' },
        numTours: { $sum: 1 }, //adding 1 to each value
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $avg: '$price' },
        maxPrice: { $avg: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
    // {
    //   $match: { _id: { $ne: 'easy' } },
    // },
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates', //will create a seperate copy for each startdates
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numTourStarts: -1 },
    },
    {
      $limit: 6,
    },
  ]);
  res.status(200).json({
    status: 'success',
    data: { plan },
  });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  await Tour.findByIdAndDelete(req.params.id);
  //rempved repeated code
  res.status(204).json({
    status: 'successfully deleted',
  });
});
