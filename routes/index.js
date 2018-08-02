var express = require('express');
var request = require('request');
var router = express.Router();

// this is the getKey function that generates an encryption Key for you by passing your Secret Key as a parameter.
function getKey(seckey){
    var md5 = require('md5');
    var keymd5 = md5(seckey);
    var keymd5last12 = keymd5.substr(-12);

    var seckeyadjusted = seckey.replace('FLWSECK-', '');
    var seckeyadjustedfirst12 = seckeyadjusted.substr(0, 12);

    return seckeyadjustedfirst12 + keymd5last12;
}

// This is the encryption function that encrypts your payload by passing the stringified format and your encryption Key.
function encrypt(key, text)
{
    var CryptoJS = require('crypto-js');
    var forge    = require('node-forge');
    var utf8     = require('utf8');
    var cipher   = forge.cipher.createCipher('3DES-ECB', forge.util.createBuffer(key));
    cipher.start({iv:''});
    cipher.update(forge.util.createBuffer(text, 'utf-8'));
    cipher.finish();
    var encrypted = cipher.output;
    return ( forge.util.encode64(encrypted.getBytes()) );
}

/* GET home page. */
router.post('/payment/rave', function(req, res, next) {

	if (
		req.body.cardno &&
		req.body.cvv &&
		req.body.expirymonth &&
		req.body.expiryyear &&
		req.body.currency &&
		req.body.amount &&
		req.body.email &&
		req.body.phonenumber &&
		req.body.firstname &&
		req.body.lastname
	) {

		var payload = {
		  "PBFPubKey": "FLWPUBK-cdcb0ad34a933a49299621a3851238c2-X",
		  cardno: req.body.cardno,
		  cvv: req.body.cvv,
		  expirymonth: req.body.expirymonth,
		  expiryyear: req.body.expiryyear,
		  currency: req.body.currency,
		  "country": "NG",
		  amount: req.body.amount,
		  email: req.body.email,
		  phonenumber: req.body.phonenumber,
		  firstname: req.body.firstname,
		  lastname: req.body.lastname,
		  "IP": "355426087298442",
		  "txRef": "MC-" + Date.now(),// your unique merchant reference
		  "meta": [{metaname: "flightID", metavalue: "123949494DC"}],
		  "redirect_url": "https://rave-webhook.herokuapp.com/receivepayment",
		  "device_fingerprint": "69e6b7f0b72037aa8428b70fbe03986c"
		}

		var SECRET_KEY = 'FLWSECK-b3acf6d9df6e000fef05bf14a970afaa-X';

		var key = getKey(SECRET_KEY);

		var encryptedPayload = encrypt(key, JSON.stringify(payload));

		return request.post({
			url: 'https://ravesandboxapi.flutterwave.com/flwv3-pug/getpaidx/api/charge',
			json: true,
			body: {
			  "PBFPubKey": "FLWPUBK-cdcb0ad34a933a49299621a3851238c2-X",
			  "client": encryptedPayload,
			  "alg": "3DES-24"
			}
		}, function(err, statusCode, body) {

			if (err) {
				return res.status(500).json({
					status: "failed",
					error: "An error occurred and the server could not process the request at this time."
				});
			}

			return res.json(body);

		});
	}

	return res.status(422).json({
		status: "failed",
		error: "One or more missing request fields."
	});

});

module.exports = router;
