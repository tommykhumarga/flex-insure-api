import passport from 'passport';
import passportJwt from 'passport-jwt';
import config from './../../config/config';
import { User } from './../../models/user.model';

const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

passport.use(
    new JwtStrategy({ jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), secretOrKey: config.jwt.key }, (jwtPayload, done) => {
        User.findOne({ _id: jwtPayload.id })
            .then((data) => {
                return done(null, data, jwtPayload);
            })
            .catch(() => {
                return done(null, false);
            });
    })
);
