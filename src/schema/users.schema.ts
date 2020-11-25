import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { GENDER, STATUS } from "../constant";
import { Product } from "./product.schema";

export type UserDocument = User & mongoose.Document;

@Schema()
export class User {
  @Prop({
    required: true,
    trim: true
  })
  firstName: string;

  @Prop({
    required: true,
    trim: true
  })
  lastName: string;

  @Prop({
    required: true,
    unique: true
  })
  email: string;

  @Prop({
    required: true,
  })
  password: string;

  @Prop({
    required: true,
  })
  gender: number;

  @Prop()
  dob: string;

  @Prop({
    default: STATUS.ACTIVE
  })
  status: number;

  @Prop()
  otp: number;

  @Prop({
    default: []
  })
  images: any[]

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  products: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Product
    },
    quantity: number,
    sellingPrice: number
  }]
}

export const UserSchema = SchemaFactory.createForClass(User);