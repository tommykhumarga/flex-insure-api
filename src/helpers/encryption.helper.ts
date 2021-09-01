import CryptoJS from 'crypto-js';
import bcrypt from 'bcrypt';
import config from './../config/config';
import generalHelper from './general.helper';

export const encrypt = (str: string): string => {
    try {
        return bcrypt.hashSync(str.trim(), 10);
    } catch (error) {
        generalHelper.saveErrorLog(error);
        throw error;
    }
};

export const compare = (str: string, hashed: string): boolean => {
    try {
        return bcrypt.compareSync(str.trim(), hashed);
    } catch (error) {
        generalHelper.saveErrorLog(error);
        throw error;
    }
};

export const cryptoEncrypt = (str: string): string => {
    try {
        return CryptoJS.AES.encrypt(str, config.encryption.key).toString();
    } catch (error) {
        generalHelper.saveErrorLog(error);
        throw error;
    }
};

export const cryptoDecrypt = (hashed: string): string => {
    try {
        const bytes = CryptoJS.AES.decrypt(hashed, config.encryption.key);
        return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
        generalHelper.saveErrorLog(error);
        throw error;
    }
};
