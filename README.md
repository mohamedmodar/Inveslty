# Inveslty

**An investment insights and apartment price estimation platform focused on Alexandria, Egypt.**

Inveslty is a web application that brings together apartment price estimation and personalized investment guidance. Users can submit property details to receive an estimated apartment price, or complete an investment profile to receive AI-generated guidance based on the project's local market datasets.

> **Disclaimer:** Inveslty is an academic/personal software project. Its predictions and AI-generated suggestions are informational estimates, not financial, legal, or real-estate advice. They should not be used as the sole basis for a financial decision.

## Features

- **Apartment Price Estimation:** Submit property details such as district, area, rooms, bathrooms, floor, finishing type, view, and year built to receive an estimated price.
- **AI-Powered Investment Guidance:** Complete an investment questionnaire covering investment goals, risk tolerance, time horizon, capital, liquidity, and experience to receive personalized guidance.
- **User Authentication:** Registration and login with MongoDB-backed user accounts and cookie-based sessions.
- **Chat Interface:** A chatbot interface connected to the backend API.
- **Market Data Integration:** Uses local datasets containing current and forecasted prices and information about Alexandria's districts and neighborhoods.

## Screenshots

### Home Page
<img width="1830" height="875" alt="Screenshot 2025-06-11 155428" src="https://github.com/user-attachments/assets/4debd9cc-d151-4535-89cf-cce3625e8215" />

### Investment Questionnaire
<img width="907" height="743" alt="Screenshot 2025-06-15 180708" src="https://github.com/user-attachments/assets/08d22dae-ff41-452c-8b87-367190a0dae2" />

### Investment Results
<img width="575" height="745" alt="Screenshot 2025-06-15 132119" src="https://github.com/user-attachments/assets/f325c638-5f96-438d-9dee-2b2ac917ef42" />

### Apartment Price Estimation
<img width="1497" height="881" alt="Screenshot 2025-06-15 153926" src="https://github.com/user-attachments/assets/554d650d-17bf-46ee-8bc8-6cb653baf29d" />

## Architecture

The project consists of three main components:

| Component | Responsibility | Technologies |
|---|---|---|
| Frontend | User interface, forms, navigation | React, Vite, React Router, Tailwind CSS |
| Backend API | Authentication, database operations, business logic, API integration | Node.js, Express, TypeScript, MongoDB, Mongoose |
| Prediction Service | Apartment price inference | Python, FastAPI, pandas, scikit-learn, joblib, XGBoost |

### Request Flow

```text
React Frontend (Vite)
        |
        v
Node.js / Express API
        |
        +------> MongoDB
        |
        +------> Google Gemini API
        |
        +------> Python FastAPI Service
                       |
                       v
                Trained ML Model
```

**Apartment estimation:** The frontend sends property details to the Express `/predict-apartment` endpoint. The backend forwards the request to the Python `/predict` endpoint, which prepares the features and returns the model prediction.

**Investment guidance:** The frontend submits an investment profile to the authenticated Express endpoint. The backend saves the profile, loads the local market datasets, constructs a prompt, and requests a response from Google's Gemini API.

## Tech Stack

### Frontend
- React 19
- Vite 6
- React Router 7
- Tailwind CSS 4
- Axios
- React Markdown

### Backend
- Node.js
- Express 5
- TypeScript
- MongoDB and Mongoose
- Joi
- Cookie Parser, CORS, and Compression
- Google Generative AI SDK

### Machine Learning
- Python
- FastAPI
- pandas and NumPy
- scikit-learn
- XGBoost
- joblib
- Pydantic

## Repository Structure

```text
Inveslty/
├── backend/
│   ├── data/                 # Market datasets and prompt templates
│   ├── predictor/            # Python prediction service
│   │   ├── main.py
│   │   └── requirements.txt
│   ├── src/
│   │   ├── controllers/      # Request handling and application logic
│   │   ├── db/               # Mongoose models and database operations
│   │   ├── helpers/
│   │   ├── middlewares/
│   │   └── router/
│   ├── package.json
│   └── tsconfig.json
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── App.jsx
    │   └── main.jsx
    ├── package.json
    └── vite.config.js
```

## Getting Started

