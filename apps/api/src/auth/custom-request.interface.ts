import { Request } from 'express';

export interface CustomRequest extends Request {
  user?: {
    sub: number;
    email?: string;
    [key: string]: any; 
  };
}