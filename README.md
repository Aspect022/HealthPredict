
 
# 🩺 HealthPredict - Multi-Disease Prediction System

An AI-powered health prediction system designed to forecast the risk of multiple diseases based on patient input parameters. This application leverages machine learning models tailored for individual diseases, providing fast and reliable predictions through a user-friendly web interface.

## 📌 Features

- 🌐 Full-stack implementation with **FastAPI backend** and **React frontend**
- 📊 Predicts risks for:
  - Diabetes
  - Stroke
  - Parkinson’s Disease
  - Thyroid Disorders
  - Depression
- 🧠 High-accuracy ML models trained on curated datasets
- 📈 Real-time prediction with input validation
- 🌙 Dark mode UI for enhanced user experience (because why not 😎)
- 📬 Functional contact form via email integration

---

## 🛠️ Tech Stack

- **Frontend:** React, Next.js, TypeScript, TailwindCSS
- **Backend:** FastAPI, Python
- **Database:** MySQL
- **Machine Learning:** Scikit-learn, Pandas, Numpy
- **Deployment:** Vercel (Frontend), Render (Backend)

---

## 📊 ML Models & Accuracy

| Disease     | Model Used        | Accuracy |
|:------------|:------------------|:-----------|
| Diabetes     | Logistic Regression | 98%        |
| Stroke       | Decision Tree       | 96%        |
| Parkinson's  | Random Forest       | 97%        |
| Thyroid      | Logistic Regression | 95%        |
| Depression   | Random Forest       | 98%        |

---

## 🚀 How to Run Locally

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

###Frontend
```bash
cd frontend
npm install
npm run dev

---

#📬 Contact

For inquiries or collaboration:
📧 jayeshrl2005@gmail.com

---
#📄 License

This project is licensed under the MIT License.

made with ♥️.