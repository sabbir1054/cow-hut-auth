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

// is exist and password match
AdminSchema.static.isAdminExist = async function (
  phoneNumber: string
): Promise<Pick<IAdmin, '_id' | 'password' | 'role'> | null> {
  return Admin.findOne({ phoneNumber }, { _id: 1, role: 1, password: 1 });
};
// password match
AdminSchema.statics.isPasswordMatched = async function (
  givenPassword: string,
  savedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(givenPassword, savedPassword);
};

export const Admin = model<IAdmin, AdminModel>('Admin', AdminSchema);
