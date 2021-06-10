const { request }=require( "express" );
const express = require('express')
const router = express.Router()
require('../../config/passport')
const passport = require('passport')
const requireAuth = passport.authenticate('jwt', {
  session: false
})
const trimRequest = require('trim-request')

const { roleAuthorization } = require('../controllers/auth')

const {
  getAllCities,
  getCities,
  createCity,
  getCity,
  updateCity,
  deleteCity
} = require('../controllers/cities');
const { createItem, getItems , deleteItem, updateItem}=require( "../middleware/db" );
const { handleError }=require( "../middleware/utils" );
const Appointment=require( "../models/appointment" );

// const {
//   validateCreateCity,
//   validateGetCity,
//   validateUpdateCity,
//   validateDeleteCity
// } = require('../controllers/cities/validators')

/*
 * Cities routes
 */

/*
 * Get all items route
 */
// router.get('/all', getAllCities)

/*
 * Get items route
 */
router.get(
  '/',
  requireAuth,
  // roleAuthorization(['admin']),
  trimRequest.all,
  async (req, res) => {
    try {
      let query = {
        'user_id': req.user._id 
      }
      // prepare filter if query field present 
      if(!!Object.values(req.query).length) {
        let date = new Date(Date.now())
        query.date= {$gt: `${date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear()}`}
      }
    
      // const query = await checkQueryString(req.query)
      res.status(200).json(await Appointment.find(query))
    } catch (error) {
      handleError(res, error)
    }
  }
)

/*
 * Create new item route
 */
router.post(
  '/',
  requireAuth,
  // roleAuthorization(['admin']),
  trimRequest.all,
  // validateCreateCity,
  async (req, res) => {
    try {
      // req = matchedData(req)
      // const doesCityExists = await cityExists(req.name)
      // if (!doesCityExists) {
        console.log('creating appoitnment',req.body)
        let data = {
          user_id: req.body.user_id,
          doctor: req.body.doctor,
          location:req.body.location,
          department:req.body.department,
          date: req.body.date,
          time: req.body.time,
        }
        res.status(201).json(await createItem(data, Appointment))
        // res.status(201).json(await createItem(req, Appointment))
      // }
    } catch (error) {
      handleError(res,error)
    }
  }
)

/*
 * Get item route
 */
// router.get(
//   '/:id',
//   requireAuth,
//   roleAuthorization(['admin']),
//   trimRequest.all,
//   validateGetCity,
//   getCity
// )

/*
 * Update item route
 */
router.patch(
  '/:id',
  requireAuth,
  // roleAuthorization(['admin']),
  trimRequest.all,
  // validateUpdateCity,
  async (req, res) => {
    try {
      let data = {
        user_id: req.body.user_id,
        doctor: req.body.doctor,
        location:req.body.location,
        department:req.body.department,
        date: req.body.date,
        time: req.body.time,
      }
      console.log('patch appointment with',data)
      res.status(200).json(await updateItem(req.params.id, Appointment, data))
      
    } catch (error) {
      handleError(res, error)
    }
  }
)

/*
 * Delete item route
 */
router.delete(
  '/:id',
  requireAuth,
  // roleAuthorization(['admin']),
  trimRequest.all,
  // validateDeleteCity,
  async (req, res) => {
    try {
      
      res.status(200).json(await deleteItem(req.params.id, Appointment))
    } catch (error) {
      handleError(res, error)
    }
  }
)

module.exports = router
