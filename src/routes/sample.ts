import express from 'express';
const router = express.Router();
import controller from './../controllers/sample';

router.get('/ping', controller.sampleHealthCheck);

export = router;
