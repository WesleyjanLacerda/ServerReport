const errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    next(error);
    return;
  }

  console.error(error);
  res.status(error.status || 500).send(error.message || 'Internal Server Error');
};

module.exports = errorHandler;
