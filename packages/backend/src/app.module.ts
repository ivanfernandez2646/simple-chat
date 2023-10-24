import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { DatabaseModule } from 'src/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { MessageModule } from './message/message.module';
import { ConversationModule } from './conversation/conversation.module';
import { AuthModule } from './auth/auth.module';
import * as Joi from '@hapi/joi';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
      renderPath: '/client',
      exclude: ['/api/(.*)'],
    }),
    ConfigModule.forRoot({
      envFilePath: !process.env.NODE_ENV
        ? '.env.dev'
        : `.env.${process.env.NODE_ENV}`,
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        POSTGRES_SSL: Joi.boolean().default(false),
        PORT: Joi.number(),
        GOOGLE_CLIENT_ID: Joi.string().required(),
        GOOGLE_CLIENT_SECRET: Joi.string().required(),
        GOOGLE_SERVER_CALLBACK_URL: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        CLIENT_URL: Joi.string().required().default('http://localhost:3006'),
        REDIS_HOST: Joi.string(),
        REDIS_PORT: Joi.number(),
      }),
    }),
    DatabaseModule,
    UserModule,
    MessageModule,
    ConversationModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
