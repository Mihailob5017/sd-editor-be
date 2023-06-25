import {
	checkIfUsernameExists,
	genericPassword,
	validateSignup,
} from '../helpers/validation';
import { CustomError } from '../helpers/errors';
import {
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
import { findMissingValue, signJWTToken } from '../helpers/functions';

/**
 * Controller for handling user signup.
 * @param _req - Express request object
 * @param _res - Express response object
 */
export const SignUpController: ControllerType = async (_req, _res) => {
	try {
		// Validate the signup data using yup validation
		const yupValidation = await validateSignup(_req.body);

		// If validation fails, throw a custom error
		if (!yupValidation.isSuccess && yupValidation.error) {
			throw new CustomError({ ...yupValidation.error });
		}

		const { data: inputData } = yupValidation;

		// Check if the username already exists
		const isUniqueUsername = await checkIfUsernameExists(inputData?.username);

		// If the username is not unique, throw a custom error
		if (!isUniqueUsername) {
			throw new CustomError({
				field: 'username',
				message: errorObjects.usernameTaken,
			});
		}

		if (inputData) {
			// Generate a unique key ID for the user
			const keyID: string = await uuidv4();

			// Hash the password
			const hashedPassword: string = await bcrypt.hash(
				inputData.password || genericPassword,
				8
			);

			// Set initial values for rank, solved_issues_count, and created_at
			const currentRank: number = 0;
			const solvedIssuesCount: number = 0;
			const currentDay: Date = new Date();

			// Create a new user in the database
			const newUser: any = await prismaClient.user_table.create({
				data: {
					key_id: keyID,
					username: inputData.username,
					password: hashedPassword,
					created_at: currentDay,
					email: inputData.email,
					rank: Number(currentRank),
					solved_issues_count: Number(solvedIssuesCount),
				},
			});

			// Generate a JSON Web Token (JWT) for the user
			const tokenPayload: TokenPayloadInterface = {
				key_id: newUser.key_id || '',
				username: newUser.username || '',
			};

			const jsonToken = signJWTToken(tokenPayload);

			// Store the JWT in Redis
			await RedisClient.set(inputData.username || '', jsonToken).catch(
				(err) => {
					console.log(err);
					throw new CustomError({
						field: 'token',
						message: errorObjects.tokenError,
					});
				}
			);

			// Create the response object with the user details and token
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

			// Send a successful response
			_res.status(200).json(responseObject);
		} else {
			// If any required fields are missing, throw a custom error
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
