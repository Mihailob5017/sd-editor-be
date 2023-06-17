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
