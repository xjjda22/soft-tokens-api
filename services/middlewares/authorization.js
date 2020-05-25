// authorization.js
const fs = require('fs');
const expressJwt = require('express-jwt');

const JWT_PUBLIC_KEY = fs.readFileSync('public.key');
const SET_TOKEN_AS_REVOKEN_ON_EXCEPTION = true;
const TOKENS_BLACK_LIST = [];
// const { JWT_SECRET, JWT_EMAIL } = process.env;

const getTokensBlacklist = async () => TOKENS_BLACK_LIST;

const checkTokenInBlacklistCallback = async (req, payload, done) => {
	try {
		// jti (JWT ID) need to be included in payload
		const { jti } = payload;
		// const { jti, secret, email } = payload;
		const blacklist = await getTokensBlacklist();
		let tokenIsRevoked = blacklist.includes(jti);

		if (tokenIsRevoked) tokenIsRevoked = true;
		// else if(JWT_SECRET != secret) tokenIsRevoked = true;
		// else if(JWT_EMAIL != email) tokenIsRevoked = true;
		else tokenIsRevoked = false;

		req.jwt = payload;

		return done(null, tokenIsRevoked);
	} catch (e) {
		return done(e, SET_TOKEN_AS_REVOKEN_ON_EXCEPTION);
	}
};

const authorization = expressJwt({
	credentialsRequired: true,
	secret: JWT_PUBLIC_KEY,
	algorithm: 'RS256',
	isRevoked: checkTokenInBlacklistCallback
});

module.exports = authorization;
