import { Router } from "express";
import * as apiController from '../controllers/apiController';

const router = Router();

router.get('/ping', apiController.ping);

router.get('/tasks', apiController.all);
router.post('/tasks', apiController.add);
router.put('/task/:id', apiController.att);
router.delete('/task/:id', apiController.del);
router.get('/task/:query', apiController.search);


export default router;
