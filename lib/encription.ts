import CryptoJS from "crypto-js";
import { env } from "./env-manager";

const ENCRYPTION_SECRET: string = env.NEXT_PUBLIC_ENCRYPTION_SECRET || "";

// Encrypt a string using AES
export const encryptValue = (value: string): string => {
  return CryptoJS.AES.encrypt(value, ENCRYPTION_SECRET).toString();
};

// Decrypt an encrypted string using AES
export const decryptValue = (encryptedValue: string): string => {
  const bytes = CryptoJS.AES.decrypt(encryptedValue, ENCRYPTION_SECRET);
  return bytes.toString(CryptoJS.enc.Utf8);
};

// Encrypt selected fields of an object
export const encryptSensitiveFields = <T extends Record<string, any>>(
  data: T,
  fieldsToEncrypt: (keyof T)[]
): T => {
  const encryptedData = { ...data };

  fieldsToEncrypt.forEach((field) => {
    if (encryptedData[field]) {
      encryptedData[field] = encryptValue(String(encryptedData[field])) as any;
    }
  });

  return encryptedData;
};

// Decrypt selected fields of an object
export const decryptSensitiveFields = <T extends Record<string, any>>(
  data: T,
  fieldsToDecrypt: (keyof T)[]
): T => {
  const decryptedData = { ...data };

  fieldsToDecrypt.forEach((field) => {
    if (decryptedData[field]) {
      decryptedData[field] = decryptValue(String(decryptedData[field])) as any;
    }
  });

  return decryptedData;
};
