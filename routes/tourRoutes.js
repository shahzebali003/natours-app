const express=require('express');
const tourController=require('./../controllers/tourController')
const authController = require('./../controllers/authController')

const router= express.Router();

// PARAM MIDDLEWARE
//router.param('id', tourController.checkID)

//CREATE A CHECKBODY MIDDLEWARE
// CHECK IF BODY CONTAINS THE NAME AND PRICE PROPERTY
//IF NOT, SEND BACK 404 (bad request)
//Add it to post handler stack

//router.param('id', tourController.checkID)

router.route('/top-5-cheap').get(tourController.aliasTopTours, tourController.getAllTours)
router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);
router.route('/').get(authController.protect,tourController.getAllTours).post(tourController.createTour);
router.route('/:id').delete(authController.protect,authController.restrictTo('admin', 'lead-guide'),tourController.deleteTour).patch(tourController.updateTour).get(tourController.getTour);


module.exports = router;

