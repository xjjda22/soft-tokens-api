// seeds.js
// const winston = require('winston');

const HTTPCode = require('../../helpers/HTTPResponseCode');
// const util = require('../../helpers/util');
const nacl = require('../../helpers/nacl');
const notp = require('../../helpers/notp');

// request - {
// }
// response - {
//     "httpCode": 200,
//     "message": "The request has succeeded.",
//     "keys": {
//         "publicKey": "Blu8pSFix3GHMZZSMsv0ynTblGvaabfVY8+R9wD+oH8=",
//         "secretKey": "H/UVsPodEhteR5WivwVuTLpWiaXMHl3m9xV5a3J2+8E="
//     }
// }
const keyPair = async (req, res, next) => {
	const enclientKeyPair = nacl.encodeKeyPair(nacl.keyPair());
	res.status(HTTPCode.success.code).send({
		httpCode: HTTPCode.success.code,
		message: HTTPCode.success.message,
		keys: enclientKeyPair
	});
};

// request - {
// }
// response - {
//     "httpCode": 200,
//     "message": "The request has succeeded.",
//     "seeds": {
//         "totp": "JJ0YSiAlB9ZrGEt/GR/mQm2S4SJ3HSx13SJlLF61fuU=",
//         "hotp": "iVfrJe/DHGeQKxsNkBUybWpI+XzvAQ/tj9R0gxLnQn4=",
//         "counter": 1,
//     }
// }
const seeds = async (req, res, next) => {
	const totp = nacl.generateKey();
	const hotp = nacl.generateKey();
	const { counter } = notp.hotp.opt;

	res.status(HTTPCode.success.code).send({
		httpCode: HTTPCode.success.code,
		message: HTTPCode.success.message,
		seeds: {
			totp,
			hotp,
			counter
		}
	});
};

// request - {
//	"message": {
//         "email": "test@example.com",
//         "mobile": "+601123345345",
//         "fcm": "112233445566778899"
//     },
//	"clientSecretKey": "H/UVsPodEhteR5WivwVuTLpWiaXMHl3m9xV5a3J2+8E="
// }
// response - {
//     "httpCode": 200,
//     "message": "The request has succeeded.",
//     "encryptedMessage": "bUWd/vnMz9ARaz7VJ8mFEtTysTTl8jHZupcuT6Jw0K8+hZsZRbLOI0AU4nE0PCRKzYqzs3EOmOvrfz95t+QdGK2Z6kGv0wDJowQy/kZuO6x5LRm3uBMJvRB6oMixcSvsq8V5mwmWlRtdZKlR2fwEvVeY0GKL9ErM"
// }
const encrypt = async ({ body }, res, next) => {
	const { message, clientSecretKey } = body;

	const enclientKeyPair = {
		publicKey: clientSecretKey,
		secretKey: clientSecretKey
	};
	const enserverKeyPair = {
		publicKey: nacl.publicKey(),
		secretKey: nacl.secretKey()
	};

	const clientKeyPair = nacl.decodeKeyPair(enclientKeyPair);
	const serverKeyPair = nacl.decodeKeyPair(enserverKeyPair);

	const encryptedMessage = nacl.encrypt(message, clientKeyPair, serverKeyPair);

	res.status(HTTPCode.success.code).send({
		httpCode: HTTPCode.success.code,
		message: HTTPCode.success.message,
		encryptedMessage
	});
};

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
//     }
// }
const decrypt = async ({ body }, res, next) => {
	const { encryptedMessageWithNonce, clientPublicKey } = body;

	const enclientKeyPair = {
		publicKey: clientPublicKey,
		secretKey: clientPublicKey
	};
	const enserverKeyPair = {
		publicKey: nacl.publicKey(),
		secretKey: nacl.secretKey()
	};

	const clientKeyPair = nacl.decodeKeyPair(enclientKeyPair);
	const serverKeyPair = nacl.decodeKeyPair(enserverKeyPair);

	const decryptedMessage = nacl.decrypt(
		encryptedMessageWithNonce,
		clientKeyPair,
		serverKeyPair
	);

	res.status(HTTPCode.success.code).send({
		httpCode: HTTPCode.success.code,
		message: HTTPCode.success.message,
		decryptedMessage
	});
};

// request - {
// }
// response - {
//     "httpCode": 200,
//     "message": "The request has succeeded.",
//     "publicKey": "G+qbld9lWWU5aKaHcYTS/WWu888Egy4pI/okNI4ZAHs="
// }
const publicKey = async (req, res, next) => {
	res.status(HTTPCode.success.code).send({
		httpCode: HTTPCode.success.code,
		message: HTTPCode.success.message,
		publicKey: nacl.publicKey()
	});
};

module.exports = {
	keyPair,
	seeds,

	publicKey,
	encrypt,
	decrypt
};