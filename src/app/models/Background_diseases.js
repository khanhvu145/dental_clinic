const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Background_disease = new Schema(
    {
        name: { 
            type: String, 
            required: true 
        }
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('Background_disease', Background_disease);