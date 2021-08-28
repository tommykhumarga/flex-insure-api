const router = require('express').Router();
const userRoute = require('./user.route');
const insuranceRoute = require('./insurance.route');
const carRoute = require('./car.route');
const motorcycleRoute = require('./motorcycle.route');
const agentRoute = require('./agent.route');
const insuredRoute = require('./insured.route');

router.get('/', (req, res) => res.status(200).send(`${appConfig.app.name} v${appConfig.app.version}`));
router.use('/user', userRoute);
router.use('/insurance', insuranceRoute);
router.use('/car', carRoute);
router.use('/motorcycle', motorcycleRoute);
router.use('/agent', agentRoute);
router.use('/insured', insuredRoute);

module.exports = router;