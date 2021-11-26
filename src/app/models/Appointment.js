const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Appointment = new Schema(
    {
        patient_id: { 
            type: Schema.Types.ObjectId, 
            required: true 
        },
        dentist_id: {
            type: Schema.Types.ObjectId, 
            required: true 
        },
        service_id: {
            type: Schema.Types.ObjectId, 
            required: true 
        },
        date: { 
            type: Date, 
            required: true 
        },
        time: { 
            type: String,
            required: true 
        },
        period: {
            type: String,
        },
        symptom: {
            type: String
        },
        note: {
            type: String
        },
        status: {
            type: String,
            required: true 
        },
        scheduler_id: {
            type: Schema.Types.ObjectId, 
            required: true
        },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('Appointment', Appointment);