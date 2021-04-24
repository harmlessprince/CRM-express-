const mongoose = require("mongoose");
const timestamp = require("../utils/Timestamp");
const validator = require('validator');
const schema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Company name is required"],
    },
    email: {
        type: String,
        required: [true, "Company email is required"],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, "Invalid email address"],
    },
    logo: { type: String },
    website: { type: String },
});
schema.plugin(timestamp);
const Company = mongoose.model("Company", schema);

module.exports = Company;