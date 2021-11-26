const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Medical_examination = new Schema(
    {
        patient_id: { 
            type: Schema.Types.ObjectId, 
            required: true 
        },
        examination_date: { 
            type: Date, 
            default: Date.now,
            required: true 
        },
        symptom: { 
            type: String
        },
        receptionist_name: { 
            type: String, 
            required: true 
        },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('Medical_examination', Medical_examination);