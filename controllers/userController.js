const AppError = require('./../utils/appError')
//const fs= require('fs');
//const sendErrorProd= require('./errorController')
//const AppError = require('../utils/appError');
const User= require('./../models/userModel');
//const APIFeatures=require('./../utils/apiFeatures');
const catchAsync=require('./../utils/catchAsync');


const filterObj=(obj, ...allowedFields)=>{
    const newObj={}
    Object.keys(obj).forEach(el=>{
        if(allowedFields.includes(el)) newObj[el]=obj[el]
    })
    return newObj
}


exports.getAllUsers=catchAsync(async(req,res,next) =>{
    const users= await User.find();
    //query.sort().select().skip().limit()

    //const tours = await Tour.find().where('duration').equals(5).where('difficulty').equals('easy')

    // SEND RESPONSE

    //console.log(req.requestTime);
    res.status(200).json({
        status:'success',
        //requestedAt: req.requestTime
         results: users.length,
         data: {
             users
         }





        
    });

})


exports.updateMe=catchAsync(async(req,res,next)=>{
    // 1) Create error if user post password data

    if(req.body.password || req.body.passwordConfirm){
        return next(new AppError('This route is not for password updates. Please use /updateMyPassword', 400))
    }
    

    // 2) Filtered out unwanted fields names that are not allowed to be updated
    const filteredBody = filterObj(req.body, 'name', 'email' )

    
    //2) Update user document

    const updatedUser = await User.findByIdAndUpdate(req.user.id,filteredBody,{
        new:true, 
        runValidators: true
    
    });
    // user.name='Jonas'
    // await user.save();


    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    })
})

exports.deleteMe = catchAsync(async(req,res,next)=>{
    await User.findByIdAndUpdate(req.user.id, {active: false})

    res.status(204).json({
        status: 'success',
        data: null
    })
})


exports.deleteUser=(req,res) =>{
    res.status(500).json({
        status: 'error',
        message:'This route is not yet defined!'
    })
}
exports.updateUser=(req,res) =>{
    res.status(500).json({
        status: 'error',
        message:'This route is not yet defined!'
    })
}
exports.createUser=(req,res) =>{
    res.status(500).json({
        status: 'error',
        message:'This route is not yet defined!'
    })
}

exports.getUser=(req,res) =>{
    res.status(500).json({
        status: 'error',
        message:'This route is not yet defined!'
    })
}
