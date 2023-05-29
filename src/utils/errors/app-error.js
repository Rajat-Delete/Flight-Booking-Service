class AppError extends Error{

    constructor(message,statusCode){
        super(message);
        this.statusCode = statusCode;
        this.explantion = message;
    }

    //We can use Error.captureStackTrace to store the stack of Error instance.
}

module.exports = AppError;