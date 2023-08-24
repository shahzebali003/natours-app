class AppError extends Error {
    constructor(message, statusCode) {
      super(message);
  
      this.statusCode = statusCode;
      this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
      this.isOperational = true;
  
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  module.exports = AppError;

//ABOVE CODE IS NATOURS
//BELOW CODE IS MINE

// class AppError extends Error{

//         constructor(message, statusCode){

//             super(message);

//             this.statusCode=statusCode;
//             this.status= `${statusCode}`.startsWith('4') ? 'fail' : 'error';
//             this.isOperational=true;

//             Error.captureStackTrace(this, this.constructor);
//         }



// }

// module.exports= AppError;