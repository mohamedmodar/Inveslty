import express from 'express';
import axios from 'axios';

const PREDICTOR_API_URL = process.env.PREDICTOR_API_URL || 'http://localhost:8000';

const predictController = async (req: express.Request, res: express.Response): Promise<any> => {
    try {
        // Forward the request body to the Python prediction service
        const response = await axios.post(`${PREDICTOR_API_URL}/predict`, req.body);

        // Return the response from the prediction service to the client
        return res.status(200).json(response.data);
    } catch (error) {
        console.error('Error calling prediction service:', error.message);
        
        // Handle errors from the prediction service
        if (axios.isAxiosError(error) && error.response) {
            return res.status(error.response.status).json(error.response.data);
        }

        return res.status(500).json({ message: 'An internal error occurred' });
    }
};

export default (router: express.Router) => {
    router.post('/predict', predictController);
}; 