const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Patient = new Schema(
    {
        fullname: { 
            type: String, 
            required: true 
        },
        dateofbirth: { 
            type: Date, 
            required: true 
        },
        gender: { 
            type: String, 
            required: true 
        },
        phone: { 
            type: String, 
            required: true 
        },
        address: { 
            type: String, 
            required: true 
        },
        email: { 
            type: String, 
            required: true 
        },
        image: { 
            type: Object,
            properties: { 
                imgName: { type: String, unique: true, required: true},
                imgType: { type: String, required: true},
                imgBase64: { type: String, required: true},
            }
        },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('Patient', Patient);