const router = require('express').Router();
const passport = require('passport');
require('./../middlewares/passport.middleware')(passport);
const passportSession = {
    session: false
};
const insuranceController = require('./../controllers/insurance.controller');

router.post('/', passport.authenticate('headerapikey', passportSession), insuranceController.validate('create'), insuranceController.create);
router.put('/:insuranceId', passport.authenticate('headerapikey', passportSession), insuranceController.validate('update'), insuranceController.update);
router.get('/', passport.authenticate('headerapikey', passportSession), insuranceController.findAll);
router.get('/:insuranceId', passport.authenticate('headerapikey', passportSession), insuranceController.validate('findOne'), insuranceController.findOne);

module.exports = router;