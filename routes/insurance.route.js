const router = require('express').Router();
const passport = require('passport');
require('./../middlewares/passport.middleware')(passport);
const passportSession = {
    session: false
};
const insuranceController = require('./../controllers/insurance.controller');

router.post('/', passport.authenticate('jwt', passportSession), insuranceController.validate('create'), insuranceController.create);
router.put('/:insuranceId', passport.authenticate('jwt', passportSession), insuranceController.validate('update'), insuranceController.update);
router.get('/', passport.authenticate('jwt', passportSession), insuranceController.findAll);
router.get('/:insuranceId', passport.authenticate('jwt', passportSession), insuranceController.validate('findById'), insuranceController.findById);

module.exports = router;