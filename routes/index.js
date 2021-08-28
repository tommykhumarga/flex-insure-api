const router = require('express').Router();

router.get('/', (req, res) => res.status(200).send(`${appConfig.app.name} v${appConfig.app.version}`));
router.use('/common', require('./common.route'));
router.use('/user', require('./user.route'));
router.use('/insurance', require('./insurance.route'));
router.use('/car', require('./car.route'));
router.use('/motorcycle', require('./motorcycle.route'));
router.use('/agent', require('./agent.route'));
router.use('/insured', require('./insured.route'));
router.use('/product', require('./product.route'));

module.exports = router;