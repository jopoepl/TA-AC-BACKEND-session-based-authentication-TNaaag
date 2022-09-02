var express = require('express');
const User = require('../models/user');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render(`users`);
});


//Handling User Registration

router.get(`/register`, (req, res) => {
  var error = req.flash(`error`)[0];
  res.render(`registrationPage`, {error})
})

router.post(`/register`, (req, res, next) => {
  if(!req.body.email.unique){
    req.flash("error", "Add a unique email")
    res.redirect(`/users/register`)

  }
  User.create(req.body, (err, user) => {
    if(err) next(err)
    res.redirect(`/users/login`)
  })
})


//Handling Login Process

router.get(`/login`, (req, res) => {
  var error = req.flash(`error`)[0];
    res.render(`loginPage`, {error})
})

router.post(`/login`, (req, res, next) => {
  console.log("post req invoked")
  var {email, password} = req.body;
  if(!email || !password){
    req.flash("error", "Email or Password cannot be blank")
    return res.redirect(`/users/login`)
  } 
  console.log(email,password)
  User.findOne({email}, (err, user) => {
    if(err) return next(err)
    if(!user){
      req.flash("error", "Unregistered Email, try again with a registered Email")
      return res.redirect(`/users/login`)
    }
    user.verifyPassword(password, (err, result) => {
      if(err) return next(err);
      if(!result){
        req.flash("error", "Email or Password is wrong")
        return res.redirect(`/users/login`)
      }
      req.session.userId = user._id;
      res.redirect(`/users`)
    })
  })
})


//handling logout

router.get(`/logout`, (req, res) => {
  req.session.destroy()
  res.clearCookie(`connect.sid`)
  res.redirect(`/users/login`)
})

module.exports = router;
