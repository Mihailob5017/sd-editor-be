import * as Yup from 'yup';
import YupPassword from 'yup-password';
import { SignupValidationMessages as YupMessages } from '../helpers/contants';

YupPassword(Yup);
export const SignupYupSchema = Yup.object().shape({
	data: Yup.object().shape({
		username: Yup.string()
			.required(YupMessages.required)
			.min(6, YupMessages.min)
			.max(24, YupMessages.max),
		password: Yup.string()
			.required(YupMessages.required)
			.min(6, YupMessages.min)
			.minNumbers(1, YupMessages.min_numbers)
			.minUppercase(1, YupMessages.min_uppercase),
		email: Yup.string()
			.required(YupMessages.required)
			.min(7, YupMessages.min)
			.email(YupMessages.notEmail),
	}),
});
