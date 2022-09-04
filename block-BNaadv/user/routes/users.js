var express = require('express');
var router = express.Router();
var User = require(`../models/user`)


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//handling signup
router.get('/register', function(req, res, next) {
  var error = req.flash(`error`)[0]
  res.render(`signup`,  { title: `LOGIN`, title2: ``, error: error})
});

router.post('/register', function(req, res, next) {
  User.create(req.body, (err, user) => {
    res.redirect(`/users/login`)
  })
});

//handling login

router.get('/login', function(req, res, next) {
  var error = req.flash(`error`)[0]
  res.render(`login`, { title: `REGISTER`, title2: ``, error: error})
});

router.post(`/login`, (req, res, next) => {
  var {email, password} = req.body;
  if(!email || !password){
    req.flash("error", "Username or password cannot be empty")
    return res.redirect(`/users/login`)
  }
  User.findOne({email: email}, (err, user) => {
    if(err) next(err)
    if(!user) {
      req.flash("error", "Email not found")
      return res.redirect(`/users/login`)
    }
    user.verifyPassword(password, (err, result)=> {
      if(err) return next(err)
      if(!result) {
        req.flash("error", "Email or password incorrect")
        return res.redirect(`/users/login`)
      }
      req.session.userId = user._id
      req.flash("success", "Login Successful CHAMP!")
      return res.redirect(`/`)
    })
  })

})









module.exports = router;
