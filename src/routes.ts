import { Router } from 'express';
import { SurveysController } from './controllers/SurveysController';
import { UserControler } from './controllers/UserController';

const router = Router();
const userController = new UserControler();
const surveysController = new SurveysController();

router.post('/users', userController.create);
router.get('/users', userController.show);

router.post('/surveys', surveysController.create);
router.get('/surveys', surveysController.show);

export { router };
