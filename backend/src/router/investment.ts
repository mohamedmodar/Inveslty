import express from 'express';
import { getInvestmentAdvice } from '../controllers/investment';
import { isAuthenticated } from '../middlewares';

// This function will be called by the main router
export default (router: express.Router) => {
  // Define the POST route for getting investment advice
  router.post('/investment-advice', isAuthenticated, getInvestmentAdvice);
}; 