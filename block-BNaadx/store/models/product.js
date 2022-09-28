var mongoose = require(`mongoose`)
var Schema = mongoose.Schema;

var productSchema = new Schema({
    name: String, 
    quantity: Number,
    price: Number,
    image: String,
    likes: {type: Number, default: 0}
})

module.exports = mongoose.model(`Product`, productSchema)
