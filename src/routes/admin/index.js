const dashboardRouter = require('./dashboard');
const employeeRouter = require('./employee');
const patientRouter = require('./patient');
const accountRouter = require('./account');

function route(app) {

    app.use('/administration/myaccount', accountRouter);
    app.use('/administration/patient', patientRouter);
    app.use('/administration/employee', employeeRouter);
    app.use('/administration', dashboardRouter);

    
    app.set('layout', '../../resources/views/admin/layouts/layouts');
}

module.exports = route;
