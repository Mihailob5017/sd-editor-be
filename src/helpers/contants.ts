// TODO: Create error objects for DEV and create error objects for Client
import { PrismaClient } from '@prisma/client';
import { SignOptions } from 'jsonwebtoken';
import { createClient } from 'redis';
export const prismaClient: PrismaClient = new PrismaClient();

export const SignupValidationMessages = {
	required: 'This field is required',
	min: 'This field has less than the minimum number of characters',
	max: 'This field has more than the maximum number of characters',
	min_numbers: 'The minimum number of numbers must be at least 1',
	min_uppercase:
		'The minimum number of uppercase characters must be at least 1',

	notEmail: 'This is not a valid email',
};

export const errorObjects = {
	usernameTaken: 'Username already exists',
	unknowError: 'Unknown error',
	missingField: 'Missing values. Check in for the "field" response',
	somethingWentWrong: 'Something went wrong when signing up',
	userDoesntExist: 'No user found under that username',
	passwordsDontMatch: 'Passwords dont match',
	tokenError: 'Seems to be a problem with signing the JWT',
};

export const successObject = {
	accountSuccessfullyCreated: 'Account Successfully Created',
};

export const RedisClient = createClient();
export const JWTKey = process.env.SECRET_JWT_KEY || 'qweqweqe';
export const JWTOptions: SignOptions = { expiresIn: '12h' };
