export interface JWTConfig {
  getJwtSecret(): string;
  getJwtExpirationTime(): string;
}
