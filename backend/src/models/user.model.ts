import {Schema, model} from 'mongoose';
import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';

export interface User {
    _id?: string;
  email: string;
  password: string;
  name: string;
  address: string;
  isAdmin: boolean;
}

export interface RequestWithUser extends Request<ParamsDictionary, any, any, ParsedQs> {
    user: {
      _id: string;
      email: string;
      isAdmin: boolean;
    };
  }
  
//create schema
export const UserSchema = new Schema<User>({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    address: {type: String, required: true},
    isAdmin: {type: Boolean, required: true},
}, {
    timestamps: true,
    toJSON:{
        virtuals: true
    },
    toObject:{
        virtuals: true
    }
});


//create model in database
export const UserModel = model<User>('user', UserSchema);