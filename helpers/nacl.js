// nacl.js
// const winston = require('winston');
const nacl = require('tweetnacl'); // cryptographic functions
nacl.util = require('tweetnacl-util'); // encoding & decoding

const { util } = nacl.util;
// const enclientKeyPair = {
// 	publicKey: 'Blu8pSFix3GHMZZSMsv0ynTblGvaabfVY8+R9wD+oH8=',
// 	secretKey: 'H/UVsPodEhteR5WivwVuTLpWiaXMHl3m9xV5a3J2+8E='
// };
const enserverKeyPair = {
	publicKey: 'G+qbld9lWWU5aKaHcYTS/WWu888Egy4pI/okNI4ZAHs=',
	secretKey: 'GUOJHDfy+K/OpgoT7qy3aZiE/EnvchK+utGc9NuA2wU='
};

const publicKey = () => enserverKeyPair.publicKey;
const secretKey = () => enserverKeyPair.secretKey;

const keyPair = () => nacl.box.keyPair();
const randomNonce = () => nacl.randomBytes(nacl.box.nonceLength);
const hash = message =>
	nacl.util.encodeBase64(
		nacl.hash(
			nacl.util.decodeBase64(nacl.util.encodeBase64(JSON.stringify(message)))
		)
	);

const generateKey = () =>
	nacl.util.encodeBase64(nacl.randomBytes(nacl.secretbox.keyLength));

const encodeKeyPair = pair => {
	// const { publicKey, secretKey } = pair;
	return {
		publicKey: nacl.util.encodeBase64(pair.publicKey),
		secretKey: nacl.util.encodeBase64(pair.secretKey)
	};
};

const decodeKeyPair = pair => {
	return {
		publicKey: nacl.util.decodeBase64(pair.publicKey),
		secretKey: nacl.util.decodeBase64(pair.secretKey)
	};
};

const encrypt = (json, clientKeyPair, serverKeyPair, key) => {
	const nonce = randomNonce();

	const messageUint8 = nacl.util.decodeUTF8(JSON.stringify(json));
	const sharedA = nacl.box.before(
		serverKeyPair.publicKey,
		clientKeyPair.secretKey
	);
	const encrypted = key
		? nacl.box(messageUint8, nonce, key, sharedA)
		: nacl.box.after(messageUint8, nonce, sharedA);

	const fullMessage = new Uint8Array(nonce.length + encrypted.length);
	fullMessage.set(nonce);
	fullMessage.set(encrypted, nonce.length);

	const base64FullMessage = nacl.util.encodeBase64(fullMessage);
	return base64FullMessage;
};

const decrypt = (encryptedMsgWithNonce, clientKeyPair, serverKeyPair, key) => {
	const messageWithNonceAsUint8Array = nacl.util.decodeBase64(
		encryptedMsgWithNonce
	);
	const nonce = messageWithNonceAsUint8Array.slice(0, nacl.box.nonceLength);
	const message = messageWithNonceAsUint8Array.slice(
		nacl.box.nonceLength,
		encryptedMsgWithNonce.length
	);
	const sharedB = nacl.box.before(
		clientKeyPair.publicKey,
		serverKeyPair.secretKey
	);
	const decrypted = key
		? nacl.box.open(message, nonce, key, sharedB)
		: nacl.box.open.after(message, nonce, sharedB);

	if (!decrypted) {
		throw new Error('Could not decrypt message');
	}
	const base64DecryptedMessage = nacl.util.encodeUTF8(decrypted);
	return JSON.parse(base64DecryptedMessage);
};

// example - encrypt and decrypt message
// const obj = { "message": "hello there!!" };
// const enclientKeyPair = encodeKeyPair(keyPair());
// const enserverKeyPair = {
// 	publicKey: 'G+qbld9lWWU5aKaHcYTS/WWu888Egy4pI/okNI4ZAHs=',
//   	secretKey: 'GUOJHDfy+K/OpgoT7qy3aZiE/EnvchK+utGc9NuA2wU='
// };
// console.log(enclientKeyPair,enserverKeyPair);

// const clientKeyPair = decodeKeyPair(enclientKeyPair);
// const serverKeyPair = decodeKeyPair(enserverKeyPair);
// // const serverKeyPair = keyPair();

// const encrypted = encrypt(obj, clientKeyPair, serverKeyPair);
// const decrypted = decrypt(encrypted, clientKeyPair, serverKeyPair);
// console.log(obj, encrypted, decrypted);

module.exports = {
	publicKey,
	secretKey,
	keyPair,
	generateKey,
	randomNonce,
	encodeKeyPair,
	decodeKeyPair,
	encrypt,
	decrypt,
	hash,
	util
};
