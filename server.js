const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({path: './config.env'});
const app = require('./app');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose
    //.connect(process.env.MONGODB_URI, {  
    .connect(DB, {       // it will return promise
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false,
    useUnifiedTopology: true
}).then(con=> console.log('DB Connection Successful'))

// FOR TESTING DATABASE

// const testTour = new Tour({
//     name: 'The Snow Adventurer',
//     rating: 4.7,
//     price: 497
// })

// const testTour = new Tour({
//     name: 'The Snow Adventurer'
    
// })



// testTour.save().then(doc =>{
//     console.log(doc)
// }).catch(err=>{
//     console.log('Error :  ',err)
// })

// TO KNOW ENVIRONMENT VARIABLE
//console.log(app.get('env'))

//console.log(process.env)



const port=process.env.PORT || 3000;
app.listen(port, () =>{
    console.log(`App running on port ${port}...`);
});