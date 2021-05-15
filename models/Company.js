const mongoose = require("mongoose");
const timestamp = require("../utils/Timestamp");
const validator = require("validator");
const schema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Company name is required"],
        unique: true,
    },
    email: {
        type: String,
        required: [true, "Company email is required"],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, "Invalid email address"],
    },
    logo: { type: String },
    website: { type: String, unique: true, },
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'A company must belong to a user in the system'],
        unique: true,
    }

}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
schema.plugin(timestamp);
schema.virtual("employees", {
    ref: "User",
    foreignField: "company",
    localField: "_id",
});
schema.virtual("total_employees", {
    ref: "User",
    foreignField: "company",
    localField: "_id",
    count: true
});
const Company = mongoose.model("Company", schema);

module.exports = Company;