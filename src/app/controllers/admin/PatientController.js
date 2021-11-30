const Patient = require('../../models/Patient');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { mongooseToObject } = require('../../../util/mongoose');
const { mutipleMongooseToObject } = require('../../../util/mongoose');

let provinces = axios.get('https://provinces.open-api.vn/api/p/');
let districts = axios.get('https://provinces.open-api.vn/api/d/');
let wards = axios.get('https://provinces.open-api.vn/api/w/');

class PatientController{
    //[GET] /patient
    index(req, res, next) {
        let quantityPage = 5;
        let page = req.query.page || 1;
        Patient.find({})
            .skip((quantityPage*page) - quantityPage)
            .limit(quantityPage)
            .then((patients) => {
                Patient.countDocuments((err, count) => { 
                    if (err) return next(err);
                    res.render('admin/patient/index', {
                        patients: mutipleMongooseToObject(patients),
                        curentPage: page,
                        pages: Math.ceil(count / quantityPage),
                    });
                });               
            })
            .catch(() => {
                res.status(500).send('Truy cập trang web thất bại.Lỗi rồi!!');
                next();
            }); 
    }

    //[GET]: /patient/details/:id/
    details(req, res, next) {
        let patient = Patient.findOne({ _id: req.params.id });
        Promise.all([patient, provinces, districts, wards])
            .then(([patient, provinces, districts, wards]) => {
                res.render('admin/patient/details', {
                    patient: mongooseToObject(patient),
                    provinces: provinces.data,
                    districts: districts.data,
                    wards: wards.data,
                });
            })
            .catch(() => {
                res.status(500).send('Truy cập trang web thất bại.Lỗi rồi!!');
                next();
            }); 
    }

    //[GET]: /patient/create
    create(req, res, next) {
        Promise.all([provinces, districts, wards])
            .then(([provinces, districts, wards]) => {
                res.render('admin/patient/create', {
                    provinces: provinces.data,
                    districts: districts.data,
                    wards: wards.data,
                    patient: {
                        address: {
                            city: '',
                            district: '',
                            ward: ''
                        }
                    },
                });
            })
            .catch(() => {
                res.status(500).send('Truy cập trang web thất bại.Lỗi rồi!!');
                next();
            }); 
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
        Patient.create({
            fullname: formData.fullname, 
            dateofbirth: formData.dateofbirth, 
            gender: formData.gender,  
            phone: formData.phone,
            email: formData.email,
            "address.building": formData.building,
            "address.ward": formData.ward,
            "address.district": formData.district,
            "address.city": formData.city,
            image: imgPath,
        })
            .then(() => {
                req.session.message = {
                    type: 'success',
                    content: 'Thêm bệnh nhân mới thành công.'
                };
                res.redirect('/administration/patient');
            })
            .catch(() => {
                res.status(500).send('Thêm thông tin thất bại.Lỗi rồi!!');
                next();
            }); 
    }

    //[GET]: /patient/edit
    edit(req, res, next) {
        let patient = Patient.findOne({ _id: req.params.id });
        Promise.all([patient, provinces, districts, wards])
            .then(([patient, provinces, districts, wards]) => {
                res.render('admin/patient/edit', {
                    patient: mongooseToObject(patient),
                    provinces: provinces.data,
                    districts: districts.data,
                    wards: wards.data,
                });
            })
            .catch(() => {
                res.status(500).send('Truy cập trang web thất bại.Lỗi rồi!!');
                next();
            });
    }

    //[PUT]: /employee/edit/update/:id/
    update(req, res, next) {
        const formData = req.body;
        const file = req.file;
        let imgBase64;
        let mimetype;
        let imgPath;

        Patient.findOne({ _id: req.params.id }, function(err, patient){
            if(file){
                mimetype = file.mimetype;
                imgBase64 = fs.readFileSync(file.path).toString('base64');
                imgPath = `data:${mimetype};base64,${imgBase64}`;
            }
            else{
                imgPath = patient.image;
            }
            Patient.updateOne(
                { _id: req.params.id }, 
                { 
                    $set: { 
                        fullname: formData.fullname, 
                        dateofbirth: formData.dateofbirth, 
                        gender: formData.gender,  
                        phone: formData.phone,
                        email: formData.email,
                        "address.building": formData.building,
                        "address.ward": formData.ward,
                        "address.district": formData.district,
                        "address.city": formData.city,
                        image: imgPath
                    }
                }
            )
                .then(() => {
                    req.session.message = {
                        type: 'success',
                        content: 'Chỉnh sửa thông tin thành công.'
                    };
                    res.redirect('/administration/patient')
                })
                .catch(() => {
                    res.status(500).send('Cập nhật thông tin thất bại.Lỗi rồi!!');
                    next();
                }); 
        })
    }

    //[GET]: /patient/delete
    delete(req, res, next) {
        Patient.deleteMany({ _id: {$in: req.body.Ids}})
            .then(() => {
                req.session.message = {
                    type: 'success',
                    content: 'Xóa các lựa chọn thành công.'
                };
                res.redirect('back')
            })
            .catch(() => {
                res.status(500).send('Yêu cầu xóa thất bại.Lỗi rồi!!');
                next();
            }); 
    }

    //[DELETE]: /patient/destroy/:id/
    destroy(req, res, next) {
        Patient.deleteOne({ _id: req.params.id})
            .then(() => {
                req.session.message = {
                    type: 'success',
                    content: 'Xóa khách hàng thành công.'
                };
                res.redirect('back');
            })
            .catch(() => {
                res.status(500).send('Yêu cầu xóa thất bại.Lỗi rồi!!');
                next();
            }); 
    }

    //[GET]: /patient/search
    search(req, res, next) {
        var keyword = req.query.keyword;
        let page = 1;
        Patient.find({fullname: { $regex: keyword, $options:"$i" }})
            .then((patients) => {
                res.render('admin/patient/index', {
                    patients: mutipleMongooseToObject(patients),
                    curentPage: page,
                    pages: 1,
                });              
            })
            .catch(next); 
    }
}

module.exports = new PatientController();