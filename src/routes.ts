import { Router } from 'express';
import { AnswerController } from './controllers/AnswerController';
import { NPSController } from './controllers/NPSController';
import { SendMailContrller } from './controllers/SendMailController';
import { SurveysController } from './controllers/SurveysController';
import { UserControler } from './controllers/UserController';

const router = Router();
const userController = new UserControler();
const surveysController = new SurveysController();

const sendmailController = new SendMailContrller();

const answerController = new AnswerController();

const npsController = new NPSController()

router.post('/users', userController.create);
router.get('/users', userController.show);

router.post('/surveys', surveysController.create);
router.get('/surveys', surveysController.show);

router.post('/sendmail', sendmailController.execute);

router.get('/answers/:value', answerController.execute);

router.get('/nps/:survey_id', npsController.execute)

export { router };
