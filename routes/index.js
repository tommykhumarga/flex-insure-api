const router = require('express').Router();
const config = require('./../config/config');
const userRoute = require('./user.route');
const insuranceRoute = require('./insurance.route');

router.get('/', (req, res) => res.status(200).send(`${config.app.name} v${config.app.version}`));
router.use('/user', userRoute);
router.use('/insurance', insuranceRoute);

module.exports = router;