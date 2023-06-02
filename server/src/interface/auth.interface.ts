export interface IRegistration {
   readonly username: string;
   readonly email: string;
   readonly password: string;
}

export interface ILogin {
   readonly email: string;
   readonly password: string;
}

export interface IAccessTokenPair {
   readonly accessToken: string,
   readonly refreshToken: string
}

export interface IResetPassword {
   readonly resetPasswordToken: string;
   readonly password: string;
}

export interface IOAuthResponse {
   readonly accessToken: string;
   readonly refreshToken: string;
}