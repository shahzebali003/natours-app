const crypto=require('crypto')
const { promisify }= require('util')
const jwt=require('jsonwebtoken')
const User= require('./../models/userModel')
const catchAsync=require('./../utils/catchAsync');
const AppError = require('./../utils/appError')
const sendEmail = require('./../utils/email')

const signToken= id=>{
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRES_IN})
}


exports.signup=catchAsync(async(req, res,next)=>{
    const newUser=await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        role: req.body.role
        //passwordChangedAt: req.body.passwordChangedAt
    })
    const token= signToken(newUser._id)

    res.status(201).json({
        status: 'success',
        token,
        data:{
            user: newUser
        }
    }) 
});


exports.login = catchAsync(async(req,res,next)=>{
    const {email, password} = req.body;

    // Check if email and password exist
    if(!email || !password){

        return next(new AppError('Please provide email and password', 400))

    }
    // Check if user exists && password is correct

    const user= await User.findOne({email}).select('+password')



    if(!user || !(await user.correctPassword(password, user.password))){
        return next(new AppError('Incorrect email or password', 401))
    }
    //console.log(user)
    // If everything is ok send token to client 

    const token = signToken(user._id)
    res.status(200).json({

        status: 'success',
        token

    })


})


// PROTECTING ROUTE

exports.protect= catchAsync(async(req,res,next)=>{
    
    // 1) getting token and check if its there
    let token;      // becuase it will not work outside the condition 
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];

    }
    //console.log(token)

    if(!token){
        return next(new AppError('You are not logged in! Please log in to get access.',401))
    }

    //2) verification token


    const decoded=await promisify(jwt.verify)(token, process.env.JWT_SECRET)
    //console.log(decoded)

    //3) check if user exist 

    const currentUser = await User.findById(decoded.id)
    if(!currentUser){
        return next(new AppError('The user belonging to this token does no longer exist. ', 401))
    }
    //4) Check if user change password after the JWT was issued
    

    if (currentUser.changedPasswordAfter(decoded.iat)){
        return next(new AppError('User recently change password! please log in again!!', 401))
    };

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user=currentUser
    next();
})

exports.restrictTo= (...roles)=>{
    return (req,res,next)=>{
        //Roles ['admin', 'lead-guide'], role=user'
        if(!roles.includes(req.user.role)){
            return next(new AppError('You donot have permission to perform this action', 403))
        }

    
        next() 





    }
} 


exports.forgotPassword= catchAsync(async(req,res,next)=>{


    //GET USER BASED ON POSTED EMAIL
    const user= await User.findOne({email: req.body.email})
    if(!user){
        return next(new AppError('There is no user of specified email', 404))
    }
    // GENERATE RANDOM RESET TOKEN

    const resetToken =user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false}) // false all required field when reset 

    // SEND IT TO USER EMAIL

    const resetURL= `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`

    const message=`Forgot your password? submit a PATCH request with your new password and passwordConfirm to: ${resetURL}. \n If you didn't forget your password, please ignore this email`

try{
    await sendEmail({
        email: user.email,
        subject: 'Your Password reset token [valid for 10 min]',
        message
    })


    res.status(200).json({
        status: 'success',
        message: 'Token sent to email!!'
    })
}catch(err){
    user.passwordResetToken= undefined;
    user.passwordResetExpires=undefined;

    await user.save({ validateBeforeSave: false})

    return next(new AppError('There was an error sending the email. Try again later!', 500))
}


})

exports.resetPassword=catchAsync(async(req,res,next)=>{
    // 1) Get user based on toekn

        const hashedToken= crypto.createHash('sha256').update(req.params.token).digest('hex')

        const user = await User.findOne({passwordResetToken: hashedToken, passwordResetExpires:{$gt:Date.now()}})

    //2) If token has not expired, and there is user , set the new password

    if(!user){
        return next(new AppError('Token is invalid or has expired', 400))
    }


    user.password=req.body.password
    user.passwordConfirm=req.body.passwordConfirm
    user.passwordResetToken= undefined
    user.passwordResetExpires= undefined

    await user.save();
    //3) Update changePasswordAt property for the user



    
    //4) log in the user send JWT

    const token = signToken(user._id)
    res.status(200).json({

        status: 'success',
        token

    })
})