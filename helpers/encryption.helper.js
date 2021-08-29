const bcrypt = require('bcrypt');
const crypto = require('crypto');
const config = require('./../config/config');
const generalHelper = require('./../helpers/general.helper');

exports.encrypt = (password) => {
    try {
        return bcrypt.hashSync(password.trim(), 10);
    } catch (err) {
        generalHelper.saveErrorLog(err);
        throw new Error(err.message);
    }
};

exports.compare = (password, hashedPassword) => {
    try {
        return bcrypt.compareSync(password.trim(), hashedPassword);
    } catch (err) {
        generalHelper.saveErrorLog(err);
        throw new Error(err.message);
    }
};

const algorithm = 'aes-256-cbc';
const iv = crypto.randomBytes(16);

exports.cryptoEncrypt = (text) => {
    try {
        let cipher = crypto.createCipheriv(algorithm, Buffer.from(appConfig.encryption.key), iv);
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        encrypted = iv.toString('hex') + ':' + encrypted.toString('hex');
        let binaryData = Buffer.from(encrypted, 'utf8');
        return binaryData.toString('base64');
    } catch (err) {
        generalHelper.saveErrorLog(err);
        throw new Error(err.message);
    }
};

exports.cryptoDecrypt = (base64Str) => {
    try {
        let binaryData = Buffer.from(base64Str, 'base64');
        let str = binaryData.toString('utf8');
        let arrStr = str.split(':');
        let iv = Buffer.from(arrStr[0], 'hex');
        let encrypted = Buffer.from(arrStr[1], 'hex');
        let decipher = crypto.createDecipheriv(algorithm, Buffer.from(appConfig.encryption.key), iv);
        let decrypted = decipher.update(encrypted);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
    } catch (err) {
        generalHelper.saveErrorLog(err);
        throw new Error(err.message);
    }
}