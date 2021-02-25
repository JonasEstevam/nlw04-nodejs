import { Request, response, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { SurveysRepository } from '../repositories/SurveysRepository';
import { SurveyUsersRepository } from '../repositories/SurveyUsersRepository';
import { UsersRepository } from '../repositories/UsersRepository';
import SendEmailService from '../services/SendEmailService';
import { resolve } from 'path';

class SendMailContrller {
  async execute(req: Request, res: Response) {
    const { email, survey_id } = req.body;

    const userRepository = getCustomRepository(UsersRepository);
    const surveysRepository = getCustomRepository(SurveysRepository);
    const surveysUsersRepository = getCustomRepository(SurveyUsersRepository);

    const user = await userRepository.findOne({ email });

    if (!user) {
      return res.status(400).send({ error: 'User does not exists' });
    }

    const survey = await surveysRepository.findOne({
      id: survey_id,
    });

    if (!survey) {
      return res.status(400).send({ error: 'Survey does not exists' });
    }

    const npsPath = resolve(__dirname, '..', 'views', 'emails', 'npsmail.hbs');

    const variable = {
      name: user.name,
      title: survey.title,
      description: survey.description,
      user_id: user.id,
      link: process.env.URL_MAIL,
    };

    const surveyUserAlreadyExists = await surveysUsersRepository.findOne({
      where: [{ user_id: user.id }, { value: null }],
      relations: ['user', 'survey'],
    });

    if (surveyUserAlreadyExists) {
      await SendEmailService.execute(email, survey.title, variable, npsPath);
      return res.json(surveyUserAlreadyExists);
    }

    const surveyUser = surveysUsersRepository.create({
      user_id: user.id,
      survey_id,
    });

    await surveysUsersRepository.save(surveyUser);

    await SendEmailService.execute(email, survey.title, variable, npsPath);

    return res.json(surveyUser);
  }
}

export { SendMailContrller };
