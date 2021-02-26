import { Request, response, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { SurveysRepository } from '../repositories/SurveysRepository';
import { SurveyUsersRepository } from '../repositories/SurveyUsersRepository';
import { UsersRepository } from '../repositories/UsersRepository';
import SendEmailService from '../services/SendEmailService';
import { resolve } from 'path';
import { AppError } from '../errors/AppError';

class SendMailContrller {
  async execute(req: Request, res: Response) {
    const { email, survey_id } = req.body;

    const userRepository = getCustomRepository(UsersRepository);
    const surveysRepository = getCustomRepository(SurveysRepository);
    const surveysUsersRepository = getCustomRepository(SurveyUsersRepository);

    const user = await userRepository.findOne({ email });

    if (!user) {
      throw new AppError('User does not exists')
    }

    const survey = await surveysRepository.findOne({
      id: survey_id,
    });

    if (!survey) {
      throw new AppError('Survey does not exists')
    }

    const npsPath = resolve(__dirname, '..', 'views', 'emails', 'npsmail.hbs');



    const surveyUserAlreadyExists = await surveysUsersRepository.findOne({
      where: { user_id: user.id, value: null },
      relations: ['user', 'survey'],
    });

    const variable = {
      name: user.name,
      title: survey.title,
      description: survey.description,
      id: "",
      link: process.env.URL_MAIL,
    };

    if (surveyUserAlreadyExists) {
      variable.id = surveyUserAlreadyExists.id;
      await SendEmailService.execute(email, survey.title, variable, npsPath);
      return res.json(surveyUserAlreadyExists);
    }

    const surveyUser = surveysUsersRepository.create({
      user_id: user.id,
      survey_id,
    });

    variable.id = surveyUser.id;

    await surveysUsersRepository.save(surveyUser);

    await SendEmailService.execute(email, survey.title, variable, npsPath);

    return res.json(surveyUser);
  }
}

export { SendMailContrller };
