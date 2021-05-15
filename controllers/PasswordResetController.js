const PasswordReset = require('../models/PasswordReset');
const AppError = require('../utils/AppError');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const CatchAsync = require('../utils/CatchAsync');
const User = require('../models/User');
const SendEmail = require('./../utils/SendEmail');

const signToken = (id) => {
    return jwt.sign({ id: id }, process.env.JWT_SECERET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

const createSendToken = (user, statusCode, res, message) => {
    const token = signToken(user._id);
    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true
    };
    if (process.env.NODE_ENV === 'production') {
        cookieOptions.secure = true;
    }
    user.password = undefined;
    res.cookie('jwt', token, cookieOptions);
    res.status(statusCode).json({
        status: true,
        message,
        data: { user },
        token
    });

}
exports.forgotPassword = CatchAsync(async(req, res, next) => {
    //1.Get user based on posted email address
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new AppError('The email Address does not exist in our system', 404));
    }
    //2. generate reset token 
    const passwordResetModel = new PasswordReset();
    const resetToken = passwordResetModel.createResetPasswordToken();
    passwordResetModel.email = req.body.email;
    await passwordResetModel.save();
    const resetUrl = `${req.protocol}://${req.get('host')}/api/reset-password/${resetToken}`;
    const message = `If you’re having trouble clicking the "Reset password" button, copy and paste the URL below into your web browser:
    ${resetUrl}`;
    try {
        await SendEmail({
            email: passwordResetModel.email,
            subject: 'Reset Password',
            message
        });
        res.status(200).json({
            status: 'success',
            message: "Token sent to email address",
            resetToken
        });
    } catch (error) {
        await passwordResetModel.deleteOne({ email: passwordResetModel.email });
        return next(new AppError('Unable to send reset password to email address, kindly try again later', 500));
    }
});

exports.resetPassword = CatchAsync(async(req, res, next) => {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const resetPasswordProfile = await PasswordReset.findOne({ token: hashedToken, expires_at: { $gt: Date.now() } });
    if (!resetPasswordProfile) {
        return next(new AppError('Token is not valid or has expired', 400));
    }
    //If token has not expired and their is a user, set new password
    const user = await User.findOne({
        email: resetPasswordProfile.email,
    });
    user.password = req.body.password;
    user.confirm_password = req.params.confirm_password;
    await resetPasswordProfile.deleteOne({ token: req.params.token });
    await user.save();
    //log in user and send jwt
    createSendToken(user, 200, res, 'Success!, password updated successfully');
});

exports.updatePassword = CatchAsync(async(req, res, next) => {
    const current_password = req.body.current_password;
    const confirm_password = req.body.confirm_password;
    const password = req.body.password;
    // console.log(confirm_password)
    //1. Get user from collection
    const user = await User.findOne({ _id: req.user._id }).select('+password');;
    if (!user) return next(new AppError('what is going on', 404));
    //2. Check if posted current password is correct
    if (!(await user.validatePassword(current_password, user.password))) {
        return next(new AppError('Invalid password', 401));
    }
    //3. if so, update password
    user.password = password;
    user.confirm_password = confirm_password;
    await user.save()
        //4. Log user in and send jwt
    createSendToken(user, 200, res, 'Success!, Password updated successfully');
});