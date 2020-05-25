const Debug = require('debug');
const { ObjectID } = require('mongodb');
const mongo = require('../../db/mongo');

const renameFields = item => ({
	...item,
	id: item._id,
	_id: undefined
});

const getchallenges = async () => {
	const debug = Debug('app:api:challenges');
	debug('getchallenges:start');

	const itemsRaw = await mongo.db
		.collection('challenges')
		.find({})
		.sort()
		.toArray();

	const items = itemsRaw.map(renameFields);
	debug('getchallenges:end');

	return items;
};

const getSingleChallengeByEmail = async (email, status) => {
	const debug = Debug('app:api:challenges');
	debug('getSingleUserByEmail:start');
	const user = await mongo.db
		.collection('challenges')
		.findOne({ email, status });

	debug('getSingleUserByEmail:end');
	return user ? renameFields(user) : {};
};

const addChallenge = async data => {
	const debug = Debug('app:api:challenges');
	const { email, status } = data;
	debug('add:start');

	const insertResult = await mongo.db
		.collection('challenges')
		.updateOne({ email, status }, { $set: data }, { upsert: true });
	const { _id: id } = insertResult.upsertedId || { _id: 0 };

	debug('add:end');
	return { id };
};

const updateChallenge = async (id, data) => {
	const debug = Debug('app:api:challenges');
	debug('update:start');
	await mongo.db
		.collection('challenges')
		.updateOne({ _id: new ObjectID(id) }, { $set: data });
	debug('update:end');
};

const deleteChallenge = async id => {
	try {
		const debug = Debug('app:api:challenges');
		debug('delete:start');
		await mongo.db
			.collection('challenges')
			.deleteOne({ _id: new ObjectID(id) });
		debug('delete:end');
		return true;
	} catch (e) {
		return false;
	}
};

module.exports = {
	getchallenges,
	getSingleChallengeByEmail,
	addChallenge,
	updateChallenge,
	deleteChallenge
};
