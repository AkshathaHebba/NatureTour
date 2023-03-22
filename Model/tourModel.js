const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
//Model Declaration
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour must have more or equal than 10 characters'],
      minlength: [10, 'A tour must have more or equal then 10characters'],
      //The below code is required from validator
      validate: [validator.isAlpha, 'Tour name must only contain character'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficult is either: easy medium or difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },
    discount: Number,
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        //The below cos is our custom validator
        validator: function (val) {
          //call back function
          return val < this.price;
        },
        message: 'Discount price should be below regular price',
      },
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      require: [true, 'A tour mus have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});
//document level middleware - mongoose middleware
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
//Check pre and post middle ware - document middlewar. this keyword will bin dot currently saving document
// tourSchema.pre('save', (next) => {
//   console.log('Will save document');
//   next();
// });
// tourSchema.post('save', (doc, next) => {
//   console.log('🙌', doc);
//   next();
// });

//query middleware - this points at the current query
tourSchema.pre('/^ find/', async function (next) {
  // tourSchema.pre('find', function (next) {
  console.log('🫶🏼', this);
  await this.find({ secretTour: { ne: true } }); //this.find returns a promise
  next();
});
tourSchema.post('/^ find/', (docs, next) => {
  // tourSchema.pre('find', function (next) {
  console.log(docs);
  next();
});
//agreegration
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});
const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
