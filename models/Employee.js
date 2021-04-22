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
        required: [true, 'Company ID is required']
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
        enum: ['admin', 'employee', 'company'],
        default: 'employee'
    },
    phone: { type: String }

});
schema.plugin(timestamp);

//populate  employee data with their company
schema.pre(/^find/, function(next) {
    this.populate({
        path: 'company',
        select: "name website"
    });
    next();
});

//hash employee password
schema.pre('save', async function(next) {
    //If password is not modified next middleware
    if (!this.isModified('password')) return next();
    //else 
    this.password = await bcrypt.hash(this.password, 12);
    this.confirm_password = undefined;
    next();
});

// //populate  employee data with their company
// schema.post(/^findByIdAndUpdate/, function(next) {
//     this.updated_at = new Date();
//     next();
// });
//check if supplied password is same as the password in the database
schema.methods.correctPassword = async(passwordSupplied, employeePassword) => {
    return await bcrypt.compare(passwordSupplied, employeePassword);
}

const Employee = mongoose.model("Employee", schema);

module.exports = Employee;