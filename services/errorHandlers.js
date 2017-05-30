/*
  This replaces all the try/catch fn for Async-Await
*/
exports.catchAsyncError = (fn) => {
  return function (req, res, next) {
    return fn(req, res, next).catch(next);
  };
};

/*
  404: Not Found
*/
exports.notFound = (req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
};

/*
  MongoDB Validation Error Handler
*/
exports.flashValidationErrors = (err, req, res, next) => {
  if (!err.errors) return next(err); // Skip if no error
  const errorKeys = Object.keys(err.errors);
  errorKeys.forEach(key => req.flash('error', err.errors[key].message));
  res.redirect('back');
};

/*
  Development Error handler
  Shows on error.pug
*/
exports.developmentErrors = (err, req, res, next) => {
  err.stack = err.stack || '';
  const errorDetails = {
    message: err.message,
    status: err.status,
    stackHighlighted: err.stack.replace(/[a-z_-\d]+.js:\d+:\d+/gi, '<mark>$&</mark>')
  };
  res.status(err.status || 500);
  res.format({
    'text/html': () => {
      res.render('error', errorDetails)
    },
    // For Form Submit Error
    'application/json': () => res.json(errorDetails)
  });
};

/*
  Production Error handler
  Don't show any errors to the users
*/
exports.productionErrors = (err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
};