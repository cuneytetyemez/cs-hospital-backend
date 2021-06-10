const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const DocumentSchema = new mongoose.Schema(
  {
    metadata: {
      user_id: {
        type: String,
        required: true
      },
      document_type:{
        type: String,
        requried: true
      }
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)
// DocumentSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('Document', DocumentSchema)
