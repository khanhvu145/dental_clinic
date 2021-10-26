
class HomeController{
    //[GET]
    index(req, res, next) {
        res.render('user/home/index', {
            layout: './user/layouts/layouts',
        });
    }
}

module.exports = new HomeController();