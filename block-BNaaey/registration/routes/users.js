var express = require('express');
const User = require('../models/user');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render(`users`);
});


//Handling User Registration

router.get(`/register`, (req, res) => {
  res.render(`registrationPage`)
})

router.post(`/register`, (req, res, next) => {
  User.create(req.body, (err, user) => {
    if(err) next(err)
    res.redirect(`/users/login`)
  })
})

//Handling Login Process

router.get(`/login`, (req, res) => {
    res.render(`loginPage`)
})

router.post(`/login`, (req, res, next) => {
  console.log("post req invoked")
  var {email, password} = req.body;
  if(!email || !password){
    return res.redirect(`/users/login`)
  } 
  console.log(email,password)
  User.findOne({email}, (err, user) => {
    if(err) return next(err)
    if(!user){
      return res.redirect(`/users/login`)
    }
    user.verifyPassword(password, (err, result) => {
      if(err) return next(err);
      if(!result){
        return res.redirect(`/users/login`)
      }
      req.session.userId = user._id;
      res.redirect(`/users`)
    })
  })
})




module.exports = router;
