import {
	ControllerType,
	SignupResponseInterface,
	TokenPayloadInterface,
	UserCredentialsInterface,
} from '../helpers/types';
import {
	RedisClient,
	errorObjects,
	prismaClient,
	successObject,
} from '../helpers/contants';
import { CustomError } from '../helpers/errors';
import bcrypt from 'bcryptjs';
import { checkIfTokenIsValid, signJWTToken } from '../helpers/functions';

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

		let redisJWT = await RedisClient.get(findUser.username);

		if (!redisJWT) {
			const tokenPayload: TokenPayloadInterface = {
				key_id: findUser.key_id || '',
				username: findUser.username || '',
			};
			redisJWT = signJWTToken(tokenPayload);
			await RedisClient.set(tokenPayload.username, redisJWT);
		}

		const tokenHasExpired = checkIfTokenIsValid(redisJWT);

		if (tokenHasExpired) {
			await RedisClient.set(findUser.username, redisJWT);
		}

		_res.status(200).json({
			isSuccessful: true,
			clientMessage: successObject.succesfullyLoggedIn,
			error: null,
			json_token: redisJWT,
			data: {
				...findUser,
				solved_issues_count: Number(findUser.solved_issues_count),
				rank: Number(findUser.rank),
			},
		});
	} catch (err: any) {
		const responseObject: SignupResponseInterface = {
			isSuccessful: false,
			clientMessage: errorObjects.somethingWentWrong,
			data: null,
			error: { ...err },
		};
		_res.status(400).json(responseObject);
	}
};
