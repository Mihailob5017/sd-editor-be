// TODO: Refactor Error object so it includes
/**
 *  @param message:string --> description of the error
 *  @param clientMessage:string --> message displayed in the browser
 * 	@param statusCode:number --> status code
 *  @param trace: string file and line location --> location of the missing param
 *  @param field: string --> If the type is missing or invalid param, showcase which
 *  @param type: string --> type of error [TYPE,INVALID PARAMS...]
 */
import { CustomErrorType } from './types';
export class CustomError extends Error {
	constructor(public data: CustomErrorType) {
		super(data.message);
		this.name = this.constructor.name;
		Object.setPrototypeOf(this, new.target.prototype);
	}
}
