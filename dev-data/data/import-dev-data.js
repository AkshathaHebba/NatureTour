const fs = require('fs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Tour = require('../../Model/tourModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
//
mongoose
  //Connect to Local by using
  //.connect(process.env.DATABASE_LOCAL.{ --> prior to that run the service
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('🔗->DB connection successful from scripting');
  });

//starting file
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data successfully loaded');
  } catch (err) {
    console.log(err);
  }
};
//delete all data
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data was successfully deleted!!');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};
if (process.argv[2] === '-import') {
  importData();
} else if (process.argv[2] === '-delete') {
  deleteData();
}
