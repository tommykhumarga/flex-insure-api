const {
    HeaderAPIKeyStrategy
} = require('passport-headerapikey');
const jwtStrategy = require('passport-jwt').Strategy;
const extractJwt = require('passport-jwt').ExtractJwt;
const appConfig = require('./../config/config');
const generalHelper = require('./../helpers/general.helper');
const {userModel: User} = require('./../models/user.model');

module.exports = (passport) => {
    passport.use(new HeaderAPIKeyStrategy({
        header: 'apikey',
        prefix: ''
    }, false, (apiKey, done) => {
        if (apiKey.trim() === appConfig.api.client.secret) return done(null, true);
        else return done(null, false);
    }));

    passport.use(new jwtStrategy({
        jwtFromRequest: extractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: appConfig.encryption.jwtKey
    }, (jwtPayload, done) => {
        User.findOne({
                _id: jwtPayload.id
            })
            .then(data => {
                if (!data) return done(null, false);

                return done(null, true);
            })
            .catch(err => {
                console.log(err);
                generalHelper.saveErrorLog(err);
                return done(null, false);
            });
    }));
}