The frontend, backend API, MongoDB database, and Python prediction service run as separate processes during local development.

### Prerequisites

- Node.js and npm
- Python with support for the pinned dependencies
- A MongoDB database
- A Google Gemini API key for investment guidance
- The trained apartment price prediction model artifact

### 1. Clone the Repository

```bash
git clone https://github.com/mohamedmodar/Inveslty.git
cd Inveslty
```

### 2. Configure the Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend/` directory:

```env
MONGO_USERNAME=your_mongodb_username
MONGO_PASSWORD=your_mongodb_password
MONGO_CLUSTER_URL=your_mongodb_cluster_host
MONGO_DATABASE=your_database_name
GEMINI_API_KEY=your_gemini_api_key
PREDICTOR_API_URL=http://127.0.0.1:8000
```

The four `MONGO_*` variables are required for the backend to start.

`GEMINI_API_KEY` is required for the investment-guidance endpoint.

`PREDICTOR_API_URL` is optional. The backend defaults to `http://localhost:8000`.

**Never commit real credentials, API keys, or database passwords.**

### 3. Set Up the Python Prediction Service

From the repository root:

```bash
cd backend/predictor
python -m venv .venv
```

Activate the environment.

**Windows PowerShell:**

```powershell
.venv\Scripts\Activate.ps1
```

**macOS / Linux:**

```bash
source .venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

The prediction service expects the trained model file:

```text
backend/predictor/price_predictor_model.pkl
```

The service uses this filename by default. If the model is stored elsewhere, configure `MODEL_PATH` to point to it.

The district reference data is loaded from:

```text
backend/data/district_df.csv
```

This path can be overridden using `DISTRICT_DATA_PATH`.

Start the prediction service from the `backend/predictor/` directory:

```bash
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

Useful URLs:

- API root: http://127.0.0.1:8000/
- Health check: http://127.0.0.1:8000/health
- Interactive API documentation: http://127.0.0.1:8000/docs

### 4. Start the Node.js Backend

Open another terminal:

```bash
cd Inveslty/backend
npx nodemon --exec ts-node src/index.ts
```

The API starts at:

```text
http://localhost:9000
```

The server starts listening after successfully connecting to MongoDB.

### 5. Start the Frontend

Open another terminal:

```bash
cd Inveslty/frontend
npm install
npm run dev
```

Vite normally serves the application at:

```text
http://localhost:5173
```

## Main API Endpoints

The following routes are defined in the current backend code:

| Method | Endpoint | Description | Authentication |
|---|---|---|---|
| POST | `/auth/register` | Register a new user | No |
| POST | `/auth/login` | Authenticate a user | No |
| GET | `/users` | Retrieve users | Yes |
| PATCH | `/users/:id` | Update a user | Yes, owner check |
| DELETE | `/users/:id` | Delete a user | Yes, owner check |
| POST | `/investment-advice` | Save an investment profile and generate guidance | Yes |
| POST | `/predict-apartment` | Forward apartment details to the prediction service | No |
| POST | `/predict` | Proxy a prediction request to the Python service | No |
| POST | `/chatbot` | Chatbot endpoint | No |

The Python prediction service exposes:

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | API welcome message |
| GET | `/health` | Model and district-data loading status |
| POST | `/predict` | Generate an apartment price estimate |

## Data and Model

- Investment guidance uses local market files in `backend/data/`, including current prices, forecasted prices, area information, neighborhood information, and a prompt template.
- Apartment estimation uses district-level average price-per-meter data from `backend/data/district_df.csv`.
- The Python service loads a trained model artifact using `joblib`.
- Prediction quality depends on the training data, model, and evaluation process. No specific accuracy score is claimed here.

## Development Notes

Inveslty is an ongoing project. Areas for further improvement include:

- Centralized environment-based API configuration for the frontend.
- Stronger authentication and session management.
- More granular authorization and access control.
- Consistent input validation and error handling.
- Automated tests for backend routes and prediction logic.
- Deployment configuration and operational monitoring.

These are development priorities; the project should not be considered production-ready without further review.

## License

The original repository includes an MIT-style license notice attributed to FCDS Graduation Project (2025). Review the repository's licensing and contributor ownership arrangements before redistributing or reusing the project.
