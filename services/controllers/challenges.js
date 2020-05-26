// challenges.js
// const winston = require('winston');

const HTTPCode = require('../../helpers/HTTPResponseCode');
// const util = require('../../helpers/util');
const nacl = require('../../helpers/nacl');
const notp = require('../../helpers/notp');

const challengesModel = require('../models/challenges');

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
const create = async ({ body }, res, next) => {
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
const verify = async ({ body }, res, next) => {
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

module.exports = {
	create,
	verify,
	push,
	pull
};