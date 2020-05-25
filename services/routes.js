const express = require('express');

// const authorization = require('./middlewares/authorization');
const healthCheck = require('./controllers/healthCheck');
const api = require('./controllers/api');
const users = require('./controllers/users');
const tokens = require('./controllers/tokens');

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

router.get('/keyPair', tokens.keyPair);
router.get('/seeds', tokens.seeds);
router.post('/encrypt', tokens.encryptPostValidation, tokens.encrypt);
router.post('/decrypt', tokens.decryptPostValidation, tokens.decrypt);

router.post(
	'/otp/generate',
	tokens.generateOTPPostValidation,
	tokens.generateOTP
);
router.post('/otp/verify', tokens.verifyOTPPostValidation, tokens.verifyOTP);

router.get('/tokens/publicKey', tokens.publicKey);
router.post('/tokens/register', tokens.decryptPostValidation, tokens.register);

router.post(
	'/challenges/generate',
	tokens.decryptPostValidation,
	tokens.createChallenge
);
router.post(
	'/challenges/verify',
	tokens.verifyPostValidation,
	tokens.verifyChallenge
);

module.exports = router;
