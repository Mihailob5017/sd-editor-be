import { Request, Response } from 'express';

export interface SignupParamSchema {
	data: {
		password?: string | undefined;
		username: string;
		email: string;
	} | null;
}

export interface ValidSignupParamSchema extends SignupParamSchema {
	error: {
		field: string;
		message: string;
	} | null;
	isSuccess: boolean;
}

export interface CustomErrorType {
	field: string;
	message: string;
}

export interface SignupResponseInterface {
	isSuccessful: boolean;
	clientMessage: string;
	json_token?: string;
	error: null | CustomErrorType;
	data: {
		key_id: string;
		username: string;
		password: string;
		rank: number | bigint;
		solved_issues_count: number | bigint;
		email: string;
		created_at: Date;
	} | null;
}

export interface TokenPayloadInterface {
	key_id: string;
	username: string;
}

export type ControllerType = (_req: Request, _res: Response) => Promise<void>;

export interface UserCredentialsInterface {
	username: string;
	password: string;
	email?: string;
}
