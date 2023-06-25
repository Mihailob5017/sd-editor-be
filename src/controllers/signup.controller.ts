import jwt from 'jsonwebtoken';
import {
	checkIfUsernameExists,
	genericPassword,
	validateSignup,
} from '../helpers/validation';
import { CustomError } from '../helpers/errors';
import {
	JWTKey,
	JWTOptions,
	RedisClient,
	errorObjects,
	prismaClient,
	successObject,
} from '../helpers/contants';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import {
	ControllerType,
	SignupResponseInterface,
	TokenPayloadInterface,
} from 'helpers/types';
import { findMissingValue } from '../helpers/functions';
import { userInfo } from 'os';
import { json } from 'body-parser';

export const SignUpController: ControllerType = async (_req, _res) => {
	try {
		const yupValidation = await validateSignup(_req.body);
		if (!yupValidation.isSuccess && yupValidation.error) {
			throw new CustomError({ ...yupValidation.error });
		}
		const { data: inputData } = yupValidation;
		const isUniqueUsername = await checkIfUsernameExists(inputData?.username);
		if (!isUniqueUsername) {
			throw new CustomError({
				field: 'username',
				message: errorObjects.usernameTaken,
			});
		}
		if (inputData) {
			const keyID: string = await uuidv4();
			const hasshedPassword: string = await bcrypt.hash(
				inputData.password || genericPassword,
				8
			);

			const currentRank: number = 0;
			const solvedIssuesCount: number = 0;
			const currentDay: Date = new Date();
			const newUser: any = await prismaClient.user_table.create({
				data: {
					key_id: keyID,
					username: inputData.username,
					password: hasshedPassword,
					created_at: currentDay,
					email: inputData.email,
					rank: Number(currentRank),
					solved_issues_count: Number(solvedIssuesCount),
				},
			});
			const tokenPayload: TokenPayloadInterface = {
				key_id: newUser.key_id || '',
				username: newUser.username || '',
			};

			const jsonToken: string = jwt.sign(tokenPayload, JWTKey, JWTOptions);

			await RedisClient.set(inputData.username || '', jsonToken).catch(
				(err) => {
					console.log(err);
					throw new CustomError({
						field: 'token',
						message: errorObjects.tokenError,
					});
				}
			);

			const responseObject: SignupResponseInterface = {
				isSuccessful: true,
				clientMessage: successObject.accountSuccessfullyCreated,
				error: null,
				json_token: jsonToken,
				data: {
					...newUser,
					solved_issues_count: Number(newUser.solved_issues_count),
					rank: Number(newUser.rank),
				},
			};

			_res.status(200).json(responseObject);
		} else {
			if (findMissingValue(inputData) && findMissingValue(inputData) !== null) {
				throw new CustomError({
					field: findMissingValue(inputData) || '',
					message: errorObjects.missingField,
				});
			} else {
				throw new CustomError({
					field: 'unknown',
					message: errorObjects.unknowError,
				});
			}
		}
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
