const got = require('got');
const app = require('express')();
const bodyParser = require('body-parser');

const HTTPCode = require('./HTTPResponseCode');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('case sensitive routing', false);
app.disable('x-powered-by');

const { PORT } = process.env;


const processRequest = async (req, res, next) => {

	res.status(HTTPCode.success.code).send({
		httpCode: HTTPCode.success.code,
		message: HTTPCode.success.message
	});
};

const logger = (err, req, res, next) => {
	// console.log('logger err->', err.message);

	if (err && err.name === 'UnauthorizedError') {
		// log unauthorized requests
		res.status(HTTPCode.unauthorized.code).end({
			httpCode: HTTPCode.unauthorized.code,
			message: HTTPCode.unauthorized.message
		});
	} else if (err) {
		res.status(HTTPCode.internalServerError.code).send({
			httpCode: HTTPCode.internalServerError.code,
			message: HTTPCode.internalServerError.message
		});
	} else {
		res.status(HTTPCode.methodNotAllowed.code).end({
			httpCode: HTTPCode.methodNotAllowed.code,
			message: HTTPCode.methodNotAllowed.message
		});
	}
};

app.get('/', processRequest);
app.use(logger);

app.listen(PORT, () => {
	console.log(`Server listening on http://localhost:${PORT}`);
});

module.exports = app;
