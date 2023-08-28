


// BELOW CODE IS MINE

const AppError=require('./../utils/appError')
const handleCastErrorDB= err =>{

    const message=`Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400);

}

const handleDuplicateFieldsDB = err=>{
    
    const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0]
    console.log(value)
    const message = `Duplicate field value: ${value}. Please use another value`
    return new AppError(message, 400)
}

const handleValidationErrorDB= err=>{
    const errors =Object.values(err.errors).map(el => el.message)
    const message= `Invalid input data. ${error.join('. ')}`
    return new AppError(message, 400)

}



const handleJWTError = () => new AppError('Invalid Token Please login again !!',401)

const handleJWTExpireError= ()=> new AppError('Your token has expired! Please log in again.', 401)

const sendErrorDev=(err,res)=>{
    res.status(err.statusCode).json({

        status: err.status,
        error: err,
        message:err.message,
        stack: err.stack
    })
}

const sendErrorProd=(err,res)=>{

    
    // Operationl, trusted error: send message to client

   //console.log(process.env.NODE_ENV)
    //console.log(err.isOperational)
    

    if(err.isOperational){
        res.status(err.statusCode).json({

            status: err.status,
            message:err.message
            
        })
    

    //Programming or other unknow error: dont leak error details
    }else{

        //1) log error
       console.error('ERROR !!!', err)

        //2) send generic message



        res.status(500).json({
            status:'error',
            message: 'Something went very wrong!'
        })
    } 
   

}

module.exports=sendErrorProd

module.exports= (err,req,res,next)=>{
    //console.log(err.stack)
    err.statusCode=err.statusCode || 500
    err.status=err.status || 'error'

    if(process.env.NODE_ENV=== 'development'){

        sendErrorDev(err,res)

    }else if(process.env.NODE_ENV=== 'production'){

        let error = Object.create(err);  
      //let error={ ...err }

        if(error.name === 'CastError') error = handleCastErrorDB(error)
        if(error.code===11000) error = handleDuplicateFieldsDB(error)
        if(error.code==='ValidationError') error = handleValidationErrorDB(error)
        if(error.name==='JsonWebTokenError') error = handleJWTError()
        if(error.name==='TokenExpiredError') error = handleJWTExpireError()
      
        //console.log('production env')
        sendErrorProd(error,res)

    }
    

}