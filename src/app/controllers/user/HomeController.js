const Allergies = require('../../models/Allergies');
const Patient = require('../../models/Patient');
const Employee = require('../../models/Employee');
const Appointment = require('../../models/Appointment');
const Service = require('../../models/Service');
const BackgroundDisease = require('../../models/Background_diseases');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const { mongooseToObject } = require('../../../util/mongoose');
const { mutipleMongooseToObject } = require('../../../util/mongoose');

let provinces = axios.get('https://provinces.open-api.vn/api/p/');
let districts = axios.get('https://provinces.open-api.vn/api/d/');
let wards = axios.get('https://provinces.open-api.vn/api/w/');

class HomeController{
    //[GET]
    index(req, res, next) {
        let allergies = Allergies.find({});
        let appointments = Appointment.find({});
        let backgroundDiseases = BackgroundDisease.find({});
        let dentists = Employee.find({role: '615b01158ee0220383521b5f'});
        let services = Service.find({});
        let patients = Patient.find({});
        var patient = {address: {city: '', district: '', ward: ''}};

        if(req.session.selectPatient){
            patient = {
                address: {
                    city: req.session.selectPatient.address.city,
                    district: req.session.selectPatient.address.district,
                    ward: req.session.selectPatient.address.ward,
                }
            };
        }

        Promise.all([allergies, backgroundDiseases, patients, dentists, services, appointments, provinces, districts, wards])
            .then(([allergies, backgroundDiseases,patients, dentists, services, appointments, provinces, districts, wards]) => {
                res.render('user/home/index', {
                    layout: './user/layouts/layouts',
                    allergies: mutipleMongooseToObject(allergies),
                    backgroundDiseases: mutipleMongooseToObject(backgroundDiseases),
                    patients: mutipleMongooseToObject(patients),
                    dentists: mutipleMongooseToObject(dentists),
                    services: mutipleMongooseToObject(services),
                    appointments: mutipleMongooseToObject(appointments),
                    provinces: provinces.data,
                    districts: districts.data,
                    wards: wards.data,
                    patient: patient,
                })
            })
            .catch(() => {
                res.status(500).send('Truy cập trang web thất bại.Lỗi rồi!!');
                next();
            });
    }

    select(req, res, next) {
        Patient.findOne({ _id: req.params.id })
            .then((patient) => {
                req.session.selectPatient = patient;
                res.redirect('/');
            })
            .catch(() => {
                res.status(500).send('Chọn khách hàng không thành công.Lỗi rồi!!');
                next();
            });
    }

    close(req, res, next) {
        delete req.session.selectPatient;
        res.redirect('/');
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
                    }
                }
            )
                .then(() => {
                    req.session.selectPatient.fullname = req.body.fullname;
                    req.session.selectPatient.dateofbirth = req.body.dateofbirth;
                    req.session.selectPatient.gender = req.body.gender;
                    req.session.selectPatient.phone = req.body.phone;
                    req.session.selectPatient.email = req.body.email;
                    req.session.selectPatient.address.building = req.body.building;
                    req.session.selectPatient.address.ward = req.body.ward;
                    req.session.selectPatient.address.district = req.body.district;
                    req.session.selectPatient.address.city = req.body.city;
                    req.session.selectPatient.image = imgPath;
                    req.session.message = {
                        type: 'success',
                        content: 'Chỉnh sửa thông tin thành công.',
                    };
                    res.redirect('back');
                })
                .catch(() => {
                    res.status(500).send('Cập nhật thông tin thất bại.Lỗi rồi!!');
                    next();
                });
        })
    }

    create(req, res, next) {
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
            imgPath = '/img/user.png';
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
            allergies: [],
            background_diseases: [],
        })
            .then(() => {
                Patient.find({})
                    .then((patients) => {
                        req.session.selectPatient = patients[patients.length - 1];
                        req.session.message = {
                            type: 'success',
                            content: 'Thêm bệnh nhân mới thành công.'
                        };
                        res.redirect('back');
                    })
                    .catch(() => {
                        res.status(500).send('Không tìm thấy dữ liệu.Lỗi rồi!!');
                        next();
                    }); 
            })
            .catch(() => {
                res.status(500).send('Thêm thông tin thất bại.Lỗi rồi!!');
                next();
            }); 
    }

    createAppointment(req, res, next) {
        var formData = req.body;
        function addTimes(time0, time1) {
            function timeToMins(time) {
              var b = time.split(':');
              return Number(b[0] * 60) + Number(b[1]);
            };
            function timeFromMins(mins) {
                function z(n) {
                    if (n < 0) return ('-0' + (n).toString().slice(1));
                    return (n < 10 ? '0' : '') + n;
                };
                var h = (mins / 60 | 0);
                var m = mins % 60;
                return z(h) + ':' + z(m);
            };
            return timeFromMins(timeToMins(time0) + timeToMins(time1));
        };
        var date = new Date(req.body.date);
        var appointment_date = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
        var time_start = moment(appointment_date + 'T' + req.body.time);
        var time_end = moment(appointment_date + 'T' + addTimes(req.body.time, req.body.period));
        Appointment.find({_id: {$ne: req.params.id}, dentist_id: req.body.dentist, date: req.body.date}, function(err, appointments){
            let dem = 0;
            for(let i = 0; i < appointments.length; i++){
                var date_db = new Date(appointments[i].date);
                var appointment_date_db = date_db.getFullYear() + '-' + ('0' + (date_db.getMonth() + 1)).slice(-2) + '-' + ('0' + date_db.getDate()).slice(-2);
                var time_start_db = moment(appointment_date_db + 'T' + appointments[i].time);
                var time_end_db = moment(appointment_date_db + 'T' + addTimes(appointments[i].time, appointments[i].period));
                if(moment(time_start).isSameOrAfter(time_start_db) && moment(time_start).isBefore(time_end_db) || moment(time_end).isAfter(time_start_db) && moment(time_end).isSameOrBefore(time_end_db) || moment(time_start_db).isSameOrAfter(time_start) && moment(time_start_db).isBefore(time_end) || moment(time_end_db).isAfter(time_start) && moment(time_end_db).isSameOrBefore(time_end)){
                    break;
                }
                else dem++;
            }
            if(dem == appointments.length){
                var currentDate = moment();
                if(moment(time_start).isBefore(currentDate)){
                    req.session.message = {
                        type: 'danger',
                        content: 'Thời gian đặt hẹn không hợp lệ! Hãy đặt lịch mới.'
                    };
                    res.redirect('back');
                }
                else{
                    Appointment.create({
                        patient_id: req.params.id, 
                        dentist_id: formData.dentist_id, 
                        service_id: formData.service_id,  
                        date: formData.date,
                        time: formData.time,
                        period: formData.period, 
                        symptom: formData.symptom, 
                        note: formData.note, 
                        status: formData.status, 
                        scheduler_id: req.session.user._id,
                    })
                    delete req.session.selectPatient;
                    req.session.message = {
                        type: 'success',
                        content: 'Thêm lịch hẹn thành công.'
                    };
                    res.redirect('back');
                }
            }
            else{
                req.session.message = {
                    type: 'danger',
                    content: 'Lịch hẹn bị trùng! Hãy đặt lịch hẹn mới.'
                };
                res.redirect('back');
            }
        })
    }
}

module.exports = new HomeController();