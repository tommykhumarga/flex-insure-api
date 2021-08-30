import express from 'express';
const router = express.Router();
import controller from '../controllers/user.controller';

router.get('/', controller.getAllUsers);
router.post('/', controller.createUser);

export = router;
