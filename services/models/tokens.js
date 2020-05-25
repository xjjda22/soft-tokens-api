const Debug = require('debug');
const { ObjectID } = require('mongodb');
const mongo = require('../../db/mongo');

const renameFields = item => ({
	...item,
	id: item._id,
	_id: undefined
});

const gettokens = async () => {
	const debug = Debug('app:api:tokens');
	debug('gettokens:start');

	const itemsRaw = await mongo.db
		.collection('tokens')
		.find({})
		.sort()
		.toArray();

	const items = itemsRaw.map(renameFields);
	debug('gettokens:end');

	return items;
};

const getSingleTokenByEmail = async email => {
	const debug = Debug('app:api:tokens');
	debug('getSingleUserByEmail:start');
	const user = await mongo.db.collection('tokens').findOne({ email });

	debug('getSingleUserByEmail:end');
	return user ? renameFields(user) : {};
};

const addToken = async data => {
	const debug = Debug('app:api:tokens');
	const { email } = data;
	debug('add:start');

	const insertResult = await mongo.db
		.collection('tokens')
		.updateOne({ email }, { $set: data }, { upsert: true });
	const { _id: id } = insertResult.upsertedId || { _id: 0 };

	debug('add:end');
	return { id };
};

const updateToken = async (id, data) => {
	const debug = Debug('app:api:tokens');
	debug('update:start');
	await mongo.db
		.collection('tokens')
		.updateOne({ _id: new ObjectID(id) }, { $set: data });
	debug('update:end');
};

const deleteToken = async id => {
	try {
		const debug = Debug('app:api:tokens');
		debug('delete:start');
		await mongo.db.collection('tokens').deleteOne({ _id: new ObjectID(id) });
		debug('delete:end');
		return true;
	} catch (e) {
		return false;
	}
};

module.exports = {
	gettokens,
	getSingleTokenByEmail,
	addToken,
	updateToken,
	deleteToken
};
