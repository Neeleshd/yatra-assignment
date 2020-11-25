import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/schema/users.schema';

@Module({
  imports: [MongooseModule.forFeature([{name: 'users', schema: UserSchema}])],
  exports: [MongooseModule.forFeature([{name: 'users', schema: UserSchema}])],

})
export class UsersModule {}
