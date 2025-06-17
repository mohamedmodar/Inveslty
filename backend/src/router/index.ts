import express from 'express';
import authntecation from './authntecation';
import users from './users';
import chatbot from './chatbot';
import prediction from './prediction';
import investment from './investment';

const router = express.Router();

export default () => {
    authntecation(router);
    users(router);
    chatbot(router);
    prediction(router);
    investment(router);
  return router;
};
