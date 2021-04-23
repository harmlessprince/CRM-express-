const AppError = require("./../utils/AppError");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const CatchAsync = require("./../utils/CatchAsync");
const Employee = require("./../models/Employee");
const verifyToken = async(token, jwtSecret) => {
    return await promisify(jwt.verify)(token, jwtSecret);
}

exports.auth = CatchAsync(async(req, res, next) => {
    let token;
    //1. Check if token is in the header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return next(new AppError('Unauthenticated! Kindly login to have access to the resource', 401));
    }
    //2. Verify the token 
    const decodedToken = await verifyToken(token, process.env.JWT_SECRET);
    //3. Check if credentials is on server
    const AuthUser = await Employee.findById(decodedToken.id);
    if (!AuthUser) {
        return next(new AppError('Credential no longer exist on our server', 401));
    }
    //4. Check if password has really been recently changed
    if (AuthUser.hasPasswordBeenUpdated(decodedToken.iat)) {
        return next(new AppError('Password has been recently changed, kindly login again', 401));
    }
    req.user = AuthUser;
    next();
});