const router = require('express').Router();
const passport = require('passport');
require('../middlewares/passport.middleware')(passport);
const passportSession = {
    session: false
};
const productController = require('../controllers/product.controller');

router.post('/', passport.authenticate('jwt', passportSession), productController.validate('create'), productController.create);
router.put('/:productId', passport.authenticate('jwt', passportSession), productController.validate('update'), productController.update);
router.get('/', passport.authenticate('jwt', passportSession), productController.findAll);
router.get('/:productId', passport.authenticate('jwt', passportSession), productController.validate('findOne'), productController.findOne);

module.exports = router;