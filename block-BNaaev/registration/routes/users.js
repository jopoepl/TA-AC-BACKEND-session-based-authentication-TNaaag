var express = require('express');
const User = require('../models/user');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get(`/register`, (req, res) => {
  res.render(`registrationPage`)
})

router.post(`/register`, (req, res, next) => {
  User.create(req.body, (err, user) => {
    if(err) next(err)
    res.redirect(`/users/login`)
  })
})

router.get(`/login`, (req, res) => {
    res.render(`loginPage`)
})



module.exports = router;
