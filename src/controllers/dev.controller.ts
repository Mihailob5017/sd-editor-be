import { Request, Response } from 'express';
import { prismaClient } from '../helpers/contants';

export const GetAllUsers = async (
	_req: Request,
	_res: Response
): Promise<void> => {
	try {
		const AllUsers = await prismaClient.user_table.findMany();
		_res.status(200).json({ users: AllUsers });
	} catch (error) {
		console.log(error);
		_res.status(500).send(error);
	}
};
export const DeleteAllUsers = async (
	_req: Request,
	_res: Response
): Promise<void> => {
	try {
		if (_req.body.areYouSure === 'Yes') {
			await prismaClient.user_table.deleteMany();
			_res.status(200).json({ success: true });
		}
	} catch (error) {
		console.log(error);
		_res.status(500).send(error);
	}
};
