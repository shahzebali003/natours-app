//const fs= require('fs');
const AppError = require('../utils/appError');
const Tour= require('./../models/tourModel')
const APIFeatures=require('./../utils/apiFeatures')
const catchAsync=require('./../utils/catchAsync')




exports.aliasTopTours= catchAsync((req,res,next)=>{
    req.query.limit ='5';
    req.query.sort='-ratingsAverage,price';
    req.query.fields='name,price,ratingsAverage,summary,difficulty';
    next();
})










// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));
 
//exports.checkID = (req, res, next, val)=>{
//     if(req.params.id*1 > tours.length){
//         return res.status(404).json({
//             status: 'fail',
//             message: 'Invalid ID'
//         }); 
//    }

//    next();

// }

// exports.checkBody= (req,res,next)=>{
//     if(!req.body.name || !req.body.price){
//         return res.status(400).json({
//             status: 'fail',
//             message: 'Missing name or price'
//         })
//     }
//     next();
// }





exports.getAllTours = catchAsync(async(req, res,next)=>{


    const features= new APIFeatures(Tour.find(), req.query).filter().sort().limitFields().paginate();
    const tours= await features.query;
    //query.sort().select().skip().limit()

    //const tours = await Tour.find().where('duration').equals(5).where('difficulty').equals('easy')

    // SEND RESPONSE

    //console.log(req.requestTime);
    res.status(200).json({
        status:'success',
        //requestedAt: req.requestTime
         results: tours.length,
         data: {
             tours
         }





        
    });


    //try{
        
        // BUILD QUERY

        //1) FILTERING
       
        // SORTING

        // if(req.query.sort){
        //     const sortBy= req.query.sort.split(',').join(' ');
        //     //console.log(sortBy)
        //     query=query.sort(sortBy)

        //     //sort('price ratingAverage')
        // } else{
        //     query=query.sort('-createdAt')
        // }


        // 3) FIELD LIMITING 

        // if (req.query.fields){
        //     const fields=req.query.fields.split(',').join(' ');
        //     query= query.select(fields)
        // }else{

        //     query= query.select('-__v')
        // }
    

        // 4) PAGINATION
        // const page=req.query.page*1 || 1
        // const limit = req.query.limit*1 || 100;

        // // if page=1 and limit=3
        // // (1-1)*3
        // // 0

        // const skip = (page-1)*limit



        // //PAGE 2 LIMIT 10  
        // query= query.skip(skip).limit(limit)

        // if(req.query.page){
        //     const numTours= await Tour.countDocuments();
        //     if(skip>=numTours) throw new Error('This page does not exist')
        // }


        //console.log(req.query)
        // const tours= await Tour.find({
        //     duration:5,
        //     difficulty: 'easy'
        // })
        // EXECUTE QUERY


    // }catch(err){
    //     res.status(404).json({
    //         status: 'fail',
    //         message: err
    //     })
    // }
    


});

exports.getTour = catchAsync(async(req, res,next)=>{
    
    const tour =await Tour.findById(req.params.id)
    // Tour.findOne({_id: req.params.id})

    if(!tour){
        return next(new AppError('No tour found with that ID', 404));

    }

    res.status(200).json({
        status:'success',
        //requestedAt: req.requestTime
         //results: tours.length,
         data: {
             tour
         }

        
    });

    //console.log(req.params);
    //const id=req.params.id * 1; // to convert in string to number
    
    //const tour = tours.find(el=> el.id === id)
    
    //if(id>tours.length){
    // if(!tour){
    //     return res.status(404).json({
    //         status: 'fail',
    //         message: 'Invalid ID'
    //     }) 
    // }
    
    //res.status(200).json({
        //status:'success'
        //results: tours.length,
        // data: {
        //     tour
        // }

        
    //})

});




exports.createTour = catchAsync(async(req,res, next)=>{

    //const newTour= new Tour({})
    //newTour.save()
    
    const newTour= await Tour.create(req.body);
    res.status(201).json({
        status: 'success',
        data:{
            tour: newTour
        }

    });
//    try{

        

        
    // }catch(err){
    //     res.status(400).json({
    //         status: 'fail',
    //         message: err
    //     })
    // }   
});

    //console.log(req.body);
    
    //const newID =tours[tours.length-1].id+1;
    //const newTour= Object.assign({id: newID}, req.body)

    //tours.push(newTour);
    //fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err =>{


    //});


exports.deleteTour= catchAsync(async (req, res,next)=>{
    const tour=await Tour.findByIdAndDelete(req.params.id) //to not send data back to client
    
    if(!tour){
        return next(new AppError('No tour found with that ID',404))
    }
    
    
    res.status(204).json({
        status:'success',
        data:null
    
    });
    // try{



    // }catch(err){

    //     res.status(400).json({
    //         status: 'fail',
    //         message: err
    //     })
    // }
    
    // const id= req.params.id*1;
     //const tour = tours.find(el=> el.id === id)
    //  if(req.params.id*1 > tours.length){
    //      return res.status(404).json({
    //          status: 'fail',
    //          message: 'Invalid ID'
    //      }); 
    // }
 
    //});
 
});

exports.updateTour= catchAsync(async(req, res,next)=>{

    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true 
    })

    if(!tour){
        return next(new AppError('No tour found with that ID',404))
    }

    res.status(200).json({
        status:'success',
        data:{
            tour
        }

    });


    // try{

    // }catch(err){
    //     res.status(404).json({
    //         status: 'fail',
    //         message: err
    //     })
    // }

})
    // const id= req.params.id*1;
     //const tour = tours.find(el=> el.id === id)
    //  if(req.params.id*1 > tours.length){
    //      return res.status(404).json({
    //          status: 'fail',
    //          message: 'Invalid ID'
    //      }); 
    //  }
 
 
 

 
     //});
 
 
 
 //   res.send('Done');
 
//}



exports.getTourStats= catchAsync(async(req, res,next)=>{
    const stats= await Tour.aggregate([
            
        {

        $match: {ratingsAverage:{$gte: 4.5}}

        },
        {
            $group:{
                //_id: null, // it includes all records
                _id: {$toUpper:'$difficulty'},
                numTours: {$sum: 1},
                numRatings: {$sum: '$ratingsQuantity'}, 
                avgRating:{$avg: '$ratingsAverage'},
                avgPrice: {$avg: '$price'},
                minPrice:{$min: '$price'},
                maxPrice:{$max: '$price'}
            }
        },
        
        {
            $sort: { avgPrice: 1 }
        },
        // {
        //     $match: { _id: {$ne: 'EASY'}}
        // }
        

        
    ]);

    res.status(200).json({
        status:'success',
        data:{
            stats
        }

    });
    
    
    // try{

    // }catch(err){
    //     res.status(404).json({
    //         status: 'fail',
    //         message: err
    //     })
    // }
})

exports.getMonthlyPlan=catchAsync(async(req,res,next)=>{
    
    const year= req.params.year*1
    const plan = await Tour.aggregate([

        {
            $unwind:'$startDates'
        },
        {
            $match:{
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`)
                }
            }
        },
        {
            $group:{
                _id: {$month: '$startDates'},
                numTourStarts: { $sum: 1},
                tours: {$push: '$name'}
            }
        },
        {
            $addFields: { month: '$_id'}
        },
        {
            $project:{
                _id:0

            }
        },
        {
            $sort: {numTourStarts: -1}
        },
        {
            $limit: 12
        }
    ]);

    res.status(200).json({
        status:'success',
        data:{
            plan
        }

    });

    // try{


    // }
    // catch(err){
    //     res.status(404).json({
    //         status: 'fail',
    //         message: err
    //     })
    // }
})