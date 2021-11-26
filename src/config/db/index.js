const mongoose = require('mongoose');
require('dotenv').config()

async function connect() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dental_clinic', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true,
        });
        console.log('Connect successfully');
    } catch (err) {
        console.log('Connect fail');
    }
}

module.exports = { connect };
