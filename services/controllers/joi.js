// joi.js
// const winston = require('winston');
const { celebrate, Joi } = require('celebrate');

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

module.exports = {
	encryptPostValidation,
	decryptPostValidation,
	generateOTPPostValidation,
	verifyOTPPostValidation,
	verifyPostValidation
};