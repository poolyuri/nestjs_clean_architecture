import { Test, TestingModule } from "@nestjs/testing";
import { CryptoService } from "./crypto.service";

describe('CryptoService', () => {
  let cryptoService: CryptoService;
  const password: string = 'P455w0r_T35t';
  let passwordEncrypt: string;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CryptoService]
    }).compile();

    cryptoService = module.get<CryptoService>(CryptoService);
  });

  it('should be defined', () => {
    expect(cryptoService).toBeDefined();
  });

  it('should password encrypt correctly', async () => {
    passwordEncrypt = cryptoService.encrypt(password);

    // Verificar que el resultado no es igual al dato original
    expect(passwordEncrypt).not.toBe(password);

    // Verificar que el resultado es una cadena hexadecimal
    expect(passwordEncrypt).toMatch(/^[0-9a-fA-F]+$/);

    // Verificar que el resultado tiene una longitud válida
    expect(passwordEncrypt.length).toBeGreaterThan(0);
  });

  it('should verify password correctly', async () => {
    const isValidPass = cryptoService.verify(passwordEncrypt, password);
    
    expect(isValidPass).toBe(true);
  });
  
});