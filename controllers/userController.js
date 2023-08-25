//const fs= require('fs');
//const sendErrorProd= require('./errorController')
//const AppError = require('../utils/appError');
const User= require('./../models/userModel');
//const APIFeatures=require('./../utils/apiFeatures');
const catchAsync=require('./../utils/catchAsync');

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
