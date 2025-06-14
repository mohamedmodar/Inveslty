import express from 'express';
import authntecation from './authntecation';
import users from './users';
import chatbot from './chatbot';

const router = express.Router();

export default () => {
    authntecation(router);
    users(router);
    chatbot(router);
  return router;
};
