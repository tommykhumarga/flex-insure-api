const router = require('express').Router();
const passport = require('passport');
require('./../middlewares/passport.middleware')(passport);
const passportSession = {
    session: false
};
const carController = require('./../controllers/car.controller');

router.post('/', passport.authenticate('jwt', passportSession), carController.validate('create'), carController.create);
router.put('/:carId', passport.authenticate('jwt', passportSession), carController.validate('update'), carController.update);
router.get('/', passport.authenticate('jwt', passportSession), carController.findAll);
router.get('/:carId', passport.authenticate('jwt', passportSession), carController.validate('findById'), carController.findById);

module.exports = router;