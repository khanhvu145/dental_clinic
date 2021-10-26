const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Detail_examination = new Schema(
    {
        medical_examination_id: { 
            type: Schema.Types.ObjectId, 
            required: true 
        },
        service_name: { 
            type: String, 
            required: true 
        },
        allergies_name: { 
            type: String, 
            required: true 
        },
        background_disease: { 
            type: String, 
            required: true 
        },
        result: { 
            type: String, 
            required: true 
        },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('Detail_examination', Detail_examination);