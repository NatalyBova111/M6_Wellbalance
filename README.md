# 🌿 WellBalance — Wellness & Nutrition Tracker

**WellBalance** is a modern web application for tracking nutrition, calories, macronutrients  and overall well-being.  
The project is built with **Next.js**, **Supabase**, and an integrated **AI chat assistant (Gemini)**.

![home](image.png)
---

## ✨ Key Features

## 🔐 Authentication (Supabase)
- Sign up & login with email and password  
- User profiles stored in `auth.users` + `profiles`  

---

## 📊 Dashboard

The dashboard includes several interactive charts and summaries:

### **1. Today’s Progress**
- Daily calorie consumption  
- Comparison with personal calorie goals  
- Navigation between days  
  ![dashboard1](image-1.png)

### **2. Macronutrients Balance**
- Ring chart showing total macros  
- Progress bars for: **Protein**, **Carbs**, **Fat**  
- Based on user-defined daily goals  
  ![dashboard2](image-2.png)

### **3. Weekly Calorie Trend**
- Line chart showing the last 7 days  
- Tooltips with exact calorie values  
- Highlights the selected day  
![dashboard3](image-3.png)

---

## 🍽️ Meals & Foods

### Add Meal – categorized food items  
Food items are organized into categories:

- **Protein**  
- **Carbs**  
- **Fat**  
- **Vegetables**  
- **Fruits**  
- **Custom Foods** (user-created)
![Meals1](image-4.png)

Users can:
- Select foods  
- Adjust quantities  
- **Create custom food cards**, saved permanently in their database  
![Meals2](image-5.png)
---

## 🎯 User Goals (Profile)

On the **Profile** page, users can define personal daily targets:

- Calories  
- Protein  
- Carbs  
- Fat  

These values influence:
- Dashboard visualizations  
- Daily progress calculations  
- AI assistant responses  

![Profile](image-6.png)
---

## 🤖 AI Chat Assistant (Gemini)

The built-in AI assistant can:

- Answer questions about nutrition, habits, and wellness  
- Switch conversation styles (neutral, casual, formal, pirate)  
- Save chat history locally  

### 🔍 Access to real user data  
The assistant fetches live data from Supabase, including:

- daily consumed calories  
- protein, carb, and fat totals  
- personal goal values  

Example questions:
- “How many calories have I eaten today?”  
- “How much protein do I still need?”  
- “Compare my past 7 days.”  
![Chat](image-7.png)
---

## 💧 Water & Sleep

The **Water & Sleep** page exists but is **reserved for future development**.

Planned features:
- Daily water intake tracking  
- Sleep duration & quality  
- Visual charts & trends  

---

## 🎨 UI Design 

Designed in **Figma Make**, inspired by wellness apps:

- soft green palette  
- minimal light interface   
- rounded components for a calming aesthetic  

---

## 🧩 Tech Stack

### Frontend
- Next.js  
- React Server & Client Components  
- Tailwind CSS  
- Storybook  
- Recharts  

### Backend
- Supabase (Auth, PostgreSQL, RLS Policies)  
- Auto-generated TypeScript types  

### 🤖 AI
- Google Gemini (in-app assistant)  
- GitHub Copilot (development assistance)  
- OpenAI GPT (additional help during development)  

---

## 🗄️ Database Schema 

Main tables:
- `profiles`  
- `daily_logs`  
- `meals`  
- `meal_items`  
- `foods`  
- `user_targets`  
- `water_intake`  
- `sleep_logs`  

---

## 🚀 Deployment

The project is deployed on Vercel.

**Production:**  
👉 https://m6-wellbalance-git-main-bovaria111-9413s-projects.vercel.app  

---

## ✍️ Author

**Nataly Bova**  
Design, development, and AI integration  
GitHub: https://github.com/NatalyBova111
