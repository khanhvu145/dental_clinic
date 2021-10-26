const Employee = require('../../models/Employee');
const Role = require('../../models/Role');
const { mongooseToObject } = require('../../../util/mongoose');

class LoginController{
    //[GET]
    show(req, res, next) {
        res.render('auth/login', {
            layout: './auth/layouts'
        });
    }

    //[POST]
    login(req, res, next) {
        Employee.findOne({ username: req.body.username })
            .then((employee) => {
                if(employee && employee.password === req.body.password){
                    var sess = req.session;
                    sess.isLogin = true;
                    sess.user = employee;
                    req.session.message = {
                        type: 'success',
                        content: 'Đăng nhập thành công!'
                    };
                    Role.findById(employee.role, function(err, role) {
                        switch (role.name) {
                            case 'admin':
                                sess.roleName = role.name;
                                res.redirect('/administration');
                                break;
                            case 'dentist':
                                sess.roleName = role.name;
                                res.redirect('/');
                                break;
                            case 'receptionist':
                                sess.roleName = role.name;
                                res.redirect('/');
                                break;
                            default:
                                break;
                        }
                    })
                }
                else{
                    req.session.message = {
                        type: 'danger',
                        content: 'Tài khoản hoặc mật khẩu không đúng!!'
                    };
                    req.session.body = req.body;
                    res.redirect('/login');
                }
            })
            .catch(next);
    }
}

module.exports = new LoginController();