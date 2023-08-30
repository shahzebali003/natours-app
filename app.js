// REQUIRES
const express= require('express');
const morgan= require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');


const { get } = require('http');
const AppError=require('./utils/appError')
const app = express();
const tourRouter= require('./routes/tourRoutes')
const userRouter= require('./routes/userRoutes')
const globalErrorHandler=require('./controllers/errorController')
// MIDDLEWARES


// 1) GLOBAL MIDDLEWARES
// Set security HTTP headers
app.use(helmet());
//console.log(process.env.NODE_ENV)


// Development logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }
  

// Limit requests from same API
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!'
  });
  app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
    hpp({
      whitelist: [
        'duration',
        'ratingsQuantity',
        'ratingsAverage',
        'maxGroupSize',
        'difficulty',
        'price'
      ]
    })
  );

//app.use(morgan('dev'));
//app.use(express.json());
// SERVING STATIC FILES
app.use(express.static(`${__dirname}/public`));

// app.use((req,res,next)=>{
//     console.log('Hello from the middleware!!')
//     next();
// });

// TEST MIDDLE WARE

app.use((req,res,next)=>{
    req.requestTime= new Date().toISOString();
    //console.log(req.headers)
    next();
})

// app.get('/', (req, res)=>{
//     //res.status(200).send('Hello from the server side!!');
//     res.status(200).json({message: 'Hello from the server side', app: 'Natours' });

// })

// app.post('/',(req,res)=>{

//     res.send('You can post to this endpoint!!')

// })



// ROUTE HANDLERS

// GET ALL TOURS





//app.get('/api/v1/tours', getAllTours);
// GET TOUR ON ID VARIABLE
///app.get('/api/v1/tours/:id', getTour);

//app.post('/api/v1/tours', createTour);

//app.delete('/api/v1/tours/:id', deleteTour);

//app.patch('/api/v1/tours/:id', updateTour);





// ROUTES USED AS MIDDLEWARE

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);


// IF route not handled by server

app.all('*', (req,res,next)=>{
    // res.status(404).json({
    //     status: 'fail',
    //     message: `Cant find ${req.originalUrl} on this server!`
    // })
    // const err= new Error(`Cant find ${req.originalUrl} on this server!`);
    // err.status='fail';
    // err.statusCode=404;

    next(new AppError (`Cant find ${req.originalUrl} on this server!`,404))

})


app.use(globalErrorHandler)


// SERVER

module.exports=app;

