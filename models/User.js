const mongoose = require("mongoose");
const timestamp = require('../utils/Timestamp');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const schema = new mongoose.Schema({
    first_name: {
        type: String,
        required: [true, "First name is required"],
    },
    last_name: {
        type: String,
        required: [true, "Last name is required"],
    },
    company: {
        type: mongoose.Schema.ObjectId,
        ref: 'Company',
        required: [function() { return this.role === 'user'; },
            'A user of type user must belong to a company'
        ],

    },
    email: {
        type: String,
        required: [true, "Company email is required"],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, "Invalid email address"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [8, 'password should be a minimum length of 8 characters'],
        trim: true,
        select: false,
    },
    confirm_password: {
        type: String,
        required: [true, "Password is required"],
        validate: {
            validator: function(element) {
                return element === this.password
            },
            message: 'password and confirm password must be the same'
        }
    },
    active: {
        type: Boolean,
        default: true,
        select: false,
    },
    role: {
        type: String,
        enum: ['admin', 'user', 'company'],
        default: 'user'
    },
    phone: { type: String },
    password_updated_at: Date,
    password_reset_token: String,
    password_reset_token_expires_at: Date,

});
schema.plugin(timestamp);

//populate  user data with their company
schema.pre(/^find/, function(next) {
    this.populate({
        path: 'company',
        select: "name website"
    });
    next();
});

//hash user password
schema.pre('save', async function(next) {
    //If password is not modified next middleware
    if (!this.isModified('password')) return next();
    //else hash password
    this.password = await bcrypt.hash(this.password, 12);
    this.confirm_password = undefined;
    next();
});

// //populate  user data with their company
// schema.post(/^findByIdAndUpdate/, function(next) {
//     this.updated_at = new Date();
//     next();
// });
//check if supplied password is same as the password in the database
schema.methods.correctPassword = async(passwordSupplied, userPassword) => {
    return await bcrypt.compare(passwordSupplied, userPassword);
}
schema.methods.hasPasswordBeenUpdated = function(jwtTimeStamp) {
    if (this.password_updated_at) {
        const passwordUpdatedAt = parse(this.password_updated_at.getTime() / 1000, 10);
        return jwtTimeStamp < passwordUpdatedAt;
    }
    return false;
}

const User = mongoose.model("User", schema);

module.exports = User;