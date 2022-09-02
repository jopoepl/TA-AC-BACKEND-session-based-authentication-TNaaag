var mongoose = require(`mongoose`)
var Schema = mongoose.Schema;
var bcrypt = require(`bcrypt`)

var userSchema = new Schema({
    name: String,
    email: String,
    password: String,
    age: Number,
    phone: Number
})

userSchema.pre(`save`, function(next){
    if(this.password && this.isModified(`password`)) {
        bcrypt.hash(this.password, 10, (err, hashed) => {
            if(err) next(err)
            this.password = hashed;
            return next()
        })
    } else {
        next()
    }
})

module.exports = mongoose.model(`User`, userSchema)