import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, startSession } from 'mongoose';
import { STATUS } from 'src/constant';
import { User, UserDocument } from 'src/schema/users.schema';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { UploadService } from 'src/services/upload.service';
import { Product, ProductDocument } from 'src/schema/product.schema';

console.log(process.env.JWT_SECRET)
@Injectable()
export class UsersService {
  constructor(@InjectModel('users') private userModel: Model<UserDocument>, @InjectModel('products') private productModel: Model<ProductDocument>, private readonly mailerService: MailerService, private readonly uploadService: UploadService) {}
  
  /**
   * Function to create JWT auth token
   * @param user
   */
  public generateJWT(user) {
    let today = new Date();
    let exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return (
      'Bearer ' +
      jwt.sign(
        {
          id: user._id,
          email: user.email,
          exp: exp.getTime() / 1000,
        },
        process.env.JWT_SECRET,
      )
    );
  }

  async findAll(type: number) {
    const searchParams = {
      status: undefined
    };
    if (type == STATUS.ACTIVE || type == STATUS.INACTIVE) {
      searchParams.status = type;
    } else {
      delete searchParams.status;
    }
    return await this.userModel.find(searchParams, {_id: 1, firstName: 1, lastName: 1, gender: 1, email: 1});
  }

  async findOne(id: string) {
    const user = await this.userModel.findOne({
      _id: id
    }, {_id: 1, firstName: 1, lastName: 1, gender: 1, email: 1, status: 1});
    if (user) {
      return user;
    } else {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }

  async create(params: any) {
    try {
      params.password = bcrypt.hashSync(params.password, bcrypt.genSaltSync(10));
      const user = this.userModel.create(params);
      return (await user).save();
    } catch(error) {
      throw error;
    }
  }

  async update(body: any, id: string) {
    try {
      if (body.password) {
        body.password = bcrypt.hashSync(body.password, bcrypt.genSaltSync(10));
      }
      return this.userModel.updateOne({
        _id: id
      }, body, {
        new: true
      });
    } catch (error) {
      throw error;
    }
  }

  async delete(id: string) {
    return await this.update({status: STATUS.DELETE}, id);
  }

  async login(params: any) {
    try {
      const {email, password} = params;
      const user = await this.userModel.findOne({
        email
      });
      if (user) {
        if (bcrypt.compareSync(password, user.password)) {
          const otp = Math.floor(1000 + Math.random() * 9000);
          await this.userModel.updateOne({
            _id: user._id
          }, {
            otp
          });
          // send otp in mail to user
          this.mailerService.sendMail({
            to: 'email',
            from: 'assignment@yatra.com',
            subject: 'OTP for login',
            text: `${otp}`,
            html: `<p>${otp}</p>`
          });

          return user;
        } else {
          throw new HttpException('Password is incorrect', HttpStatus.FORBIDDEN);
        }
      } else {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      throw error;
    }
    
  }

  async verifyOtp(params: any) {
    const {email, otp} = params;
    const user = await this.userModel.findOne({
      email
    });

    if (user?.otp && user?.otp === otp) {
      return {
        user,
        token: this.generateJWT(user)
      }
    } else {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }

  async uploadFiles(id: string, files: any[] = []) {
    let uploadImageString;
    if (files.length) {
      uploadImageString = await this.uploadService.multipleFileUpload(files);
    }

    await this.userModel.updateOne({
      _id: id
    }, {
      images: uploadImageString
    }, {
      new: true
    });
  }

  async orderProduct(userId: string, params: any) {
    const session = await startSession();
    session.startTransaction();
    try {
      const { quantity } = params;
      const product = await this.productModel.findOne({
        _id: params.productId
      });
      if (product.quantity - quantity < 0) {
        throw new HttpException('Product not in stock', HttpStatus.OK);
      }
      const userProduct = {
        productId: product._id,
        quantity: params.quantity,
        sellingPrice: product.sellingPrice
      }
      await this.userModel.updateOne({
        _id: userId
      }, {
        $addToSet: {
          products: userProduct
        }
      }, {
        new: true
      });
      this.productModel.update({
        _id: params.productId
      }, {
        $set: {
          quantity: product.quantity - quantity
        }
      });
      session.commitTransaction();
      return 'Product ordered successfully';      
    } catch (error) {
      session.abortTransaction();
      session.endSession();
      throw new HttpException(error, HttpStatus.FORBIDDEN);
    }
  }

  async getOrders(userId: string) {
    const user = await this.userModel.findOne({_id: userId});
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (!user.products.length) {
      throw new HttpException('No orders yet', HttpStatus.OK);
    }
    return user.products;
  }
}