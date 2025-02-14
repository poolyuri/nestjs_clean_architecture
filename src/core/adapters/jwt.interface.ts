export interface JwtPayload {
  publicId: string;
  name: string;
}

export interface ITokenInterface {
  createToken<T>(data: T): Promise<string>;
  checkToken(token: string): Promise<boolean>;
}
