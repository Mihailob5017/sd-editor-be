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

/**
 * Controller for handling user login.
 * @param _req - Express request object
 * @param _res - Express response object
 */
export const LoginController: ControllerType = async (_req, _res) => {
	try {
		// Extract user credentials from the request body
		const userCredentials: UserCredentialsInterface = _req.body.credentials;

		// Find the user in the database
		const findUser = await prismaClient.user_table.findFirst({
			where: {
				username: userCredentials.username,
			},
		});

		// If user doesn't exist, throw a custom error
		if (!findUser) {
			throw new CustomError({
				field: 'unknown',
				message: errorObjects.userDoesntExist,
			});
		}

		// Compare the provided password with the stored password hash
		const passwordMatch = await bcrypt.compare(
			userCredentials.password,
			findUser.password
		);

		// If passwords don't match, throw a custom error
		if (!passwordMatch) {
			throw new CustomError({
				field: 'password',
				message: errorObjects.passwordsDontMatch,
			});
		}

		// Retrieve the JWT from Redis
		let redisJWT = await RedisClient.get(findUser.username);

		// If JWT doesn't exist in Redis, generate a new one
		if (!redisJWT) {
			const tokenPayload: TokenPayloadInterface = {
				key_id: findUser.key_id || '',
				username: findUser.username || '',
			};
			redisJWT = signJWTToken(tokenPayload);
			await RedisClient.set(tokenPayload.username, redisJWT);
		}

		// Check if the token has expired
		const tokenHasExpired = checkIfTokenIsValid(redisJWT);

		// If the token has expired, update it in Redis
		if (tokenHasExpired) {
			await RedisClient.set(findUser.username, redisJWT);
		}

		// Send a successful response with the user details and token
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
		// Handle any errors and send an appropriate response
		const responseObject: SignupResponseInterface = {
			isSuccessful: false,
			clientMessage: errorObjects.somethingWentWrong,
			data: null,
			error: { ...err },
		};
		_res.status(400).json(responseObject);
	}
};
