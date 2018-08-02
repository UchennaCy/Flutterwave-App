var express = require('express');
var router = express.Router();
var pi = require('/models/keys')

/* GET home page. */
router.get('/', function(req, res, next) {

	var data = {
		"card": req.body.cardno,
		"": pi.key,


	}


  res.render('index', { title: 'Express' });
});

module.exports = router;
