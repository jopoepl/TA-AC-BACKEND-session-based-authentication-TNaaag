var express = require('express');
var router = express.Router();

/* GET home page & SET COOKIES. */
router.get('/', function(req, res, next) {
  res.cookie("Name", "Joel")
  res.render('index', { title: 'Express' });
  
});




module.exports = router;
