const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Appointment = new Schema(
    {
        patient_id: { 
            type: Schema.Types.ObjectId, 
            required: true 
        },
        dentist_name: { 
            type: String, 
            required: true 
        },
        date: { 
            type: Date, 
            default: Date.now, 
            required: true 
        },
        time: { 
            type: Date,
            default: Date.now, 
            required: true 
        },
        content: { 
            type: String, 
            required: true 
        }
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('Appointment', Appointment);