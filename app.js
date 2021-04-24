const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp')

const AppError = require('./utils/AppError');
const globalErrorHandler = require('./error/GlobalError');
const CompanyRouter = require("./routes/CompanyRoute");
const UserRouter = require("./routes/UserRoute");
const AuthRouter = require("./routes/AuthenticationRoute");
const app = express();
//Set security HTTP headers
app.use(helmet());

//Development logging
if (process.env.NODE_ENV == "development") {
    //used ofr logging request to console
    app.use(morgan("dev"));
}

//limit request coming into our app
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    messages: "Too many requests, please try again in 15 minutes"
});

//  apply to all requests
app.use('/api/', limiter);

//converts all request to json format
app.use(express.json({ limit: '10kb' }));
/* Data sanitization against xss */
app.use(xss());
// Data sanitization against NOSQL query;
app.use(mongoSanitize());
//Prevent parameter pollution
app.use(hpp({
    whitelist: [
        'duration',
        'ratingsQuantity',
        'ratingsAverage',
        'maxGroupSize',
        'difficulty',
        'price'
    ]
}));
//Serve static files
app.use(express.static(`${__dirname}/public`));
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

//mount auth routes
app.use('/api/v1', AuthRouter);
//mount user routes
app.use("/api/v1/users", UserRouter);
//mount company routes
app.use("/api/v1/companies", CompanyRouter);

app.all("*", (req, res, next) => {
    // const err = new Error(`Can't find ${req.originalUrl} on the serve`);
    // err.status = "fail";
    // err.statusCode = 404;
    next(new AppError(`Can't find ${req.originalUrl} on the server`, 404));
});

//Global Erro handling middleware
app.use(globalErrorHandler);

module.exports = app;