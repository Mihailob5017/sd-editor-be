import { SignupParamSchema, ValidSignupParamSchema } from '../helpers/types';
import { SignupYupSchema } from '../models/signup.model';
import { prismaClient } from './contants';

export const validateSignup = async (
	inputParamType: SignupParamSchema
): Promise<ValidSignupParamSchema> =>
	SignupYupSchema.validate(inputParamType)
		.then((data) => ({
			...data,
			error: null,
			isSuccess: true,
		}))
		.catch((err) => ({
			data: null,
			error: {
				field: err.path.split('.')[1],
				message: err.errors[0],
			},
			isSuccess: false,
		}));

export const checkIfUsernameExists = async (
	usernameString: string | undefined
): Promise<boolean> => {
	if (usernameString) {
		const isUsernameTaken = await prismaClient.user_table.findUnique({
			where: { username: usernameString },
		});

		return isUsernameTaken ? false : true;
	}

	return false;
};

export const genericPassword = process.env.GENERIC_PASSWORD || '';
