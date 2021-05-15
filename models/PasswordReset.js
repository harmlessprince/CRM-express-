const mongoose = require("mongoose");
const validator = require("validator");
const crypto = require('crypto');

const schema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is required"],
        lowercase: true,
    },
    token: {
        type: String,
    },
    expires_at: { type: Date }
});
schema.methods.createResetPasswordToken = function() {
    //create randomBytes of size 32 and encode to hexadecimal
    const resetToken = crypto.randomBytes(32).toString('hex');
    //hash and save token  to db
    this.token = crypto.createHash('sha256').update(resetToken).digest('hex');
    console.log({ resetToken }, this.token);
    this.expires_at = Date.now() + 10 * 60 * 1000;
    return resetToken;
}
const PasswordReset = mongoose.model("PasswordReset", schema);

module.exports = PasswordReset;