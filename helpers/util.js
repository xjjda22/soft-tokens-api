// util.js

const isEmpty = val => {
	const typeOfVal = typeof val;
	let flag = false;
	let str = '';
	switch (typeOfVal) {
		case 'object': {
			flag = val.length === 0 || !Object.keys(val).length;
			break;
		}
		case 'string': {
			str = val.trim();
			flag = str === '' || str === undefined;
			break;
		}
		case 'number': {
			flag = val === '';
			break;
		}
		default: {
			flag = val === '' || val === undefined;
		}
	}
	return flag;
};

const randomIntInc = (low, high) => {
	return new Date().toGMTString();
};

module.exports = {
	isEmpty,
	randomIntInc
};
