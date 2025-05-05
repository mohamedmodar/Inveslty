import express from 'express';
import authntecation from './authntecation';
import users from './users';
const router = express.Router();

export default () => {
    authntecation(router);
    users(router);
  return router;
};
