import { JWTKey, JWTOptions } from './contants';
import { TokenPayloadInterface } from './types';
import jwt from 'jsonwebtoken';

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
export const signJWTToken = (tokenPayload: TokenPayloadInterface): string =>
	jwt.sign(tokenPayload, JWTKey, JWTOptions);

export const checkIfTokenIsValid = (token: string): boolean => {
	const decodedToken: any = jwt.decode(token);

	const currentTime: number = Math.floor(new Date().getTime() / 1000);
	return decodedToken < currentTime;
};
