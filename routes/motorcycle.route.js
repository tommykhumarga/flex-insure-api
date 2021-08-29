const router = require('express').Router();
const passport = require('passport');
require('../middlewares/passport.middleware')(passport);
const passportSession = {
    session: false
};
const motorcycleController = require('../controllers/motorcycle.controller');

router.post('/', passport.authenticate('jwt', passportSession), motorcycleController.validate('create'), motorcycleController.create);
router.put('/:motorcycleId', passport.authenticate('jwt', passportSession), motorcycleController.validate('update'), motorcycleController.update);
router.get('/', passport.authenticate('jwt', passportSession), motorcycleController.findAll);
router.get('/:motorcycleId', passport.authenticate('jwt', passportSession), motorcycleController.validate('findById'), motorcycleController.findById);

module.exports = router;