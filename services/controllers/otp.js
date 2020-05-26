// otp.js
// const winston = require('winston');

const HTTPCode = require('../../helpers/HTTPResponseCode');
// const util = require('../../helpers/util');
const nacl = require('../../helpers/nacl');
const notp = require('../../helpers/notp');

// request - {
// 	"seed":"JJ0YSiAlB9ZrGEt/GR/mQm2S4SJ3HSx13SJlLF61fuU=",
//	"otp": "totp",
// }
// response - {
//     "httpCode": 200,
//     "message": "The request has succeeded.",
//     "token": "783419"
// }
const generate = async ({ body }, res, next) => {
	let { seed } = body;
	const { counter, otp } = body;
	seed = nacl.util.decodeBase64(seed);
	const opt = {
		counter
	};
	const token =
		otp === 'totp' ? notp.totp.generate(seed) : notp.hotp.generate(seed, opt);

	res.status(HTTPCode.success.code).send({
		httpCode: HTTPCode.success.code,
		message: HTTPCode.success.message,
		token
	});
};

// request - {
// 	"token":"783419",
//	"otp": "totp",
// }
// response - {
//     "httpCode": 200,
//     "message": "The request has succeeded.",
//     "valid": true
// }
const verify = async ({ body }, res, next) => {
	const { token, otp } = body;
	let valid = false;
	if (otp === 'totp') {
		const ret = notp.totp.verify(token, notp.totp.seed);
		// console.log(`totp.delta ${JSON.stringify(ret)}`);
		valid = ret && ret.delta === 0;
	} else {
		const ret = notp.hotp.verify(token, notp.hotp.seed, notp.hotp.opt);
		// console.log(`hotp.delta ${JSON.stringify(ret)}`);
		valid = ret && ret.delta >= 0;
		notp.hotp.opt.counter += 1;
	}

	res.status(HTTPCode.success.code).send({
		httpCode: HTTPCode.success.code,
		message: HTTPCode.success.message,
		valid
	});
};

module.exports = {
	generate,
	verify
};