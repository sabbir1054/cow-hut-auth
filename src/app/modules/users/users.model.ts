/* eslint-disable @typescript-eslint/no-this-alias */
import bcrypt from 'bcrypt';
import { NextFunction } from 'express';
import { Schema, model } from 'mongoose';
import config from '../../../config';
import { role } from './users.constant';
import { IUser, UserModel } from './users.interface';

export const UserSchema = new Schema<IUser, UserModel>(
  {
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: role,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    name: {
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: false,
      },
    },
    address: {
      type: String,
      required: false,
    },
    budget: {
      type: Number,
      required: false,
      default: 0,
    },
    income: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.password; // Exclude password field from the response
      },
    },
  }
);

// password hashing and save
UserSchema.pre('save', async function (next: NextFunction) {
  const user = this;
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds)
  );
  next();
});

// is exist and password match
UserSchema.statics.isUserExist = async function (
  phoneNumber: string
): Promise<Pick<IUser, '_id' | 'password' | 'role'> | null> {
  return User.findOne({ phoneNumber }, { _id: 1, role: 1, password: 1 });
};
// password match
UserSchema.statics.isPasswordMatched = async function (
  givenPassword: string,
  savedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(givenPassword, savedPassword);
};

export const User = model<IUser, UserModel>('User', UserSchema);
