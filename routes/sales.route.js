const router = require('express').Router();
const passport = require('passport');
require('../middlewares/passport.middleware')(passport);
const passportSession = {
    session: false
};
const salesController = require('../controllers/sales.controller');

router.post('/test', passport.authenticate('jwt', passportSession), salesController.test);

module.exports = router;