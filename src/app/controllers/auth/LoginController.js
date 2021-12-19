const Employee = require('../../models/Employee');
const Role = require('../../models/Role');
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
const { mongooseToObject } = require('../../../util/mongoose');

class LoginController{
    //[GET]
    show(req, res, next) {
        if (req.session && req.session.isLogin) {
            res.redirect('/');
        }
        else{
            res.render('auth/login', {
                layout: './auth/layouts'
            });
        }
    }

    //[POST]
    login(req, res, next) {
        Employee.findOne({ username: req.body.username })
            .then((employee) => {
                if(employee && bcrypt.compareSync(req.body.password, employee.password)){
                    var sess = req.session;
                    sess.isLogin = true;
                    sess.user = employee;
                    req.session.message = {
                        type: 'success',
                        content: 'Đăng nhập thành công!'
                    };
                    Role.findById(employee.role, function(err, role) {
                        sess.roleName = role.name;
                        res.redirect('/');
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
            .catch(() => {
                res.status(500).send('Lỗi máy chủ đăng nhập!!');
                next();
            });
    }
}

module.exports = new LoginController();