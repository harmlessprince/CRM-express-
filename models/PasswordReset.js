const mongoose = require("mongoose");
const validator = require("validator");

const schema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Company email is required"],
        unique: true,
        lowercase: true,
    },
    token: {
        type: String,
    },
    created_at: { type: Date }
});

const User = mongoose.model("User", schema);

module.exports = User;