const dotenv = require('dotenv');
const mongoose = require('mongoose');

process.on('uncaughtException', (err) => {
  console.log('🤬', err.name, err.message);
  process.exit(1);
});
dotenv.config({ path: './config.env' });
const app = require('./app');

//
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
    console.log('🔗  -->DB connection successful');
  });

//starting file
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`running on port ${port}`);
});

process.on('UnhandledRejection', (err) => {
  console.log('🧑‍🔬', err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
