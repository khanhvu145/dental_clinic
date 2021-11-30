const Employee = require('../../models/Employee');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
const { mongooseToObject } = require('../../../util/mongoose');
const { mutipleMongooseToObject } = require('../../../util/mongoose');

let provinces = axios.get('https://provinces.open-api.vn/api/p/');
let districts = axios.get('https://provinces.open-api.vn/api/d/');
let wards = axios.get('https://provinces.open-api.vn/api/w/');

class AccountController{
    //[GET]: /myaccount
    index(req, res, next) {
        let employee = Employee.findById({_id: req.session.user._id});
        Promise.all([employee, provinces, districts, wards])
            .then(([employee, provinces, districts, wards]) => {
                res.render('admin/account/index', {
                    employee: mongooseToObject(employee),
                    provinces: provinces.data,
                    districts: districts.data,
                    wards: wards.data,
                });
            })
            .catch(() => {
                res.status(500).send('Truy cập trang thất bại.Lỗi rồi!!');
                next();
            });
    }

    //[PUT]: /myaccout/update/:id/
    update(req, res, next) {
        const formData = req.body;
        const file = req.file;
        let imgBase64;
        let mimetype;
        let imgPath;

        Employee.findOne({ _id: req.session.user._id }, function(err, employee) {
            if(file){
                mimetype = file.mimetype;
                imgBase64 = fs.readFileSync(file.path).toString('base64');
                imgPath = `data:${mimetype};base64,${imgBase64}`;
            }
            else{
                imgPath = employee.image;
            }
            Employee.updateOne(
                { _id: req.session.user._id }, 
                { 
                    $set: { 
                        fullname: formData.fullname,  
                        email: formData.email,
                        phone: formData.phone,
                        image: imgPath,
                        "address.building": formData.building,
                        "address.ward": formData.ward,
                        "address.district": formData.district,
                        "address.city": formData.city,
                    }
                }
            )
                .then(() => {
                    req.session.user.fullname = formData.fullname;
                    req.session.user.email = formData.email;
                    req.session.user.phone = formData.phone;
                    req.session.user.address.building = formData.building;
                    req.session.user.address.ward = formData.ward;
                    req.session.user.address.district = formData.district;
                    req.session.user.address.city = formData.city;
                    req.session.user.image = imgPath;
                    req.session.message = {
                        type: 'success',
                        content: 'Chỉnh sửa thông tin thành công.'
                    };
                    res.redirect('/administration');
                })
                .catch(() => {
                    res.status(500).send('Cập nhật không thành công.Lỗi rồi!!');
                    next();
                });
        })
    }

    changePassword(req, res, next){
        Employee.findOneAndUpdate({ _id: req.session.user._id }, {new: true}, function(err, employee) {
            if(err){
                res.status(404).send('Yêu cầu đổi mật khẩu thất bại.Lỗi rồi!!');
                next();
            }
            else{
                if(bcrypt.compareSync(req.body.currentPass, employee.password)){
                    if(req.body.newPass === req.body.confirmPass){
                        employee.password = bcrypt.hashSync(req.body.newPass, salt);
                        employee.save();
                        req.session.message = {
                            type: 'success',
                            content: 'Thay đổi mật khẩu thành công! Hãy đăng nhập lại.'
                        };
                        delete req.session.user; 
                        req.session.isLogin = false;
                        res.redirect('/login');
                    }
                    else{
                        req.session.message = {
                            type: 'danger',
                            content: 'Xác nhận mật khẩu không khớp! Hãy kiểm tra lại.'
                        };
                        res.redirect('back');
                    }
                }
                else{
                    req.session.message = {
                        type: 'danger',
                        content: 'Mật khẩu hiện tại không chính xác!! Hãy kiểm tra lại.'
                    };
                    res.redirect('back');
                }
            }
        });
    }

    logout(req, res, next){
        if (req.session) {
            req.session.destroy(function(err) {
              if(err) {
                return res.status(404).send('Yêu cầu đổi mật khẩu thất bại.Lỗi rồi!!');
              } else {
                return res.redirect('/login');
              }
            });
        }
    }
}


module.exports = new AccountController();