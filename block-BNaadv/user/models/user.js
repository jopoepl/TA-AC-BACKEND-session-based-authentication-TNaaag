var mongoose = require(`mongoose`)
var Schema = mongoose.Schema;
var bcrypt = require(`bcrypt`)


var userSchema = new Schema ({
    name: {type: String, required: true},
    email: {type: String, unique: true},
    password: {type: String, minlength: 5}
})

userSchema.pre(`save`, function(next){
    if(this.password && this.isModified(`password`)){
        bcrypt.hash(this.password, 10, (err, hashed) => {
            if(err) next(err);
            this.password = hashed;
            return next()
        })
    } else {
        return next()
    }
})

userSchema.methods.verifyPassword = function(password, cb){
    console.log(this.password)
    bcrypt.compare(password, this.password, (err, result) => {
        return cb(err, result)
    } )
}

module.exports = mongoose.model(`User`, userSchema)