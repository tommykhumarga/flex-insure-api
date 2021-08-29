const router = require('express').Router();
const passport = require('passport');
require('./../middlewares/passport.middleware')(passport);
const passportSession = {
    session: false
};
const enumController = require('./../controllers/enum.controller');

router.get('/enum', passport.authenticate('headerapikey', passportSession), enumController);

module.exports = router;