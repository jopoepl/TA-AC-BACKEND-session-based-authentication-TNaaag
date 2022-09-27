var express = require('express');
const product = require('../models/product');
var router = express.Router();
const User = require('../models/user');

/* GET users listing. */
router.get('/signup', function(req, res, next) {
  res.render(`userSignup`);
});

router.get('/login', function(req, res, next) {
  res.render(`userLogin`);
});


/* GET - LOADING DASHBOARD PAGE*/

router.get('/dashboard', function(req, res, next) {
  let username = req.session.name
  let type = req.session.type
  if(type === "user"){
    res.render(`userDashboard`, {name: username})
  } else {
    req.flash("message", "Login with a User Account")
    res.redirect(`/users/login`)
  }
});





/* POST - USER SIGNUP */

router.post(`/signup`, function(req, res, next){
  User.create(req.body, (err, user) => {
      if (err) next(err)
      req.flash(`success`, `Signup Successful`)
      res.redirect(`/users/login`)
  })
})




/* POST - Handle LOGIN FOR USER. */
router.post(`/login`, function(req, res, next) {
  var {email, password} = req.body;
  if (!email || !password) {
   req.flash("message", "Email or Password cannot be empty")
    return res.redirect(`/users/login`)
  }
  User.findOne({email: email}, (err, user) => {
      if(err) return next(err) //no user
      if(!user){
        req.flash("message", "User not found")
        return res.redirect(`/users/login`)
      }
  user.verifyPassword(password, (err, result) => {
          if(!result) {
            if(err) next(err);
            req.flash("message", "Incorrect password")
            return res.redirect(`/users/login`)
          }
          if(err) next(err);
      req.session.adminId = user._id
      req.session.name = user.fname
      req.session.type = "user";
      let username = user.fname
      User.findOne({email: email},(err, user)=> {
          res.redirect(`/users/dashboard`)
        })
     })
  })
})

/* GET -- Loading CART CONTENTS */

router.get(`/cart`, (req, res, next) => {
  let name = req.session.name
  User.find({fname: name}).populate("cart").exec((err, user)=> {
    console.log("CARt CONTENT", user.cart)
    let products = user[0].cart
    res.render(`cart`, {products})
  })
})

router.get(`/cart/clear`, (req, res, next) => {
  let name = req.session.name
  User.findOneAndUpdate({fname: name}, {cart: []}, (err, user) => {
    res.redirect(`/users/dashboard`)
  })
})


/* GET -- LOGGING OUT USER */

router.get(`/logout`, (req, res, next) => {
  req.session.destroy();
   res.redirect(`/users/login`)
})


module.exports = router;
