/*
  Momentjs is a library for displaying dates
  How to use:
    go to any pug file that you want to format the date and type
    h.moment(the date).format(any format you want)
    for more info: https://momentjs.com/docs/#/displaying/
*/
exports.moment = require('moment');

/*
  Show JSON data on pug template instead of 'console.log'
  How to use:
    go to any pug file and type
    pre= h.showObj(user or review, etc.)
*/
exports.showObj = (obj) => JSON.stringify(obj, null, 2);

exports.websiteName = `Whisky Reviewer`;

exports.menu = [
  { slug: '/whiskies', title: 'Whiskies' },
  { slug: '/about', title: 'About' }
];