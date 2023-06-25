import { RedisClient, prismaClient } from '../helpers/contants';
import { ControllerType } from 'helpers/types';

export const GetAllUsers: ControllerType = async (_req, _res) => {
	try {
		const AllUsers = await prismaClient.user_table.findMany();
		_res.status(200).json({ users: AllUsers });
	} catch (error) {
		console.log(error);
		_res.status(500).send(error);
	}
};
export const DeleteAllUsers: ControllerType = async (_req, _res) => {
	try {
		if (_req.body.areYouSure === 'Yes') {
			await prismaClient.user_table.deleteMany();
			await RedisClient.flushDb();
			_res.status(200).json({ success: true });
		}
	} catch (error) {
		console.log(error);
		_res.status(500).send(error);
	}
};

export const SetToken: ControllerType = async (_req, _res) => {
	try {
		const { key, value } = _req.body;

		await RedisClient.set(key || 'random-key', value || 'random-value');

		_res.status(200).send('Successfully set');
	} catch (error) {
		console.log(error);
		_res.status(500).send(error);
	}
};

export const GetToken: ControllerType = async (_req, _res) => {
	try {
		const { key } = _req.body;

		const response = await RedisClient.get(key || 'random-key');

		_res.status(200).json({ response: 'Successfully set', value: response });
	} catch (error) {
		console.log(error);
		_res.status(500).send(error);
	}
};
