export type LoginFormData = {
	email: string;
	password: string;
};

export type RegisterFormData = {
	email: string;
	password: string;
	first_name: string;
	last_name: string;
	phone_number: string;
};

export type AuthFormData = LoginFormData | RegisterFormData;
