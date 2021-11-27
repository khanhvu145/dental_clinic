const Employee = require('../../models/Employee');
const Role = require('../../models/Role');
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

class EmployeeController{
    //[GET]: /employee
    index(req, res, next) {
        var roles;
        let quantityPage = 5;
        let page = req.query.page || 1;
        let countAdmin;
        Role.find({})
            .then((roleList) => {
                roles = roleList;
            })
            .catch(next);
        Employee.find({role: '615b00ec8ee0220383521b5e' }, function(err, employees) {
            countAdmin = employees.length;
        })
        Employee.find({ role: { $ne: '615b00ec8ee0220383521b5e' } })
            .skip((quantityPage*page) - quantityPage)
            .limit(quantityPage)
            .then((employees) => {
                Employee.countDocuments((err, count) => { 
                    if (err) return next(err);
                    res.render('admin/employee/index', {
                        employees: mutipleMongooseToObject(employees),
                        roles: mutipleMongooseToObject(roles),
                        curentPage: page,
                        pages: Math.ceil((count - countAdmin) / quantityPage),
                    });
                });
            })
            .catch(next);        
    }

    //[GET]: /patient/search
    search(req, res, next) {
        var keyword = req.query.keyword;
        let page = 1;
        var roles;
        Role.find({})
            .then((roleList) => {
                roles = roleList;
            })
            .catch(next);
        Employee.find({fullname: { $regex: keyword, $options:"$i" }, role: { $ne: '615b00ec8ee0220383521b5e' }})
            .then((employees) => {
                res.render('admin/employee/index', {
                    employees: mutipleMongooseToObject(employees),
                    roles: mutipleMongooseToObject(roles),
                    curentPage: page,
                    pages: 1,
                });              
            })
            .catch(next); 
    }

    //[GET]: /employee/details/:id/
    details(req, res, next) {
        let employee = Employee.findOne({ _id: req.params.id });
        let roles = Role.find({});
        Promise.all([employee, provinces, districts, wards, roles])
            .then(([employee, provinces, districts, wards, roles]) => {
                res.render('admin/employee/details', {
                    employee: mongooseToObject(employee),
                    roles: mutipleMongooseToObject(roles),
                    provinces: provinces.data,
                    districts: districts.data,
                    wards: wards.data,
                });
            })
            .catch(next);
    }

    //[GET]: /employee/create
    create(req, res, next) {
        Promise.all([provinces, districts, wards])
            .then(([provinces, districts, wards]) => {
                res.render('admin/employee/create', {
                    provinces: provinces.data,
                    districts: districts.data,
                    wards: wards.data,
                    employee: {
                        address: {
                            city: '',
                            district: '',
                            ward: ''
                        }
                    },
                });
            })
            .catch(next);
    }

    //[POST]: /employee/store
    store(req, res, next) {
        var formData = req.body;
        const file = req.file;
        let imgBase64;
        let mimetype;
        let imgPath;
        if(file){
            mimetype = file.mimetype;
            imgBase64 = fs.readFileSync(file.path).toString('base64');
            imgPath = `data:${mimetype};base64,${imgBase64}`;
        }
        else {
            imgPath = '/img/logoclinic.png'
        }
        Role.findOne({name: req.body.role})
            .then((role) => {
                formData.role = role._id.toString();
                Employee.create({
                    fullname: formData.fullname, 
                    username: formData.username,  
                    password: bcrypt.hashSync(formData.password, salt), 
                    email: formData.email,
                    phone: formData.phone,
                    role: formData.role,
                    image: imgPath,
                    "address.building": formData.building,
                    "address.ward": formData.ward,
                    "address.district": formData.district,
                    "address.city": formData.city,
                })
                    .then(() => {
                        req.session.message = {
                            type: 'success',
                            content: 'Thêm nhân viên mới thành công.'
                        };
                        res.redirect('/administration/employee');
                    })
                    .catch(next);
            })
            .catch(next);
    }

    //[GET]: /employee/edit
    edit(req, res, next) {
        let employee = Employee.findOne({ _id: req.params.id });
        let roles = Role.find({});
        Promise.all([employee, provinces, districts, wards, roles])
            .then(([employee, provinces, districts, wards, roles]) => {
                res.render('admin/employee/edit', {
                    employee: mongooseToObject(employee),
                    roles: mutipleMongooseToObject(roles),
                    provinces: provinces.data,
                    districts: districts.data,
                    wards: wards.data,
                });
            })
            .catch(next);
    }

    //[PUT]: /employee/edit/update/:id/
    update(req, res, next) {
        const formData = req.body;
        const file = req.file;
        var roleId;
        let imgBase64;
        let mimetype;
        let imgPath;

        Role.findOne({name: formData.role}, function(err, role){
            roleId = role._id;
            if(file){
                mimetype = file.mimetype;
                imgBase64 = fs.readFileSync(file.path).toString('base64');
                imgPath = `data:${mimetype};base64,${imgBase64}`;
            }
            else {
                Employee.findOne({ _id: req.params.id }, function(err, employee){
                    imgPath = employee.image;
                })
            }
            Employee.updateOne(
                { _id: req.params.id }, 
                { 
                    $set: { 
                        fullname: formData.fullname, 
                        email: formData.email,
                        phone: formData.phone,
                        role: roleId,
                        image: imgPath,
                        "address.building": formData.building,
                        "address.ward": formData.ward,
                        "address.district": formData.district,
                        "address.city": formData.city,
                    }
                }
            )
                .then(() => {
                    req.session.message = {
                        type: 'success',
                        content: 'Chỉnh sửa thông tin thành công.'
                    };
                    res.redirect('/administration/employee')
                })
                .catch(next);
        })
    }

    //[GET]: /employee/delete
    delete(req, res, next) {
        Employee.deleteMany({ _id: {$in: req.body.Ids}})
            .then(() => {
                req.session.message = {
                    type: 'success',
                    content: 'Xóa các lựa chọn thành công.'
                };
                res.redirect('back')
            })
            .catch(next);
    }

    //[DELETE]: /employee/destroy/:id/
    destroy(req, res, next) {
        Employee.deleteOne({ _id: req.params.id})
            .then(() => {
                req.session.message = {
                    type: 'success',
                    content: 'Xóa nhân viên thành công.'
                };
                res.redirect('back');
            })
            .catch(next);
    }
}


module.exports = new EmployeeController();