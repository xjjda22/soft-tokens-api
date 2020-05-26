// qr.js
// const winston = require('winston');

const HTTPCode = require('../../helpers/HTTPResponseCode');

const qr = async (req, res, next) => {
	res.status(HTTPCode.success.code).send({
		httpCode: HTTPCode.success.code,
		message: HTTPCode.success.message
	});
};

module.exports = {
	register,
	deregister,
	sync,
	qr
};