// Import required modules from mongoose
import { Schema, model } from 'mongoose';

// Import types from Express to extend Request object
import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';

// Define the structure of a User using an interface
export interface User {
  _id?: string;             // Optional property, used for MongoDB's default _id field
  email: string;
  password: string;
  name: string;
  address: string;
  isAdmin: boolean;
  avatar?: string;          // Optional property for user's avatar image
}

// Extend Express Request interface to include user information
export interface RequestWithUser extends Request<ParamsDictionary, any, any, ParsedQs> {
  user: {
    _id: string;
    email: string;
    isAdmin: boolean;
  };
}

// Create a Mongoose schema for the User entity
export const UserSchema = new Schema<User>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: { type: String, required: true },
  isAdmin: { type: Boolean, required: true },
  avatar: { type: String },  // Optional property for user's avatar image
}, {
  timestamps: true,          // Automatically adds "createdAt" and "updatedAt" fields
  toJSON: {
    virtuals: true           // Include virtual properties when converting to JSON
  },
  toObject: {
    virtuals: true           // Include virtual properties when converting to plain objects
  }
});

// Create the Mongoose model for the User entity
export const UserModel = model<User>('user', UserSchema);
