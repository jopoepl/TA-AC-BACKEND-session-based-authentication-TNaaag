var mongoose = require(`mongoose`)
var Schema = mongoose.Schema;



var commentSchema = new Schema({
    content: String,
    article: {type: Schema.Types.ObjectId, ref: "Article"}
})



module.exports = mongoose.model(`Comment`, commentSchema)