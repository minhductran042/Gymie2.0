import { Injectable } from '@nestjs/common';
import { TrainerRepository } from './trainer.repo';
import { CreateTrainerBodyType, GetTrainerQueryType } from './trainer.model';
import { I18nContext } from 'nestjs-i18n';
import { ALL_LANGUAGE_CODE } from 'src/shared/constants/other.const';

@Injectable()
export class TrainerService {
    constructor(private readonly trainerRepo: TrainerRepository) {}

    async list(props: GetTrainerQueryType) {
        const data = await this.trainerRepo.list({
            page: props.page,
            limit: props.limit,
            languageId: I18nContext.current()?.lang as string,
            isAvailable: props.isAvailable,
            minHourlyRate: props.minHourlyRate,
            maxHourlyRate: props.maxHourlyRate,
            minExperienceYears: props.minExperienceYears,
            maxExperienceYears: props.maxExperienceYears
        });
        return data;
    }

    async getDetail(props: { trainerId: number }) {
        const languageId = I18nContext.current()?.lang as string;
        
        const data = await this.trainerRepo.getDetail(
            props.trainerId,
            languageId
        );
        return data;
    }
}
