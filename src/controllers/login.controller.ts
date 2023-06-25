import { ControllerType, UserCredentialsInterface } from '../helpers/types';
import { errorObjects, prismaClient } from '../helpers/contants';
import { CustomError } from '../helpers/errors';
import bcrypt from 'bcryptjs';

export const LoginController: ControllerType = async (_req, _res) => {
	try {
		const userCredentials: UserCredentialsInterface = _req.body.credentials;
		const findUser = await prismaClient.user_table.findFirst({
			where: {
				username: userCredentials.username,
			},
		});
		if (!findUser)
			throw new CustomError({
				field: 'unknown',
				message: errorObjects.userDoesntExist,
			});

		const passwordMatch = await bcrypt.compare(
			userCredentials.password,
			findUser.password
		);
		if (!passwordMatch)
			throw new CustomError({
				field: 'password',
				message: errorObjects.passwordsDontMatch,
			});
	} catch (error) {}
};
