import Joi from 'joi';

export const registerUserSchema = Joi.object({
	FullName: Joi.string().required(),
	Email: Joi.string().email().required(),
	// PasswordHash: Joi.string().required().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$')),
	Password: Joi.string().required(),
	ProfilePicture: Joi.string(),
	Phone: Joi.number().required(),
	Role: Joi.string().required(),
});
