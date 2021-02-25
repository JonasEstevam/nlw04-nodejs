import { EntityRepository, Repository } from 'typeorm';
import { SurveyUsers } from '../models/SurveyUser';

@EntityRepository(SurveyUsers)
class SurveyUsersRepository extends Repository<SurveyUsers> {}

export { SurveyUsersRepository };
