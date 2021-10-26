const mongoose = require('mongoose');
// const slug = require('mongoose-slug-generator');
// const mongooseDelete = require('mongoose-delete');
// const AutoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const Employee = new Schema(
    {
        username: { 
            type: String,
            unique: true, 
            required: true 
        },
        password: { 
            type: String, 
            required: true
        },
        fullname: { 
            type: String, 
            required: true 
        },
        email: { 
            type: String, 
            required: true 
        },
        phone: { 
            type: String,
            required: true 
        },
        address: { 
            type: Object,
            properties: { 
                building: { type: String},
                ward: { type: String},
                district: { type: String},
                city: { type: String}
            }
        },
        role: { 
            type: Schema.Types.ObjectId, 
            required: true 
        },
        image: { 
            type: String,
        },
    },
    {
        timestamps: true,
    },
);

//Add plugins
// mongoose.plugin(slug);

// Course.plugin(AutoIncrement);

// Course.plugin(mongooseDelete, { 
//     overrideMethods: 'all',
//     deletedAt : true, 
// });

module.exports = mongoose.model('Employee', Employee);
