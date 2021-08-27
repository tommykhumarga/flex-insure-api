const router = require('express').Router();
const config = require('./../config/config');
const userRoute = require('./user.route');
const insuranceRoute = require('./insurance.route');
const carRoute = require('./car.route');
const motorcycleRoute = require('./motorcycle.route');
const agentRoute = require('./agent.route');

router.get('/', (req, res) => res.status(200).send(`${config.app.name} v${config.app.version}`));
router.use('/user', userRoute);
router.use('/insurance', insuranceRoute);
router.use('/car', carRoute);
router.use('/motorcycle', motorcycleRoute);
router.use('/agent', agentRoute);

module.exports = router;