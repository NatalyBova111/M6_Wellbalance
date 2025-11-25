# WellBalance – Database Schema

This document describes the **public schema** used by the WellBalance app
(Supabase project).

The schema is designed for a wellness & nutrition tracker with:

- user profiles (linked to `auth.users`)
- a shared + user-specific food catalog
- meals composed of foods (for future extensions)
- daily nutrition summary logs
- user-specific daily targets
- water intake tracking (future)
- sleep tracking (future)

---

## Tables Overview

**Core tables used in the current MVP:**

- `profiles`
- `daily_logs`
- `user_targets`
- `foods`

**Planned / partially used tables (for future features):**

- `meals`
- `meal_items`
- `water_intake`
- `sleep_logs`

Authentication is handled by **Supabase Auth**, using the built-in
`auth.users` table. Application tables reference `auth.users.id`
(via `profiles.id` or directly via `user_id`).

---

## ER Diagram (Mermaid)

> This is a conceptual diagram; column types may differ slightly in the actual DB.

```mermaid
erDiagram
  auth_users ||--|| profiles   : "1-1 (via id)"
  profiles   ||--o{ daily_logs : "has"
  profiles   ||--o{ user_targets : "has"
  profiles   ||--o{ meals      : "has"
  profiles   ||--o{ water_intake : "has"
  profiles   ||--o{ sleep_logs : "has"
  meals      ||--o{ meal_items : "has"
  foods      ||--o{ meal_items : "referenced by"

  auth_users {
    uuid id PK
  }

  profiles {
    uuid id PK FK "-> auth.users.id"
    text username
    text full_name
    text avatar_url
    timestamptz created_at
  }

  daily_logs {
    uuid id PK
    uuid user_id FK "-> profiles.id"
    date log_date
    int4 total_calories
    int4 protein_g
    int4 carbs_g
    int4 fat_g
    unique(user_id, log_date)
  }

  user_targets {
    uuid user_id PK FK "-> profiles.id"
    int4 daily_calories
    int4 protein_g
    int4 carbs_g
    int4 fat_g
  }

  foods {
    uuid id PK
    uuid owner_id FK "nullable (-> profiles.id)"
    text name
    text brand
    text serving_unit
    numeric serving_qty
    int4 calories_per_serving
    numeric protein_per_serving
    numeric carbs_per_serving
    numeric fat_per_serving
    text macro_category
    bool is_public
    timestamptz created_at
  }

  meals {
    uuid id PK
    uuid user_id FK "-> profiles.id"
    uuid log_id FK "-> daily_logs.id"
    text meal_type
    text note
    timestamptz created_at
  }

  meal_items {
    uuid id PK
    uuid meal_id FK "-> meals.id"
    uuid food_id FK "-> foods.id"
    numeric qty
    int4 calories_total
  }

  water_intake {
    uuid id PK
    uuid user_id FK "-> profiles.id"
    date log_date
    int4 ml
  }

  sleep_logs {
    uuid id PK
    uuid user_id FK "-> profiles.id"
    date date_on
    time bedtime
    time wake_time
    numeric total_sleep_hours
    int4 quality_score
    text note
    unique(user_id, date_on)
  }


Table Details
1. profiles

User profile data linked 1-to-1 with auth.users.

| Column       | Type          | Notes                                              |
| ------------ | ------------- | -------------------------------------------------- |
| `id`         | `uuid`        | PK, FK → `auth.users.id`                           |
| `username`   | `text`        | Optional display handle                            |
| `full_name`  | `text`        | Full name, used on the Profile and Dashboard pages |
| `avatar_url` | `text`        | Optional avatar image URL                          |
| `created_at` | `timestamptz` | Default `now()`                                    |

2. daily_logs

Daily nutrition summary per user and date.
Used on the Dashboard to render “Today’s Progress” and “Macronutrients Balance”.

| Column           | Type   | Notes                          |
| ---------------- | ------ | ------------------------------ |
| `id`             | `uuid` | PK                             |
| `user_id`        | `uuid` | FK → `profiles.id`             |
| `log_date`       | `date` | Unique together with `user_id` |
| `total_calories` | `int4` | Daily calories sum             |
| `protein_g`      | `int4` | Total protein in grams         |
| `carbs_g`        | `int4` | Total carbs in grams           |
| `fat_g`          | `int4` | Total fat in grams             |

3. user_targets

Daily nutrition goals per user.

| Column           | Type   | Notes                   |
| ---------------- | ------ | ----------------------- |
| `user_id`        | `uuid` | PK, FK → `profiles.id`  |
| `daily_calories` | `int4` | Target calories per day |
| `protein_g`      | `int4` | Protein target          |
| `carbs_g`        | `int4` | Carbs target            |
| `fat_g`          | `int4` | Fat target              |

4. foods

Food catalog: both global (is_public = true) and user-created (owner_id).

| Column                 | Type          | Notes                                                       |
| ---------------------- | ------------- | ----------------------------------------------------------- |
| `id`                   | `uuid`        | PK                                                          |
| `owner_id`             | `uuid`        | Nullable FK → `profiles.id`                                 |
| `name`                 | `text`        | Food name                                                   |
| `brand`                | `text`        | Optional                                                    |
| `serving_unit`         | `text`        | `"g"`, `"ml"`, etc                                          |
| `serving_qty`          | `numeric`     | Base serving amount                                         |
| `calories_per_serving` | `int4`        | Calories for serving                                        |
| `protein_per_serving`  | `numeric`     | Protein                                                     |
| `carbs_per_serving`    | `numeric`     | Carbs                                                       |
| `fat_per_serving`      | `numeric`     | Fat                                                         |
| `macro_category`       | `text`        | `"protein"`, `"carbs"`, `"fat"`, `"vegetables"`, `"fruits"` |
| `is_public`            | `bool`        | Visible to all users                                        |
| `created_at`           | `timestamptz` | Default `now()`                                             |

5. meals (future)

| Column       | Type          | Notes |
| ------------ | ------------- | ----- |
| `id`         | `uuid`        | PK    |
| `user_id`    | `uuid`        | FK    |
| `log_id`     | `uuid`        | FK    |
| `meal_type`  | `text`        |       |
| `note`       | `text`        |       |
| `created_at` | `timestamptz` |       |

6. meal_items (future)

| Column           | Type      | Notes |
| ---------------- | --------- | ----- |
| `id`             | `uuid`    | PK    |
| `meal_id`        | `uuid`    | FK    |
| `food_id`        | `uuid`    | FK    |
| `qty`            | `numeric` |       |
| `calories_total` | `int4`    |       |


7. water_intake (future)
8. sleep_logs (future)


