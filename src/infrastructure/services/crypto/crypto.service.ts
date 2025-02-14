import { Injectable } from "@nestjs/common";
import * as crypto from 'crypto';
import { ICryptoInterface } from "@core";

@Injectable()
export class CryptoService implements ICryptoInterface {
  private readonly encoding: BufferEncoding = 'hex';
  private readonly cryptoKey: string = process.env.CRYPTO_KEY || '';

  encrypt(password: string): string {
    const iv = crypto.randomBytes(16);
    const key = crypto.scryptSync(this.cryptoKey, 'salt', 32);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  
    const encrypted = Buffer.concat([
      cipher.update(password, 'utf-8'),
      cipher.final(),
    ]);
  
    return `${iv.toString(this.encoding)}${encrypted.toString(this.encoding)}`;
  }

  verify(cipherText: string, password: string): boolean {
    const { encryptedDataString, ivString } = this.splitEncryptedText(cipherText);
    
    const iv = Buffer.from(ivString, this.encoding);
    const encryptedText = Buffer.from(encryptedDataString, this.encoding);
    const key = crypto.scryptSync(this.cryptoKey, 'salt', 32);
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    const decrypted = decipher.update(encryptedText);

    return Buffer.concat([decrypted, decipher.final()]).toString() === password;
  }

  private splitEncryptedText = (encryptedText: string) => {
    return {
      ivString: encryptedText.slice(0, 32),
      encryptedDataString: encryptedText.slice(32),
    };
  }
}
