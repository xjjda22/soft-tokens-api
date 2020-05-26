const express = require('express');

// const authorization = require('./middlewares/authorization');
const healthCheck = require('./controllers/healthCheck');
const api = require('./controllers/api');
const users = require('./controllers/users');
const joi = require('./controllers/joi');
const seeds = require('./controllers/seeds');
const otp = require('./controllers/otp');
const tokens = require('./controllers/tokens');
const challenges = require('./controllers/challenges');

const router = express.Router();

router.get('/healthCheck', healthCheck.status);
router.get('/api', api.sampleApi);

router.post('/users', users.addEmailPostValidation, users.addUser);

// router.use(authorization);

router.put(
	'/users/:email',
	users.addEmailGetValidation,
	users.addEmailPostValidation,
	users.isEmailSameValidation,
	users.getSingleUserByEmail,
	users.updateUser
);
router.delete(
	'/users/:email',
	users.addEmailGetValidation,
	users.getSingleUserByEmail,
	users.deleteUser
);

router.get('/keyPair', seeds.keyPair);
router.get('/seeds', seeds.seeds);
router.post('/encrypt', joi.encryptPostValidation, seeds.encrypt);
router.post('/decrypt', joi.decryptPostValidation, seeds.decrypt);
router.get('/publicKey', seeds.publicKey);

router.post(
	'/otp/generate',
	joi.generateOTPPostValidation,
	otp.generate
);
router.post('/otp/verify', joi.verifyOTPPostValidation, otp.verify);

router.post('/tokens/register', joi.decryptPostValidation, tokens.register);

router.post(
	'/challenges/generate',
	joi.decryptPostValidation,
	challenges.create
);
router.post(
	'/challenges/verify',
	joi.verifyPostValidation,
	challenges.verify
);

module.exports = router;
