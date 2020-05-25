// tokens.js
// const winston = require('winston');
const { celebrate, Joi } = require('celebrate');

const HTTPCode = require('../../helpers/HTTPResponseCode');
// const util = require('../../helpers/util');
const nacl = require('../../helpers/nacl');
const notp = require('../../helpers/notp');

const tokensModel = require('../models/tokens');
const challengesModel = require('../models/challenges');

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

const encryptPostValidation = celebrate({
	body: {
		message: Joi.required(),
		clientSecretKey: Joi.string().required()
	}
});

const decryptPostValidation = celebrate({
	body: {
		encryptedMessageWithNonce: Joi.string().required(),
		clientPublicKey: Joi.string().required()
	}
});

const generateOTPPostValidation = celebrate({
	body: {
		otp: Joi.string().required(),
		seed: Joi.string().allow(''),
		counter: Joi.number().allow('')
	}
});

const verifyOTPPostValidation = celebrate({
	body: {
		otp: Joi.string().required(),
		token: Joi.string().required()
	}
});

// const challengePostValidation = celebrate({
// 	body: {
// 		email: Joi.string()
// 			.email()
// 			.required(),
// 		encryptedMessageWithNonce: Joi.string().required()
// 	}
// });

const verifyPostValidation = celebrate({
	body: {
		encryptedMessageWithNonce: Joi.string().required(),
		clientPublicKey: Joi.string().required(),
		otp: Joi.string().required(),
		token: Joi.string().required(),
		counter: Joi.number().allow('')
	}
});

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
// 	"seed":"JJ0YSiAlB9ZrGEt/GR/mQm2S4SJ3HSx13SJlLF61fuU=",
//	"otp": "totp",
// }
// response - {
//     "httpCode": 200,
//     "message": "The request has succeeded.",
//     "token": "783419"
// }
const generateOTP = async ({ body }, res, next) => {
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
const verifyOTP = async ({ body }, res, next) => {
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

// request - {
//	"encryptedMessageWithNonce": "hZxPYmtu6XrwEJR24WolBa5i0tF8xaj9iJI3oNCjlclMzpLOSs2KNQKs9cEDTZySubjw54lt7TwJMxmHIXdso4/rN3TnzR8yLadeDp0/mnvUcNU3U6EuoJqKFWz2Twu4XK+pk0+2d4BSV+TIDZSx/xHhltzWZIM5Ahv9V/FV3uagfcqdASeAiAav48JzhyBURlwohj5o8MAI2hkXxRBz8ON9Zu1+vORHnWHVfF6Qw1KcDAPUFKunmMg0BnqxAGTjA9qhuofkRSL0x+WX0M/taSVTqzctmW7UNGn4ubghyb81TUK7IllIBkUmmFHdTtvFw2n8B99PD/q2s4ugrXe9mLa021XL8/X+dQTwB9NfLOi0t92iab4U9AiYQGqSCeYQlxRoH95JdTNiKM8=",
//	"clientPublicKey": "Blu8pSFix3GHMZZSMsv0ynTblGvaabfVY8+R9wD+oH8="
// }
// response - {
//     "httpCode": 200,
//     "message": "The request has succeeded.",
//     "challengeMessage": {
//         "email": "test@example.com",
//         "challenge": {
//             "detailsId": "123456789",
//             "details": [
//                 {
//                     "title": "from account",
//                     "display": "123456"
//                 },
//                 {
//                     "title": "to account",
//                     "display": "654321"
//                 },
//                 {
//                     "title": "amount",
//                     "display": "12.00"
//                 }
//             ],
//             "notes": [
//                 {
//                     "title": "note title",
//                     "display": "note display"
//                 }
//             ]
//         },
//         "hash": "ZIbWIPzESqgYdbjjn1VcxqUi0j4C9ZdakOhIPj5bc3rP1xffr3VQrmHG6xXjjA4QqhVI85dwEXOKYGBts0Hh6g==",
//         "id": "5ec4d2f0f0caf8df80ec3ae2"
//     }
// }
const createChallenge = async ({ body }, res, next) => {
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
	const { email, challenge } = decryptedMessage;
	const hash = nacl.hash(challenge);
	const status = true;

	const bodyData = { email, challenge, hash, status };
	// console.log('bodyData',bodyData);

	const challengeDoc = await challengesModel.addChallenge(bodyData);
	const { id } = challengeDoc;

	const challengeMessage = { ...bodyData, id };

	res.status(HTTPCode.success.code).send({
		httpCode: HTTPCode.success.code,
		message: HTTPCode.success.message,
		challengeMessage
	});
};

// request - {
//	"encryptedMessageWithNonce": "jPzvHzztRPbhuWkzps/KQWjvzYYsSnRVXzEZwNhvrZL5bcD2/Ls76TdH0fbeAwD1XrmDE4TkysVIwZ5cTooGY7c1MkBq4s56Yi7Kor68XSD6HKyV+oYgKhciWfBgPzONBYHTBXQBWqJ+X48uWZGwsReRYgKwUIiZueQeB3kIvIyg0CKQkoNpe++do+cCewD2xOxBTXpY1BTqbGax3S8OTcTW0I65Gux0AAwbsVRSNauzsqU/K9tWPNyJmpu8fTivaIzHEUSBarMM9lBhHpDOAGUI6w8xIuy8DMEII++5BN1Sq73LI2J1STda543A0xhLiKF4WV+g2b/prU7Ze5zTLfu+1UNa3LK0/gevsaVtuagxGnvzXZBEt9o9RejSOyvP2Ww5HQLENaODREngv5WOdeyQCl1IAw2wDlmWo3h+R2dDGCoydQfqIU9t7rlAXAyyIBTQCgsPqoPZM4sNzaFYRQCefU4WduRaxdMK27jotRm5xogTGJ7Muk42h/mFygqQw3wjU1YoQNK0ugpFM1K8aiZTgbA=",
//	"clientPublicKey": "Blu8pSFix3GHMZZSMsv0ynTblGvaabfVY8+R9wD+oH8=",
//	"otp": "hotp",
//	"token": "896342",
//	"counter": 1
// }
// response - {
//     "httpCode": 200,
//     "message": "The request has succeeded.",
//     "tokenMatch": false,
//     "hashMatch": true
// }
const verifyChallenge = async ({ body }, res, next) => {
	const { encryptedMessageWithNonce, clientPublicKey, otp, token } = body;

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
	const { email, challenge } = decryptedMessage;
	const hash = nacl.hash(challenge);
	const status = true;

	const challengeDoc = await challengesModel.getSingleChallengeByEmail(
		email,
		status
	);
	// console.log('challengeDoc', challengeDoc);

	let tokenMatch = false;
	let hashMatch = false;

	hashMatch = hash === challengeDoc.hash;

	if (hashMatch && challengeDoc) {
		await challengesModel.updateChallenge(challengeDoc.id, { status: false });
	}

	if (otp === 'totp') {
		const ret = notp.totp.verify(token, notp.totp.seed);
		// console.log(`totp.delta ${JSON.stringify(ret)}`);
		tokenMatch = ret && ret.delta === 0;
	} else if (otp === 'hotp') {
		const ret = notp.hotp.verify(token, notp.hotp.seed, notp.hotp.opt);
		// console.log(`hotp.delta ${JSON.stringify(ret)}`);
		tokenMatch = ret && ret.delta >= 0;
		notp.hotp.opt.counter += 1;
	}

	res.status(HTTPCode.success.code).send({
		httpCode: HTTPCode.success.code,
		message: HTTPCode.success.message,
		tokenMatch,
		hashMatch
	});
};

const push = async (req, res, next) => {
	res.status(HTTPCode.success.code).send({
		httpCode: HTTPCode.success.code,
		message: HTTPCode.success.message
	});
};

const pull = async (req, res, next) => {
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

const qr = async (req, res, next) => {
	res.status(HTTPCode.success.code).send({
		httpCode: HTTPCode.success.code,
		message: HTTPCode.success.message
	});
};

module.exports = {
	keyPair,
	seeds,
	encrypt,
	decrypt,

	encryptPostValidation,
	decryptPostValidation,
	generateOTPPostValidation,
	verifyOTPPostValidation,
	verifyPostValidation,

	generateOTP,
	verifyOTP,

	publicKey,
	register,
	deregister,
	createChallenge,
	verifyChallenge,
	push,
	pull,

	sync,

	qr
};
