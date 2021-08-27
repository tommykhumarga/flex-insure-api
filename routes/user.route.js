const router = require('express').Router();
const passport = require('passport');
require('./../middlewares/passport.middleware')(passport);
const passportSession = {
    session: false
};
const userController = require('./../controllers/user.controller');

router.get('/', passport.authenticate('jwt', passportSession), userController.findAll);
router.get('/:userId', passport.authenticate('jwt', passportSession), userController.validate('findOne'), userController.findOne);
router.post('/', passport.authenticate('jwt', passportSession), userController.create);
router.put('/:userId', passport.authenticate('jwt', passportSession), userController.validate('update'), userController.update);
router.post('/login', passport.authenticate('headerapikey', passportSession), userController.validate('login'), userController.login);
router.post('/register', passport.authenticate('headerapikey', passportSession), userController.validate('register'), userController.register);
router.post('/activation', passport.authenticate('headerapikey', passportSession), userController.validate('activation'), userController.activation);
router.patch('/:userId', passport.authenticate('headerapikey', passportSession), userController.validate('changePassword'), userController.changePassword);
router.post('/forgot-password', passport.authenticate('headerapikey', passportSession), userController.validate('forgotPassword'), userController.forgotPassword);
router.post('/forgot-password/validate', passport.authenticate('headerapikey', passportSession), userController.validate('validateForgotPasswordToken'), userController.validateForgotPasswordToken);
router.patch('/reset-password', passport.authenticate('headerapikey', passportSession), userController.validate('resetPassword'), userController.resetPassword);

router.post('/test-email', userController.testEmail);

module.exports = router;