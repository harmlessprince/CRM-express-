const User = require("./../models/User");
const CatchAsync = require("./../utils/CatchAsync");
const AppError = require("./../utils/AppError");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { userInfo } = require("os");

//SignToken
const SignToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};
//sign token
const createToken = (user) => {
    return SignToken(user._id);
};

//sign token
const createCookie = (user) => {
    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    };
    if (process.env.NODE_ENV === 'production') {
        cookieOptions.secure = true
    }
    return cookieOptions;
};
//Login
exports.login = CatchAsync(async(req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
        return next(
            new AppError("Please provide your email and password to login", 400)
        );
    }
    //check if email and password exist
    const user = await User.findOne({ email }).select("+password");
    //check if user exist and password is correct
    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError("Invalid Email or Password Supplied", 400));
    }
    const token = createToken(user._id);
    const cookieOptions = createCookie(user._id);
    user.password = undefined;
    res.cookie('jwt', token, cookieOptions)
    res.status(200).json({
        status: true,
        message: "You have successfully been logged in",
        data: { user },
        token
    })
});