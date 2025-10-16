import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Trainer } from '@prisma/client';

/**
 * Custom decorator để lấy Trainer instance từ request
 * Cần dùng cùng với TrainerExistGuard
 */
export const CurrentTrainer = createParamDecorator(
  (data: keyof Trainer | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const trainer = request.trainer;

    return data ? trainer?.[data] : trainer;
  },
);
