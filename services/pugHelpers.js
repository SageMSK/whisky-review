/*
  Momentjs is a library for displaying dates
*/
exports.moment = require('moment');

/*
  Show JSON data on pug template instead of 'console.log'
*/
exports.showObj = (obj) => JSON.stringify(obj, null, 2);

exports.websiteName = `Whisky Reviewer`;

exports.menu = [
  { slug: '/whiskies', title: 'Whiskies' },
  { slug: '/top', title: 'Top' },
  { slug: '/add', title: 'Add' }
];