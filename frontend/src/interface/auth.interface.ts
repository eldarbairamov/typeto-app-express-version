export interface IAccessTokenPair {
    accessToken: string;
    refreshToken: string;
}

export interface IUserInfo extends IAccessTokenPair {
    userId: number;
}