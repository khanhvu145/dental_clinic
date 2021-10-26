module.exports = {
    mutipleMongooseToObject: function (mongooseArrays) {
        return mongooseArrays.map((mongooseArray) => mongooseArray.toObject());
    },
    mongooseToObject: function (mongoose) {
        return mongoose ? mongoose.toObject() : mongoose;
    },
};
