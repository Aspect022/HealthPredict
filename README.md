# HealthPredict 🏥

[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

**HealthPredict** is an advanced AI-powered health prediction platform that leverages machine learning models to predict various health conditions. The platform provides early detection and risk assessment for multiple diseases, helping users make informed healthcare decisions.

## 🌟 Features

### 🔬 Disease Prediction Models
The platform offers prediction models for **8 major health conditions**:

1. **Diabetes Prediction** - Analyzes glucose levels, BMI, blood pressure, and lifestyle factors
2. **Heart Disease Prediction** - Evaluates cardiovascular health based on cholesterol, blood pressure, and age
3. **Depression Detection** - Early detection of depression symptoms in students under academic pressure
4. **Stroke Risk Assessment** - Predicts stroke risk using health metrics and lifestyle factors
5. **Parkinson's Disease** - Comprehensive assessment using neurological and health indicators
6. **Thyroid Disorder Detection** - Identifies potential thyroid conditions based on symptoms and test results
7. **Hepatitis Prediction** - Analyzes liver function markers and clinical indicators
8. **Kidney Disease Detection** - Comprehensive kidney health assessment using multiple biomarkers

### 🤖 AI-Powered Features
- **AI Health Assistant** - Interactive chatbot for health-related queries and guidance
- **Medical Document Analysis** - PDF upload and AI-powered analysis of medical reports using Google Gemini AI
- **Risk Assessment** - Real-time health risk categorization (High Risk/Low Risk)

### 👤 User Management
- Secure user authentication (Signup/Login)
- User profile management
- Password recovery functionality
- Session-based authorization

### 🎨 Modern UI/UX
- Beautiful, responsive design with dark/light theme support
- Intuitive navigation and user-friendly forms
- Real-time form validation
- Interactive data visualization with charts

## 🏗️ Project Architecture

```
HealthPredict/
├── Backend/          # FastAPI backend with ML models
│   ├── api/         # API route handlers
│   ├── core/        # Core business logic
│   ├── config/      # Configuration and database setup
│   ├── models/      # ML models (8 disease models)
│   ├── schemas/     # Pydantic schemas for validation
│   └── utils/       # Utility functions
│
├── Frontend/         # Next.js frontend application
│   ├── app/         # Next.js App Router pages
│   ├── components/  # Reusable React components
│   ├── context/     # React Context providers
│   ├── hooks/       # Custom React hooks
│   ├── lib/         # Utility libraries
│   └── public/      # Static assets
│
└── README.md        # This file
```

## 🚀 Tech Stack

### Backend
- **Framework**: FastAPI (Python)
- **Database**: SQLAlchemy ORM with MySQL/SQLite support
- **ML Libraries**: scikit-learn, joblib, numpy
- **AI Integration**: Google Gemini AI (gemini-2.0-flash-exp)
- **PDF Processing**: PyMuPDF (fitz)
- **Authentication**: passlib for password hashing
- **Environment Management**: python-dotenv

### Frontend
- **Framework**: Next.js 15 (React 19)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **UI Components**: Radix UI, shadcn/ui
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Charts**: Recharts
- **Theme**: next-themes for dark/light mode

## 📋 Prerequisites

- **Python**: 3.8 or higher
- **Node.js**: 18.0 or higher
- **npm** or **pnpm**: Latest version
- **MySQL**: Optional (SQLite is used by default)

## 🛠️ Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/Aspect022/HealthPredict.git
cd HealthPredict
```

### 2. Backend Setup

```bash
cd Backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env  # Create .env file and configure

# Run the backend server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The backend API will be available at: `http://localhost:8000`
API documentation (Swagger): `http://localhost:8000/docs`

### 3. Frontend Setup

```bash
cd Frontend

# Install dependencies
npm install
# or
pnpm install

# Configure environment variables
cp .env.example .env.local  # Create and configure

# Run the development server
npm run dev
# or
pnpm dev
```

The frontend application will be available at: `http://localhost:3000`

## 📚 Documentation

For detailed setup, configuration, and API documentation:

- **[Backend Documentation](./Backend/README.md)** - Detailed backend setup, API endpoints, and ML model information
- **[Frontend Documentation](./Frontend/README.md)** - Frontend architecture, components, and development guide

## 🔑 Environment Variables

### Backend (.env)
```env
DATABASE_URL=sqlite:///./health_predict.db
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL_NAME=gemini-2.0-flash-exp
SECRET_KEY=your_secret_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

## 📊 Machine Learning Models

All ML models are pre-trained and stored in the `Backend/models/` directory. Each disease has its own subdirectory containing a `model.pkl` file:

- **Diabetes**: `models/diabetes/model.pkl`
- **Heart**: `models/Heart/model.pkl`
- **Depression**: `models/Depression/model.pkl`
- **Stroke**: `models/Stroke/model.pkl`
- **Parkinson's**: `models/Parkinsons/model.pkl`
- **Thyroid**: `models/Thyroid/model.pkl`
- **Hepatitis**: `models/Hepatits/model.pkl` *(Note: directory name is 'Hepatits' in the codebase)*
- **Kidney**: `models/Kidney/model.pkl`

Models are loaded using `joblib` and predictions are made using scikit-learn's prediction interface.

## 🛣️ API Endpoints

### User Management
- `POST /api/v1/signup` - User registration
- `POST /api/v1/login` - User authentication

### Disease Prediction
- `POST /api/v1/predict/diabetes` - Diabetes prediction
- `POST /api/v1/predict/heart` - Heart disease prediction
- `POST /api/v1/predict/depression` - Depression detection
- `POST /api/v1/predict/stroke` - Stroke risk prediction
- `POST /api/v1/predict/parkinsons` - Parkinson's disease prediction
- `POST /api/v1/predict/thyroid` - Thyroid disorder prediction
- `POST /api/v1/predict/hepatitis` - Hepatitis prediction
- `POST /api/v1/predict/kidney` - Kidney disease prediction

### AI Features
- `POST /api/v1/analyze-pdf` - Medical document analysis

## 🔒 Security Features

- Password hashing using passlib
- SQL injection prevention with SQLAlchemy ORM
- CORS configuration for secure cross-origin requests
- Input validation using Pydantic schemas
- Environment variable protection for sensitive data

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Machine learning models trained on publicly available healthcare datasets
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- AI capabilities powered by Google Gemini

## 📧 Contact

For questions, suggestions, or support, please open an issue on GitHub.

---

**⚠️ Medical Disclaimer**: This platform is for educational and informational purposes only. It should not be used as a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.

