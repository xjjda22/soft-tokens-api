// const winston = require('winston');

const status = async (req, res) => {
	try {
		res.status(200).send({
			uptime: Math.round(process.uptime()),
			message: 'OK',
			// timestamp: Date.now()
			timestamp: new Date(Date.now())
				.toISOString()
				.replace('T', ' ')
				.replace('Z', '')
		});
	} catch (e) {
		res.status(503).end();
	}
};

module.exports = {
	status
};
