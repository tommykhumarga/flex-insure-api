const router = require('express').Router();
const passport = require('passport');
require('./../middlewares/passport.middleware')(passport);
const passportSession = {
    session: false
};
const agentController = require('./../controllers/agent.controller');

router.post('/', passport.authenticate('jwt', passportSession), agentController.validate('create'), agentController.create);
router.put('/:agentId', passport.authenticate('jwt', passportSession), agentController.validate('update'), agentController.update);
router.get('/', passport.authenticate('jwt', passportSession), agentController.findAll);
router.get('/:agentId', passport.authenticate('jwt', passportSession), agentController.validate('findOne'), agentController.findOne);

module.exports = router;