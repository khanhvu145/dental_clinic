const homeRouter = require('./home');
const appointmentRouter = require('./appointment');
const accountRouter = require('./account');
const calendarRouter = require('./calendar');
const patientRouter = require('./patient');
const authMiddleWare = require('../../app/middlewares/AuthMiddleWare');

function route(app) {
    app.use(authMiddleWare);
    app.use('/patient_list', patientRouter);
    app.use('/mycalendar', calendarRouter);
    app.use('/myaccount', accountRouter);
    app.use('/appointment', appointmentRouter);
    app.use('/', homeRouter);
}

module.exports = route;
