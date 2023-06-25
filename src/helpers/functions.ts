import { JWTKey, JWTOptions } from './contants';
import { TokenPayloadInterface } from './types';
import jwt from 'jsonwebtoken';

/**
 * Finds the first missing value in the given input object.
 * @param inputObject - The input object to check for missing values
 * @returns The key of the first missing value, or null if no missing values are found
 */
export const findMissingValue = (
	inputObject: any
): string | null | undefined => {
	if (inputObject) {
		return;
	} else {
		for (let key in inputObject) {
			if (inputObject[key] === undefined) return key;
		}
	}

	return null;
};

/**
 * Signs a JSON Web Token (JWT) with the given payload.
 * @param tokenPayload - The payload to sign the JWT with
 * @returns The signed JWT
 */
export const signJWTToken = (tokenPayload: TokenPayloadInterface): string =>
	jwt.sign(tokenPayload, JWTKey, JWTOptions);

/**
 * Checks if a JSON Web Token (JWT) is expired.
 * @param token - The JWT to check
 * @returns True if the token is expired, false otherwise
 */
export const checkIfTokenIsValid = (token: string): boolean => {
	const decodedToken: any = jwt.decode(token);

	const currentTime: number = Math.floor(new Date().getTime() / 1000);
	return decodedToken < currentTime;
};
