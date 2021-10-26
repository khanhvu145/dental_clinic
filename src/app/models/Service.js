const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Service = new Schema(
    {
        name: { 
            type: String, 
            required: true 
        },
        description: { 
            type: String, 
            required: true 
        },
        price: { 
            type: Double,  
            required: true 
        }
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('Service', Service);