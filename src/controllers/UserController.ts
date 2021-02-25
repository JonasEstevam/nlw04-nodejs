import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '../repositories/UsersRepository';

class UserControler {
  async create(req: Request, res: Response) {
    const { email, name } = req.body;

    const userRepository = getCustomRepository(UsersRepository);

    const alreadyExists = await userRepository.findOne({ email });

    if (alreadyExists) {
      return res.status(400).json({
        error: 'User already exists',
      });
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
