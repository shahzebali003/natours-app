
const AppError=require('./../utils/appError')
const handleCastErrorDB= err =>{

    const message=`Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400);

}
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
    console.log(process.env.NODE_ENV)
    console.log(err.isOperational)
    if(err.isOperational){
        res.status(err.statusCode).json({

            status: err.status,
            message:err.message
            
        })
    

    //Programming or other unknow error: dont leak error details
    }else{

        //1) log error
       //console.error('ERROR !!!', err)

        //2) send generic message



        res.status(500).json({
            status:'error',
            message: 'Something went very wrong!'
        })
    } 
   

}

module.exports= (err,req,res,next)=>{
    //console.log(err.stack)
    err.statusCode=err.statusCode || 500
    err.status=err.status || 'error'

    if(process.env.NODE_ENV=== 'development'){

        sendErrorDev(err,res)

    }else if(process.env.NODE_ENV=== 'production'){

        let error={ ...err }

        if(error.name === 'CastError') error = handleCastErrorDB(error)
        //console.log('production env')
        sendErrorProd(error,res)

    }
    

}