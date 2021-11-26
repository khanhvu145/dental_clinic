const Patient = require('../../models/Patient');
const Allergies = require('../../models/Allergies');
const BackgroundDiseases = require('../../models/Background_diseases');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { mongooseToObject } = require('../../../util/mongoose');
const { mutipleMongooseToObject } = require('../../../util/mongoose');

let provinces = axios.get('https://provinces.open-api.vn/api/p/');
let districts = axios.get('https://provinces.open-api.vn/api/d/');
let wards = axios.get('https://provinces.open-api.vn/api/w/');

class PatientController{
    //[GET]
    index(req, res, next){
        let patients = Patient.find({});
        let patients_filter;
        if(req.query.hasOwnProperty('patient')){
            patients_filter = Patient.find({_id: req.query.patient});
        }
        else{
            patients_filter = Patient.find({});
        }
        Promise.all([patients, patients_filter])
            .then(([patients, patients_filter]) => {
                res.render('user/patient/index', {
                    layout: './user/layouts/layouts',
                    patients: mutipleMongooseToObject(patients),
                    patients_filter: mutipleMongooseToObject(patients_filter),
                });
            })
            .catch(next);
    }

    detail(req, res, next) {
        let patient = Patient.findById(req.params.id);
        let allergies = Allergies.find({});
        let backgroundDiseases = BackgroundDiseases.find({});

        Promise.all([patient, allergies, backgroundDiseases, provinces, districts, wards])
            .then(([patient, allergies, backgroundDiseases, provinces, districts, wards]) => {
                res.render('user/patient/detail', {
                    layout: './user/layouts/layouts',
                    patient: mongooseToObject(patient),
                    allergies: mutipleMongooseToObject(allergies),
                    backgroundDiseases: mutipleMongooseToObject(backgroundDiseases),
                    provinces: provinces.data,
                    districts: districts.data,
                    wards: wards.data,
                });
            })
            .catch(next);
    }

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
                        image: imgPath,
                        allergies: formData.allergies || [],
                        background_diseases: formData.background_diseases || [],
                    }
                }
            )
                .then(() => {
                    req.session.message = {
                        type: 'success',
                        content: 'Chỉnh sửa thông tin thành công.',
                    };
                    res.redirect('back');
                })
                .catch(next);
        })
    }
}

module.exports = new PatientController();