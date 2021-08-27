const router = require('express').Router();
const passport = require('passport');
require('../middlewares/passport.middleware')(passport);
const passportSession = {
    session: false
};
const insuredController = require('../controllers/insured.controller');

router.post('/', passport.authenticate('jwt', passportSession), insuredController.validate('create'), insuredController.create);
router.put('/:insuredId', passport.authenticate('jwt', passportSession), insuredController.validate('update'), insuredController.update);
router.get('/', passport.authenticate('jwt', passportSession), insuredController.findAll);
router.get('/:insuredId', passport.authenticate('jwt', passportSession), insuredController.validate('findOne'), insuredController.findOne);

module.exports = router;