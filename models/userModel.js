const mongoose= require('mongoose')
const validator= require('validator')
const bcrypt=require('bcryptjs')
const userSchema= new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'Please tell us your name!']
    },
    email:{
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        validate:[validator.isEmail, 'Please provide valid email']
    },

    photo: String,
    password:{
        type: String,
        required: [true, 'Please provide a password'],
        minlength:8,
        select: false 
    },

    passwordConfirm:{
        type: String,
        required: [true, 'Please confirm your password'],
        validate:{

            // This only work on SAVE!!
            validator: function(el){
                return el  === this.password; 
            },
            message: 'Passwords are not same!'
        }
    },
    passwordChangedAt: Date

})

userSchema.pre('save', async function(next){
    // Only run this if password was actually modified
    
    if(!this.isModified('password')) return next();

    //Hash the password at cost of 12


    this.password= await bcrypt.hash(this.password, 12)
    
    // delete confirm password field

    this.passwordConfirm=undefined;
    next();
})


userSchema.methods.correctPassword=async function(candidatePassword, userPassword){
    //console.log(candidatePassword)
    //console.log(userPassword)
    return await bcrypt.compare(candidatePassword, userPassword);
}


userSchema.methods.changedPasswordAfter = function(JWTTimestamp){
    //console.log('asdasd')
    if(this.passwordChangedAt){

        const changedTimestamp=parseInt(this.passwordChangedAt.getTime()/1000,10);

        //console.log('asdasd')
        //console.log(changedTimestamp, JWTTimestamp)
        return JWTTimestamp< changedTimestamp // time 300<400
    }

    // False means not change
    return false;

}

const User = mongoose.model('User', userSchema);

module.exports= User