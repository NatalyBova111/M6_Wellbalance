# MVP Specification (BMAD Style)

## 1. **Background**

The *WellBalance* application is a wellness‑tracking tool that helps users monitor their nutrition, hydration, sleep, and overall health patterns. The goal is to create a simple and intuitive MVP that allows users to register, log in, manage basic health-related entries (e.g., meals/foods), and view their wellness dashboard.

This MVP will serve as the foundation for future development such as advanced analytics, habit formation tools, charts, and interactive coaching.

---

## 2. **Motivation**

Modern users want to track their health habits without complexity. Many existing apps are overloaded, require subscriptions, or have poor UX. The motivation behind *WellBalance* is to provide:

* **Simple onboarding** with email authentication via Supabase.
* **Clean and minimal dashboard** to monitor wellness activities.
* **Easy data entry** for foods and meals.
* **Secure storage** of user data tied to user profile.

This MVP ensures:
✔ Foundational architecture
✔ Authentication flow
✔ Basic CRUD functionality
✔ Ready-to-extend database schema

---

## 3. Actions

This section lists all user-facing and system actions for the MVP.

### 3.1 Authentication

* Sign Up using email + password (Supabase Auth)
* Login using email + password
* Email confirmation flow
* Redirect to dashboard after login
* Store basic profile data (full name, email) in `profiles` / user metadata

### 3.2 Dashboard

* Display a personalized welcome message with the user name
* Show **Today’s Progress** card for the selected date:
  * total daily calories consumed
  * remaining calories based on the user’s daily target
  * progress bar for daily calories
* Show **Macronutrients Balance**:
  * total protein, carbs, and fat for the selected day
  * simple ring visualization and per-macro progress bars
* Use `daily_logs` table (linked to the authenticated user) to store:
  * `total_calories`, `protein_g`, `carbs_g`, `fat_g`
* Use `user_targets` table to store individual daily targets and apply them on the dashboard
* Allow switching between days (previous / next) via query parameter `?date=YYYY-MM-DD`
* Provide a prominent **“Add Meal”** button that navigates to `/dashboard/meals`

### 3.3 Foods & Meals

* Maintain a **foods library** using the `foods` table with fields:
  * `name`, `serving_qty`, `serving_unit`
  * `calories_per_serving`, `protein_per_serving`, `carbs_per_serving`, `fat_per_serving`
  * `macro_category` (Protein, Carbs, Fat, Vegetables, Fruits)
  * `is_public` and optional `owner_id` for user-specific foods
* Provide an **Add Meal** page (`/dashboard/meals`) where the user can:
  * browse foods grouped by macro category
  * search foods by name
  * open a dialog to select a portion (grams) and see calculated calories + macros
  * add the chosen amount to the current day
* When a meal item is added:
  * call an API route that updates aggregated values in `daily_logs`
  * ensure multiple additions on the same day are summed cumulatively
* Provide an **“Add your own product”** form that:
  * allows creating custom foods with the same macro fields
  * stores them in the `foods` table
  * makes them available in the Add Meal list

### 3.4 UI / Component Library

* Use **shadcn/ui** (Button, Input and related components) for a consistent look & feel
* Use Tailwind CSS (with a custom theme) for layout and styling
* Ensure sign-in, sign-up, dashboard, home, and profile pages share a consistent design system

### 3.5 Profile & Targets

* Provide a **Profile** page where the user can:
  * see a profile header with name, email, and initials avatar
  * view current daily targets (calories, protein, carbs, fat)
  * edit daily targets via a dedicated form
* Store daily targets per user in the `user_targets` table and use them in dashboard calculations

### 3.6 AI Chat Assistant (bonus MVP feature)

* Provide a **Chat** page with an AI assistant interface
* Allow the user to:
  * send messages and receive streaming responses
  * choose a tone (neutral, casual, formal, pirate)
* Integrate server-side tools:
  * `checkWeather` – fetch current weather from OpenWeatherMap
  * `base64` – encode/decode text
* Expose a quick access entrypoint on the home page as “AI Chat Assistant”


---

## 4. **Deliverables**

The MVP is considered complete when all items below are functional and tested.

### 4.1 Files / Code

* ✔ Next.js project with App Router
* ✔ Supabase client configured (server + browser)
* ✔ `database.types.ts` included
* ✔ Sign Up page (with email confirmation)
* ✔ Login page
* ✔ Profiles table working
* ✔ Dashboard page with:
  * Today’s Progress (calories and macros)
  * integration with `daily_logs` and `user_targets`
* ✔ Add Meal page with:
  * foods grouped by macro categories
  * portion selection and macro calculation
* ✔ Custom food creation form (Add your own product)
* ✔ shadcn/ui installed with at least Button + Input used
* ✔ All user-facing text in English
* ✔ AI Chat Assistant page with tone selector and tools (weather, base64) — bonus

### **4.2 Documentation**

* ✔ MVP Spec (this document)
* ✔ Database Schema (`schema.md` upcoming)
* ✔ Short notes on setup (CLI, types generation)


### 4.3 Functional Criteria

* New users can sign up → confirm email → log in → see the dashboard
* Users can set and update personal daily targets (calories and macros)
* Users can add foods and meals, and the dashboard reflects:
  * total daily calories
  * macro totals (protein, carbs, fat)
* Custom foods can be added and then used in the Add Meal flow
* AI Chat Assistant is accessible and responds to user messages
* No blocking console errors during normal usage

---

## 5. **Future Extensions (Optional)**

* Charts for calorie intake
* Daily logs (hydration, sleep, meals)
* AI‑powered habit suggestions
* Mobile layout improvements
* Multi-language support

---

## ✔ MVP Status: *Ready for Submission*

This document summarizes the BMAD-style MVP spec required for Task 3 and confirms that the application meets all core requirements.
