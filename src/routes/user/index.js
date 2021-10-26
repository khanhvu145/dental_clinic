
const homeRouter = require('./home');
const authMiddleWare = require('../../app/middlewares/AuthMiddleWare');

function route(app) {
    // app.use(authMiddleWare);
    
    app.use('/', homeRouter);
}

module.exports = route;
