const Employee = require('../../models/Employee');
const fs = require('fs');
const path = require('path');
const { mongooseToObject } = require('../../../util/mongoose');
const { mutipleMongooseToObject } = require('../../../util/mongoose');

class AccountController{
    //[GET]: /myaccount
    index(req, res, next) {
        Employee.findById({_id: req.session.user._id})
            .then((employee) => {
                res.render('admin/account/index', {
                    employee: mongooseToObject(employee),
                });
            })
            .catch(next);        
    }

    //[PUT]: /myaccout/update/:id/
    update(req, res, next) {
        const formData = req.body;
        const file = req.file;
        let imgBase64;
        let mimetype;
        let imgPath;

        Employee.findOne({ _id: req.params.id }, function(err, employee) {
            if(file){
                mimetype = file.mimetype;
                imgBase64 = fs.readFileSync(file.path).toString('base64');
                imgPath = `data:${mimetype};base64,${imgBase64}`;
            }
            else{
                imgPath = employee.image;
            }
            Employee.updateOne(
                { _id: req.params.id }, 
                { 
                    $set: { 
                        firstname: formData.firstname, 
                        lastname: formData.lastname, 
                        username: formData.username,  
                        password: formData.password, 
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
                    req.session.user.firstname = req.body.firstname;
                    req.session.user.lastname = req.body.lastname;
                    req.session.user.image = imgPath;
                    req.session.message = {
                        type: 'success',
                        content: 'Chỉnh sửa thông tin thành công.'
                    };
                    res.redirect('/administration/patient');
                })
                .catch(next);
        })
    }

    logout(req, res, next){
        if (req.session) {
            req.session.destroy(function(err) {
              if(err) {
                return next(err);
              } else {
                return res.redirect('/login');
              }
            });
        }
    }
}


module.exports = new AccountController();