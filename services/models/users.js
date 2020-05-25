const Debug = require('debug');
const { ObjectID } = require('mongodb');
const mongo = require('../../db/mongo');

// const sequelize = require('../db/sequelize');
// const users = await sequelize.Users.findAll();
// const user = await sequelize.Users.create(data);

const renameFields = item => ({
	...item,
	id: item._id,
	_id: undefined
});

const getUsers = async () => {
	const debug = Debug('app:api:users');
	debug('getUsers:start');

	const itemsRaw = await mongo.db
		.collection('users')
		.find({})
		.sort()
		.toArray();

	const items = itemsRaw.map(renameFields);
	debug('getUsers:end');

	return items;
};

const getSingleUserByEmail = async email => {
	const debug = Debug('app:api:users');
	debug('getSingleUserByEmail:start');
	const user = await mongo.db.collection('users').findOne({ email });

	debug('getSingleUserByEmail:end');
	return user ? renameFields(user) : {};
};

const addUser = async data => {
	const debug = Debug('app:api:users');
	const { email } = data;
	debug('add:start');

	const insertResult = await mongo.db
		.collection('users')
		.updateOne({ email }, { $set: data }, { upsert: true });
	const { _id: id } = insertResult.upsertedId || { _id: 0 };

	debug('add:end');
	return { id };
};

const updateUser = async (userId, data) => {
	const debug = Debug('app:api:users');
	debug('update:start');
	await mongo.db
		.collection('users')
		.updateOne({ _id: new ObjectID(userId) }, { $set: data });
	debug('update:end');
};

const deleteUser = async userId => {
	try {
		const debug = Debug('app:api:users');
		debug('delete:start');
		await mongo.db.collection('users').deleteOne({ _id: new ObjectID(userId) });
		debug('delete:end');
		return true;
	} catch (e) {
		return false;
	}
};

module.exports = {
	getUsers,
	getSingleUserByEmail,
	addUser,
	updateUser,
	deleteUser
};
