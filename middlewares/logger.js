const logger = (request, response, next) => {
    console.log(
      new Date().toUTCString(), 
      'Request from', 
      request.ip, 
      request.method,
      request.originalUrl
    )
    next()
}
module.exports = {
    logger
}