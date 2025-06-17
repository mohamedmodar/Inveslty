# Inveslty: Asset Price Prediction Platform for Alexandria

## Overview

Inveslty is a data-driven platform designed to predict asset prices, including gold, currency, and real estate, in Alexandria. Leveraging advanced machine learning and data science techniques, Inveslty empowers users with actionable insights to make informed decisions. This platform aims to enhance transparency, efficiency, and confidence in asset valuation within the Alexandria community.

## Objectives of the Project

The primary objective of this project is to create a robust, data-driven system that predicts asset prices, including gold, currency, and real estate, in Alexandria. This system will leverage advanced machine learning and data science techniques to empower users with actionable insights. To achieve this, the following objectives are outlined:

**Data Collection and Analysis**

* Gather and preprocess real-world market data from reliable sources, including financial platforms, real estate agencies, and public economic reports.
* Identify and analyze key factors influencing asset prices, such as location, size, market trends, economic conditions, and historical price patterns.

**Model Development**

* Develop and train machine learning models capable of predicting asset prices (e.g., house prices or gold values) with high accuracy.
* Continuously evaluate and fine-tune model performance using metrics such as Mean Absolute Error (MAE), Root Mean Squared Error (RMSE), and others.

**Authentication and User Experience**

* Implement secure sign-up and login functionality to protect user data and enhance personalization.
* Create a seamless, user-friendly interface that allows users to input relevant details (e.g., property or asset attributes) and obtain accurate predictions.

**Software and Website Development**

* Build an intuitive web-based platform for users to access predictions and insights.

**Market Insights and Visualization**

* Provide users with additional insights, such as market trends, price distribution, and neighborhood or regional comparisons.
* Implement dynamic and interactive data visualizations (e.g., charts and graphs) for clearer decision-making.

**Community Impact**

* Design a tool that caters to multiple stakeholders, including sellers, investors, and general users, by offering accurate and transparent market data.
* Empower users to make well-informed decisions, reducing reliance on subjective opinions or manual analysis.

**Scalability and Future Growth**

* Build a scalable system capable of handling large datasets, future updates, and retraining of machine learning models.
* Ensure the platform is secure, reliable, and adaptable to accommodate growing user demand and additional features.

By accomplishing these objectives, the project aims to enhance transparency, efficiency, and confidence in asset valuation for the Alexandria community while demonstrating the power of machine learning in addressing real-world challenges.

## Key Features

* **Interactive User Interface:** A dynamic and engaging interface allows users to interact with the platform in real-time.
* **Secure Authentication:** Robust sign-up and login functionality protects user data and provides a personalized experience.
* **Asset Price Prediction:** Machine learning models provide accurate predictions for asset prices, including gold, currency, and real estate.
* **Data-Driven Insights:** Users can access valuable market insights, trends, and visualizations to support their decision-making.
* **Error Handling:** Implemented error handling provides informative feedback to the user.
* **Scalable Architecture:** The system is designed to handle large datasets and future growth.

## Technologies Used

* Frontend:  (Add specific frontend technologies here, e.g., React, Vue.js, etc.)
* Backend:   (Add specific backend technologies here, e.g., Node.js, Python/Django, etc.)
* Database:  (Add database technology here, e.g., PostgreSQL, MongoDB, etc.)
* Machine Learning: (Add ML libraries here, e.g., scikit-learn, TensorFlow, etc.)

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

* Node.js and npm:  (Link to Node.js installation guide)
* (Add any other prerequisites, e.g., Python, a specific database, etc.)

### Installation

1.  Clone the repository:
    ```bash
    git clone [https://github.com/mohamedmodar/Inveslty.git](https://github.com/mohamedmodar/Inveslty.git)
    cd Inveslty
    ```
2.  Install backend dependencies:
    ```bash
    cd backend  # Navigate to the backend folder
    npm install
    ```
3.  Install frontend dependencies:
    ```bash
    cd ../frontend  # Navigate to the frontend folder
    npm install
    ```
    Install model dependencies:
    ```bash
    cd backend/predictor 
    pip install -r requirements. txt
    ```
4.  Configure the environment:
    * Create a `.env` file in the `backend` directory.
    * Add the necessary environment variables (e.g., database connection string, API keys, etc.).  See the `.env.example` file for a template.

### Running the Application

1.  Start the backend server:
    ```bash
    cd backend
    npm run start
    ```
    This will typically start the server at `http://localhost:3000` (or a similar port, as defined in your `.env` file).


2 start python server: 
```bash
 cd backend/predictor
 uvicorn main:app --reload
```

2.  Start the frontend development server:
    ```bash
    cd ../frontend
    npm run dev
    ```
    This will usually start the frontend server at `http://localhost:5173` (or a similar port).  The application should automatically open in your browser.

##  Backend API Documentation



## Frontend Components



## Contributing



## License

Copyright (c) 2025 FCDS, Graduation Project

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## System Integration Architecture

### Overview
The Investly platform is built with a modern three-tier architecture, integrating a machine learning model, a FastAPI backend, and a React frontend. This section details how these components work together to provide a seamless apartment price prediction service.

### Components Integration

#### 1. Machine Learning Model
- The model is trained to predict apartment prices in Alexandria, Egypt
- Stored as a serialized file (`price_predictor_model.pkl`) in the backend directory
- Utilizes features including:
  - District location
  - Number of rooms and bathrooms
  - Property size in square meters
  - Floor number
  - Finish type
  - View type
  - Year built

#### 2. Backend (FastAPI)
- Located in `/backend/predictor/`
- Key features:
  - RESTful API endpoints for prediction and health checks
  - CORS middleware for frontend communication
  - Automatic model loading at startup
  - District data integration for location-based pricing
  - Input validation using Pydantic models
  - Error handling and status monitoring

##### API Endpoints:
- `GET /`: Welcome message
- `GET /health`: System health check
- `POST /predict`: Price prediction endpoint
  - Accepts apartment features as JSON
  - Returns predicted price

#### 3. Frontend (React)
- Located in `/frontend/`
- Features:
  - Modern React application with Vite
  - Responsive UI components
  - User authentication system
  - Multiple routes for different functionalities:
    - Home page
    - Investment analysis
    - Property selling
    - Community features
    - User authentication
  - Integrated chatbot for user assistance

### Data Flow
1. User inputs apartment details through the frontend interface
2. Frontend sends data to backend API endpoint
3. Backend validates input using Pydantic models
4. Model processes the features and generates prediction
5. Result is returned to frontend for display
6. User receives instant price prediction

### Security Features
- CORS protection for API endpoints
- Input validation on both frontend and backend
- Secure model loading and error handling
- Environment variable support for sensitive configurations

### Development Setup
1. Backend:
   ```bash
   cd backend/predictor
   pip install -r requirements.txt
   python run.py
   ```

2. Frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

### Environment Variables
- `MODEL_PATH`: Path to the trained model file
- `DISTRICT_DATA_PATH`: Path to district pricing data

### Error Handling
- Comprehensive error handling at all levels
- User-friendly error messages
- System health monitoring
- Automatic recovery from common issues

### Future Improvements
- Real-time model updates
- Enhanced security features
- Performance optimization
- Additional prediction features
- Extended API documentation
