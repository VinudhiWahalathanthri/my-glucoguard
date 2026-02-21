# 🩺 GlucoGuard - AI powered Teen Diabetes Prevention App

A gamified web application designed to help teenagers (13+) understand, track, and reduce their risk of developing diabetes. The app combines AI-powered risk prediction, nutrition tracking, health suggestions, and gamified motivation to make healthy habits fun and engaging.

<img width="1090" height="611" alt="image" src="https://github.com/user-attachments/assets/413c34fe-7ae2-4bcc-a903-dd4eb1e1025b" />


---

## 🌍 Background Research

Teenagers are increasingly at risk of developing diabetes due to poor diet, excessive sugar intake, and low physical activity. Existing health apps often
- Focus on adults rather than teens
- Are overly complicated
- Lack gamification to engage young users
- May compromise user privacy

This app addresses these gaps with a teen-friendly, gamified, privacy-first approach.

---

## 🎯 Problem Statement

Teenagers face multiple challenges
- Lack awareness of diabetes risk factors
- Unknowingly consume high-sugar/high-calorie foods
- Avoid health apps due to complexity or boring UX
- Worry about personal data privacy

Our app provides **personalized risk assessment, nutrition tracking, and gamified health challenges** to solve these problems.

---

## 🌱 Sustainable Development Goal (SDG)

**SDG 3 – Good Health and Well-being**  
The app promotes early prevention, healthy habits, and awareness among young people to reduce long-term health risks.

---

## ✨ Features

- 🧠 **AI-based Diabetes Risk Prediction**
- 📸 **Food & Calorie Tracking** using **FatSecret API**
- 💡 **Health Suggestions** powered by **Gemini API**
- 🎮 **Gamification**: points, streaks, badges, and challenges
- 🔒 **Privacy-first design**: data stored locally, only for users 13+
- 👩‍💻 Easy-to-use onboarding

---

## 🤖 AI & Machine Learning

### Dataset
- **PIMA Indians Diabetes Dataset** (from Kaggle)

### Model
- **Custom-built Logistic Regression model**
- Features include:
  - Glucose
  - BMI
  - Age
  - Relevant teen health info
- Trained with standard ML practices
  - `StandardScaler` preprocessing
  - 80/20 train-test split
  - Evaluated for accuracy before integration
- Model exported with `joblib` (`diabetes_risk_model.pkl`)

### Integration
- Python backend service exposes risk prediction
- Frontend sends user profile and habits
- Returns **risk score and contributing factors** for display

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React.js + TypeScript + Vite |
| Backend / Database | Supabase (Auth & Storage) |
| ML & Prediction | Python, scikit-learn, pandas |
| APIs | FatSecret (calories), Gemini (suggestions) |

---

## 🎨 Design Considerations

- Targeted at **teenagers (13+)**
- Bright, playful, and gamified UI
- Clear onboarding to explain tracking & challenges
- Points, streaks, badges to motivate healthy habits
- Avatar reflects habits and risk visually

---

## 🏆 Why This App is Unique

- Built **specifically for teens**
- Combines **AI risk prediction + nutrition tracking + gamification**
- Strong focus on **privacy and security**
- Cross-platform Web + Mobile experience
- Provides **educational, preventive, and fun** engagement

---

## 🔐 Privacy & Ethics

- Only users aged **13+**
- **Local storage** keeps all user data private
- No sensitive health data is transmitted without consent
- AI predictions are for **educational purposes**, not diagnosis

---

## 💾 Environment Variables

For security, `.env` is not included. Instead, provide your own using `.env.example`.

### `.env.example`

```env
Copy .env.example to .env and fill in your Supabase project values.

🚀 Running Locally
```
Clone the repository:
```

git clone https://github.com/VinudhiWahalathanthri/my-glucoguard.git
cd your-repo
```

Install dependencies:

```
npm install
```

Create .env from example:

```
cp .env.example .env
```
Add your Supabase credentials to .env.

Run the app:
```
npm run dev
```
Open in browser:

http://localhost:8080
