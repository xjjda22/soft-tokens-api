// notp.js
// const winston = require('winston');
const notp = require('notp');
const nacl = require('tweetnacl'); // cryptographic functions
nacl.util = require('tweetnacl-util'); // encoding & decoding

// const opt = {
// 	// window : 0,
// 	counter: 1
// };

const totp = {};
const hotp = {};
totp.enseed = 'JJ0YSiAlB9ZrGEt/GR/mQm2S4SJ3HSx13SJlLF61fuU=';
hotp.enseed = 'iVfrJe/DHGeQKxsNkBUybWpI+XzvAQ/tj9R0gxLnQn4=';
totp.seed = nacl.util.decodeBase64(totp.enseed);
hotp.seed = nacl.util.decodeBase64(hotp.enseed);
hotp.opt = {
	counter: 1
};

totp.generate = seed => notp.totp.gen(seed);
hotp.generate = (seed, opt) => notp.hotp.gen(seed, opt);

totp.verify = (token, seed) => notp.totp.verify(token, seed);
hotp.verify = (token, seed, opt) => notp.hotp.verify(token, seed, opt);

// const totpMsg = `totp.seed ${totp.seed}
// totp.gen ${totp.generate(totp.seed)}
// totp.verify ${JSON.stringify(totp.verify(totp.generate(totp.seed), totp.seed))}`;

// const hotpMsg = `hotp.seed ${hotp.seed}
// hotp.gen ${hotp.generate(hotp.seed, hotp.counter)}
// hotp.verify ${JSON.stringify(hotp.verify(hotp.generate(hotp.seed, hotp.counter), hotp.seed))}`;

// const delay = ms => setInterval(() => console.log(totpMsg, hotpMsg), ms);

// delay(7000);

module.exports = {
	totp,
	hotp
};
