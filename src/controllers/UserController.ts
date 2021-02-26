import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '../repositories/UsersRepository';
import * as yup from 'yup'
import { AppError } from '../errors/AppError';

class UserControler {
  async create(req: Request, res: Response) {
    const { email, name } = req.body;

    const schema = yup.object().shape({
      name: yup.string().required(),
      email: yup.string().email().required()
    })

    try {
      await schema.validate(req.body, { abortEarly: false })
    } catch (err) {
      throw new AppError("Validation error")
    }

    const userRepository = getCustomRepository(UsersRepository);

    const alreadyExists = await userRepository.findOne({ email });

    if (alreadyExists) {
      throw new AppError("User already exists");
    }

    const user = userRepository.create({
      name,
      email,
    });

    await userRepository.save(user);

    return res.status(201).json(user);
  }

  async show(req: Request, res: Response) {
    const userRepository = getCustomRepository(UsersRepository);

    const all = await userRepository.find();

    return res.json(all);
  }
}

export { UserControler };
