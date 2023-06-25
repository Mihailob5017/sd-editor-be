import { PrismaClient } from '@prisma/client';
import { SignOptions } from 'jsonwebtoken';
import { createClient } from 'redis';

// Create an instance of PrismaClient
export const prismaClient: PrismaClient = new PrismaClient();

// Validation messages for signup
export const SignupValidationMessages = {
	required: 'This field is required',
	min: 'This field must have at least the minimum number of characters',
	max: 'This field must have less than the maximum number of characters',
	min_numbers: 'This field must have at least 1 number',
	min_uppercase: 'This field must have at least 1 uppercase character',
	notEmail: 'This is not a valid email',
};

// Error messages
export const errorObjects = {
	usernameTaken: 'Username already exists',
	unknowError: 'An unknown error occurred',
	missingField: 'Missing values. Please check the "field" response',
	somethingWentWrong: 'Something went wrong when signing up',
	userDoesntExist: 'No user found with that username',
	passwordsDontMatch: 'Passwords do not match',
	tokenError: 'There seems to be a problem with signing the JWT',
};

// Success messages
export const successObject = {
	accountSuccessfullyCreated: 'Account successfully created',
	succesfullyLoggedIn: 'Successfully logged in',
};

// Create a Redis client
export const RedisClient = createClient();

// JWT key and options
export const JWTKey = process.env.SECRET_JWT_KEY || 'qweqweqe';
export const JWTOptions: SignOptions = { expiresIn: '2h' };
