import { CustomErrorType } from './types';

export class CustomError extends Error {
	constructor(public data: CustomErrorType) {
		super(data.message);
		this.name = this.constructor.name;
		Object.setPrototypeOf(this, new.target.prototype);
	}
}
