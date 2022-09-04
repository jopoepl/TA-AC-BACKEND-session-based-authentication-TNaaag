var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var success = req.flash(`success`)[0]
  res.render('index', { title: 'REGISTER', title2: `LOGIN`, success: success });
});


module.exports = router;
