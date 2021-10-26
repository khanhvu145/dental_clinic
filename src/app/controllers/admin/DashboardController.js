
class DashboardController{
    //[GET]
    index(req, res, next) {
        res.render('admin/dashboard/index');
    }
}

module.exports = new DashboardController();