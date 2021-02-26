import { Request, response, Response } from "express";
import { getCustomRepository, Not, IsNull } from "typeorm";
import { SurveyUsersRepository } from "../repositories/SurveyUsersRepository";

class NPSController {
    async execute(req: Request, res: Response) {
        const { survey_id } = req.params

        const surveysUsersRepository = getCustomRepository(SurveyUsersRepository);
        const surveysUsers = await surveysUsersRepository.find({
            survey_id,
            value: Not(IsNull())
        });

        const detractor = surveysUsers.filter((survey) => survey.value >= 0 && survey.value <= 6).length
        const promoters = surveysUsers.filter((survey) => survey.value >= 9 && survey.value <= 10).length
        const passive = surveysUsers.filter((survey) => survey.value >= 7 && survey.value <= 8).length

        const totalAwnsers = surveysUsers.length

        const calculate = Number((((promoters - detractor) / totalAwnsers) * 100).toFixed(2))

        return res.json({
            detractor,
            promoters,
            passive,
            totalAwnsers,
            nps: calculate
        })
    }
}
export { NPSController }