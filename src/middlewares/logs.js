/*************************************
  Logs Middleware
**************************************/
'use strict';
module.exports = function(server,logger) {

  server.pre(function(request, response, next) {
    request.log.info({
      req: request
    }, 'start'); // (1)
    return next();
  });

  server.on('after', function(req, res, route) {
    req.log.info({
      res: res,
      route: route
    }, 'finished'); // (3)
  });

  logger.info(' - Logs Middlewares loaded');
};