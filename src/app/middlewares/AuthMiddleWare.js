module.exports = function AuthMiddleWare(req, res, next) {

    if (req.session && req.session.isLogin) {
        next();
    } 
    else {
        res.redirect('/login')
        next();
    }
    
}