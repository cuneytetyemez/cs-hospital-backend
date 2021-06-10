const express = require('express')
const router = express.Router()
require('../../config/passport')
const passport = require('passport')
const requireAuth = passport.authenticate('jwt', {
  session: false
})
const trimRequest = require('trim-request')

const { roleAuthorization } = require('../controllers/auth')

const mongoose = require('mongoose')
// const FileStorage = require('grid-filestorage')

// const filestorage = new FileStorage(mongoose.connection.db);

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
const GridFsStorage = require('multer-gridfs-storage');
const crypto = require('crypto');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const {GridFSBucket, ObjectID} = require('mongodb');


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
      let query = {'metadata.user_id':req.user._id}
      // prepare filter if query field present 
      let {db} = (await mongoose.connect(process.env.MONGO_URI)).connection
     
      // const query = await checkQueryString(req.query)
      res.status(200).json(await db.collection('documents.files').find(query).toArray())
    } catch (error) {
      handleError(res, error)
    }
  }
)


var storage = new GridFsStorage({
  url: process.env.MONGO_URI,
  options: {useUnifiedTopology: true},
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }

      
        const filename = buf.toString('hex') + path.extname(file.originalname) ;

        fileInfo = {
          filename: filename,
          bucketName: 'documents',
          metadata: {
            user_id: req.user._id,
            document_type: req.body.document_type
          }
        };
        resolve(fileInfo)
      });
     
    });
  }
});
// console.log('storage',storage)
const upload = multer({ storage });
// const upload = multer({ dest: './upload' });
/*
 * Create new item route
 */
router.post(
  '/',
  
  requireAuth,
  // // roleAuthorization(['admin']),
  // trimRequest.all,
  // validateCreateCity,
  upload.fields([{name:'document',maxCount:1}]),
  async (req, res) => {
    try {
      
      res.json({"working":'yese','document':req.body})
      
    } catch (error) {
      handleError(res,error)
    }
  }
)

/*
 * Get item route
 */
router.get(
  '/:id',
  // requireAuth,
  // roleAuthorization(['admin']),
  trimRequest.all,
  // validateGetCity,
  async (req, res)=>{
    const bucket = new GridFSBucket(storage.db);
	const stream = bucket.openDownloadStream(new ObjectID(req.params.id));
	stream.on('error', err => {
		if (err.code === 'ENOENT') {
			res.status(404).send('File not found');
			return;
		}

		res.status(500).send(err.message);
	});
	stream.pipe(res);
  }
)

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
