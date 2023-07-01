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

export const User = model<IUser, UserModel>('User', UserSchema);
