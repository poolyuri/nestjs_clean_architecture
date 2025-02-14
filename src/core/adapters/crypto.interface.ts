export interface ICryptoInterface {
  encrypt(password: string): string;
  verify(cipherText: string, password: string): boolean;
}