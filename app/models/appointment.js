const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const AppointmentSchema = new mongoose.Schema(
  {
    
    user_id:{
      type: String,
      required:true
    },
    date: {
      type: String,
      required: true
    } ,
    time: {
      type:String,
      require: true
    },
    location: {
      type:String
    },
    department: {
      type:String
    },
    doctor: {
      type:String,
      required:true
    },
  },
  {
    versionKey: false,
    timestamps: true
  }
)
AppointmentSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('Appointment', AppointmentSchema)
