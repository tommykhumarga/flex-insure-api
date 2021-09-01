import crypto from 'crypto';
import bcrypt, { hash } from 'bcrypt';
import config from './../config/config';
import { errorMessage } from './../config/enum';
import generalHelper from './general.helper';

export const encrypt = (str: string) => {
    try {
        return bcrypt.hashSync(str.trim(), 10);
    } catch (error) {
        generalHelper.saveErrorLog(error);
        throw error;
    }
};

export const compare = (str: string, hashed: string) => {
    try {
        return bcrypt.compareSync(hashed.trim(), hashed);
    } catch (error) {
        generalHelper.saveErrorLog(error);
        throw error;
    }
};

const algorithm = 'aes-256-cbc';
const iv = crypto.randomBytes(16);

export const cryptoEncrypt = (str: string) => {
    try {
        let cipher = crypto.createCipheriv(algorithm, Buffer.from(config.encryption.key), iv);
        let encrypted = cipher.update(str);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        const hex = iv.toString('hex') + ':' + encrypted.toString('hex');
        const binaryData = Buffer.from(hex, 'utf8');

        return binaryData.toString('base64');
    } catch (error) {
        generalHelper.saveErrorLog(error);
        throw error;
    }
};

export const cryptoDecrypt = (base64Str: string) => {
    try {
        const binaryData = Buffer.from(base64Str, 'base64');
        const str = binaryData.toString('utf8');
        const arrStr = str.split(':');
        const iv = Buffer.from(arrStr[0], 'hex');
        const encrypted = Buffer.from(arrStr[1], 'hex');
        const decipher = crypto.createDecipheriv(algorithm, Buffer.from(config.encryption.key), iv);
        let decrypted = decipher.update(encrypted);
        decrypted = Buffer.concat([decrypted, decipher.final()]);

        return decrypted.toString();
    } catch (error) {
        generalHelper.saveErrorLog(error);
        throw error;
    }
};
