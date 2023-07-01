/* eslint-disable @typescript-eslint/no-this-alias */
import bcrypt from 'bcrypt';
import { NextFunction } from 'express';
import { Schema, model } from 'mongoose';
import config from '../../../config';
import { adminRole } from './admin.constant';
import { AdminModel, IAdmin } from './admin.interface';

const AdminSchema = new Schema<IAdmin>(
  {
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: adminRole,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    address: {
      type: String,
      required: true,
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
AdminSchema.pre('save', async function (next: NextFunction) {
  const admin = this;
  admin.password = await bcrypt.hash(
    admin.password,
    Number(config.bcrypt_salt_rounds)
  );
  next();
});

export const Admin = model<IAdmin, AdminModel>('Admin', AdminSchema);
