var exjwt = require('express-jwt');

module.exports = (app) => {
    const jwtMW = exjwt({
        secret: 'quid-pro-quo'
    })
}
