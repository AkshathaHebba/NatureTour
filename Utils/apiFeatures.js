class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString }; //need to destructure to create a copy otherwise it becomes pass by reference
    const excludeFields = ['Page', 'sort', 'limit', 'fields'];
    excludeFields.forEach((el) => delete queryObj[el]);
    // const tours = await Tour.find(queryObj); //Tour.find() will return a query

    //2) [query filtering is done here] - Advanced filtering
    this.queryString = JSON.stringify(queryObj);
    this.queryString = this.queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    ); //using regular expression
    console.log('😇', this.query);
    //find will return query further we can chain function to filter record
    this.query.find(JSON.parse(this.queryString));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  pagination() {
    const pageNo = Number(this.queryString.page) || 1;
    const limitNo = Number(this.queryString.limit) || 100;
    const skip = (pageNo - 1) * limitNo;
    //use calculation here
    this.query = this.query.skip(skip).limit(limitNo);
    return this;
  }
}
module.exports = APIFeatures;
