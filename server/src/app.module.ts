import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import MyZodValidationPipe from './shared/pipes/custom-zod-validation.pipe';
import { ZodSerializerInterceptor } from 'nestjs-zod';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';
import { AuthModule } from './routes/auth/auth.module';
import { SharedModule } from './shared/shared.module';
import { LanguageModule } from './routes/language/language.module';
import { PermissionModule } from './routes/permission/permission.module';
import { RoleModule } from './routes/role/role.module';
import { ProfileModule } from './routes/profile/profile.module';
import { UserModule } from './routes/user/user.module';
import { MediaModule } from './routes/media/media.module';
import { TrainerModule } from './routes/trainer/trainer.module';
import { TrainerTranslationModule } from './routes/trainer/trainer-translation/trainer-translation.module';
// import { TrainerClientModule } from './routes/trainer-client/trainer-client.module';
import path from 'path';

import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import { TrainerClientModule } from './routes/trainer-client/trainer-client.module';
import { TrainerReviewModule } from './routes/trainer-review/trainer-review.module';

@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.resolve('src/i18n'),
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] }, 
        AcceptLanguageResolver,
      ],
      typesOutputPath: path.resolve('src/generated/i18n.ts')
    }),
    AuthModule,
    SharedModule,
    LanguageModule,
    PermissionModule,
    RoleModule,
    ProfileModule,
    UserModule,
    MediaModule,
    TrainerModule,
    TrainerTranslationModule,
    TrainerClientModule,
    TrainerReviewModule
  ],
  controllers: [AppController],
  providers: [AppService , 
    {
      provide: APP_PIPE,
      useClass: MyZodValidationPipe,
    },
    { 
      provide: APP_INTERCEPTOR, 
      useClass: ZodSerializerInterceptor 
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    }
  ],
})
export class AppModule {}
