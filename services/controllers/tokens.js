// tokens.js
// const winston = require('winston');

const HTTPCode = require('../../helpers/HTTPResponseCode');
// const util = require('../../helpers/util');
const nacl = require('../../helpers/nacl');
const notp = require('../../helpers/notp');

const tokensModel = require('../models/tokens');

// request - {
//	"encryptedMessageWithNonce": "bUWd/vnMz9ARaz7VJ8mFEtTysTTl8jHZupcuT6Jw0K8+hZsZRbLOI0AU4nE0PCRKzYqzs3EOmOvrfz95t+QdGK2Z6kGv0wDJowQy/kZuO6x5LRm3uBMJvRB6oMixcSvsq8V5mwmWlRtdZKlR2fwEvVeY0GKL9ErM",
//	"clientPublicKey": "Blu8pSFix3GHMZZSMsv0ynTblGvaabfVY8+R9wD+oH8="
// }
// response - {
//     "httpCode": 200,
//     "message": "The request has succeeded.",
//     "decryptedMessage": {
//         "email": "test@example.com",
//         "mobile": "+601123345345",
//         "fcm": "112233445566778899"
//     },
//     "seeds": {
//         "totp": "JJ0YSiAlB9ZrGEt/GR/mQm2S4SJ3HSx13SJlLF61fuU=",
//         "hotp": "iVfrJe/DHGeQKxsNkBUybWpI+XzvAQ/tj9R0gxLnQn4=",
//         "counter": 1
//     }
// }
const register = async ({ body }, res, next) => {
	const { encryptedMessageWithNonce, clientPublicKey } = body;

	const enclientKeyPair = {
		publicKey: clientPublicKey,
		secretKey: clientPublicKey
	};
	const enserverKeyPair = {
		publicKey: nacl.secretKey(),
		secretKey: nacl.secretKey()
	};

	const clientKeyPair = nacl.decodeKeyPair(enclientKeyPair);
	const serverKeyPair = nacl.decodeKeyPair(enserverKeyPair);

	const decryptedMessage = nacl.decrypt(
		encryptedMessageWithNonce,
		clientKeyPair,
		serverKeyPair
	);
	const totp = nacl.generateKey();
	const hotp = nacl.generateKey();

	const { counter } = notp.hotp.opt;

	const bodyData = {
		...decryptedMessage,
		clientPublicKey,
		totp,
		hotp,
		counter
	};
	// console.log('bodyData',bodyData);

	await tokensModel.addToken(bodyData);

	res.status(HTTPCode.success.code).send({
		httpCode: HTTPCode.success.code,
		message: HTTPCode.success.message,
		decryptedMessage,
		seeds: {
			totp,
			hotp,
			counter
		}
	});
};

const deregister = async (req, res, next) => {
	res.status(HTTPCode.success.code).send({
		httpCode: HTTPCode.success.code,
		message: HTTPCode.success.message
	});
};

const sync = async (req, res, next) => {
	notp.hotp.opt.counter = 1;
	res.status(HTTPCode.success.code).send({
		httpCode: HTTPCode.success.code,
		message: HTTPCode.success.message
	});
};

module.exports = {
	register,
	deregister,
	sync
};
