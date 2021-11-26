module.exports = function ResLocalMiddleWare(req, res, next) {
    res.locals._currentURL = req.originalUrl;
    next();
}