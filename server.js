const mongoose = require('mongoose');

// import environmental variables from our variables.env file
require('dotenv').config({ path: 'variables.env' });

/*
  MongoDB/Mongoose Config
  if Local
    set DATABASE=mongodb://localhost:27017/whiskyreview
    cd C:\Program Files\MongoDB\Server\3.2\bin
    mongod.exe --dbpath C:\Users\minsookim\Desktop\whisky-review\data
*/
mongoose.connect(process.env.DATABASE);
mongoose.Promise = global.Promise; // Use Native ES6 Promises
mongoose.connection.on('error', (err) => {
  console.log(`Found Error: ${err.message}`);
});
mongoose.connection.once('open', () => {
  console.log('Connected to mongoDB server!');
});
// MongoDB/Mongoose Schema Singletons
require('./models/Review');
require('./models/User');

// Starting our app
const app = require('./app');
app.set('port', process.env.PORT || 7777);
const server = app.listen(app.get('port'), () => {
  console.log(`Express App running on PORT: ${server.address().port}`);
});