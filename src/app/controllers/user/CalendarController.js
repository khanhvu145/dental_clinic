const Appointment = require('../../models/Appointment');
const Patient = require('../../models/Patient');
const Employee = require('../../models/Employee');
const Services = require('../../models/Service');
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const { mongooseToObject } = require('../../../util/mongoose');
const { mutipleMongooseToObject } = require('../../../util/mongoose');

class CalendarController{
    //[GET]
    index(req, res, next){
        let appointments = Appointment.find({dentist_id: req.session.user._id, status: {$ne: 'Đã hủy'}});
        let patients = Patient.find({});
        let dentists = Employee.find({role: '615b01158ee0220383521b5f'});
        let services = Services.find({});
        Promise.all([appointments, patients, dentists, services])
                .then(([appointments, patients, dentists, services]) => {
                    res.render('user/calendar/index', {
                        layout: './user/layouts/layouts',
                        appointments: mutipleMongooseToObject(appointments),
                        patients: mutipleMongooseToObject(patients),
                        dentists: mutipleMongooseToObject(dentists),
                        services: mutipleMongooseToObject(services),
                    })
                })
                .catch(() => {
                    res.status(500).send('Truy cập trang web thất bại.Lỗi rồi!!');
                    next();
                }); 
    }

    edit(req, res, next){
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
        Appointment.find({_id: {$ne: req.params.id}, dentist_id: req.session.user._id, date: req.body.date}, function(err, appointments){
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
                        content: 'Thời gian chỉnh sửa không hợp lệ!'
                    };
                    res.redirect('back');
                }
                else{
                    Appointment.updateOne(
                        { _id: req.params.id }, 
                        { 
                            $set: { 
                                date: req.body.date,
                                time: req.body.time,
                                period: req.body.period, 
                            }
                        }
                    )
                        .then(() => {
                            req.session.message = {
                                type: 'success',
                                content: 'Cập nhật lịch hẹn thành công.',
                            };
                            res.redirect('back');
                        })
                        .catch(next);
                }
            }
            else{
                req.session.message = {
                    type: 'danger',
                    content: 'Thời gian chỉnh sửa bị trùng!'
                };
                res.redirect('back');
            }
        })
    }

    create(req, res, next) {
        function subTimes(time0, time1) {
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
            return timeFromMins(Math.abs(timeToMins(time0) - timeToMins(time1)));
        };
        var currentDate = moment();
        var date = new Date(req.body.date);
        var appointment_date = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
        var time_start = moment(appointment_date + 'T' + req.body.timeStart);
        if(moment(time_start).isBefore(currentDate)){
            req.session.message = {
                type: 'danger',
                content: 'Thời gian tạo lịch hẹn không hợp lệ!'
            };
            res.redirect('back');
        }
        else{
            Appointment.create({
                patient_id: req.body.patient_id, 
                dentist_id: req.session.user._id, 
                service_id: req.body.service_id,  
                date: req.body.date,
                time: req.body.timeStart,
                period: subTimes(req.body.timeStart, req.body.timeEnd), 
                symptom: req.body.symptom, 
                note: req.body.note, 
                status: 'Chưa đến', 
                scheduler_id: req.session.user._id,
            })
            req.session.message = {
                type: 'success',
                content: 'Thêm lịch thành công.'
            };
            res.redirect('back');
        }
    }
}

module.exports = new CalendarController();