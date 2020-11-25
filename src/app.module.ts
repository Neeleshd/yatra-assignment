import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost/yatra', {
    useCreateIndex: true,
    autoIndex: true
  }), UsersModule,
  MailerModule.forRoot({
    transport: {
      service: process.env.MAILDEV_INCOMING_SERVICE,
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAILDEV_INCOMING_USER,
        pass: process.env.MAILDEV_INCOMING_PASS,
      },
    },
    defaults: {
      from: '"No Reply" <no-reply@localhost>',
    },
})],
  controllers: [AppController, UsersController],
  providers: [AppService, UsersService],
})
export class AppModule {}
