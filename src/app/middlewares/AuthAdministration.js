module.exports = function AuthAdministration(req, res, next) {

    if (req.session && req.session.isLogin && req.session.roleName == 'admin') {
        next();
    } 
    else {
        res.redirect('/login')
        next();
    }
    
}