import { Router } from 'express';
import { SendMailContrller } from './controllers/SendMailController';
import { SurveysController } from './controllers/SurveysController';
import { UserControler } from './controllers/UserController';

const router = Router();
const userController = new UserControler();
const surveysController = new SurveysController();

const sendmailController = new SendMailContrller();

router.post('/users', userController.create);
router.get('/users', userController.show);

router.post('/surveys', surveysController.create);
router.get('/surveys', surveysController.show);

router.post('/sendmail', sendmailController.execute);

router.get('/ansers/:grade', (req, res) => {});

export { router };
